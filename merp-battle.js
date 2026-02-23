// MERP 2nd Edition - Battle Tracker Module
// Manages multi-combatant encounters: initiative, HP, status effects, round tracking
// Extends App object via monkey-patching (loaded after merp-app.js)

// ============================================================
// PREDEFINED STATUS EFFECTS
// ============================================================
App.battleStatusEffects = [
    { name: "Stunned", defaultRounds: 1, description: "Cannot act" },
    { name: "Stunned (no parry)", defaultRounds: 1, description: "Cannot parry, -20 DB" },
    { name: "Bleeding", defaultRounds: 3, description: "Loses HP each round" },
    { name: "Prone", defaultRounds: 1, description: "Must spend action to stand" },
    { name: "Immobilized", defaultRounds: 2, description: "Cannot move" },
    { name: "Dazed", defaultRounds: 1, description: "-20 to all actions" },
    { name: "Arm Broken", defaultRounds: -1, description: "Cannot use arm (-50 if weapon arm)" },
    { name: "Leg Broken", defaultRounds: -1, description: "Cannot move normally" },
    { name: "Unconscious", defaultRounds: -1, description: "Out of action" }
];

// ============================================================
// BATTLE STATE
// ============================================================
App.battle = {
    state: null,            // null | 'setup' | 'running'
    combatants: [],         // Array of combatant objects
    round: 0,
    currentTurnIndex: 0,
    log: [],
    nextId: 1,
    selectedId: null,       // Currently selected combatant for detail panel
    undoStack: []           // Array of state snapshots for undo (NOT persisted, max 20)
};

// ============================================================
// INITIALIZATION (monkey-patch App.init)
// ============================================================
const _origInit = App.init;
App.init = function() {
    _origInit.call(this);
    try {
        this.battleInit();
    } catch(e) {
        console.error('Battle initialization failed:', e);
        this.battle.state = 'setup';
        try { this.battleShowSetup(); } catch(e2) { /* ignore */ }
    }
};

App.battleInit = function() {
    this.battleLoadState();
    if (this.battle.state === 'running') {
        this.battleShowRunning();
    } else {
        this.battle.state = 'setup';
        this.battleShowSetup();
    }
};

// ============================================================
// PERSISTENCE
// ============================================================
App.battleSaveState = function() {
    const data = {
        state: this.battle.state,
        combatants: this.battle.combatants,
        round: this.battle.round,
        currentTurnIndex: this.battle.currentTurnIndex,
        log: this.battle.log.slice(0, 200),  // Keep last 200 entries
        nextId: this.battle.nextId,
        selectedId: this.battle.selectedId
    };
    localStorage.setItem('merp_battle_state', JSON.stringify(data));
};

App.battleLoadState = function() {
    try {
        const data = JSON.parse(localStorage.getItem('merp_battle_state'));
        if (data && data.state) {
            // Validate combatants array
            if (!Array.isArray(data.combatants)) {
                console.warn('Battle state corrupted: combatants not an array. Resetting.');
                localStorage.removeItem('merp_battle_state');
                return;
            }
            // Validate each combatant has required fields
            for (const c of data.combatants) {
                if (!c.id || !c.name || !c.hp || typeof c.hp.current !== 'number') {
                    console.warn('Battle state corrupted: invalid combatant. Resetting.');
                    localStorage.removeItem('merp_battle_state');
                    return;
                }
                if (!Array.isArray(c.statusEffects)) c.statusEffects = [];
            }
            this.battle.state = data.state;
            this.battle.combatants = data.combatants;
            this.battle.round = data.round || 0;
            this.battle.currentTurnIndex = data.currentTurnIndex || 0;
            this.battle.log = data.log || [];
            this.battle.nextId = data.nextId || 1;
            this.battle.selectedId = data.selectedId || null;
        }
    } catch(e) {
        console.error('Failed to load battle state:', e);
        localStorage.removeItem('merp_battle_state');
    }
};

// ============================================================
// SETUP PHASE
// ============================================================
App.battleShowSetup = function() {
    this.battle.state = 'setup';
    const setup = document.getElementById('battleSetup');
    const running = document.getElementById('battleRunning');
    if (setup) setup.style.display = '';
    if (running) running.style.display = 'none';

    this.battlePopulateDropdowns();
    this.battleRenderRoster();
};

App.battlePopulateDropdowns = function() {
    // PC dropdown
    const pcSel = document.getElementById('battlePCSelect');
    if (pcSel) {
        pcSel.innerHTML = '<option value="">-- Select Character --</option>';
        this.characters.forEach((c, i) => {
            const label = `${c.name || 'Unnamed'} (${c.profession} L${c.level})`;
            pcSel.innerHTML += `<option value="${i}">${label}</option>`;
        });
    }

    // NPC dropdown
    const npcSel = document.getElementById('battleNPCSelect');
    if (npcSel) {
        npcSel.innerHTML = '<option value="">-- Select NPC --</option>';
        if (MERP.npcCategories) {
            for (const [cat, names] of Object.entries(MERP.npcCategories)) {
                let opts = `<optgroup label="${cat}">`;
                for (const name of names) {
                    opts += `<option value="${name}">${name}</option>`;
                }
                opts += '</optgroup>';
                npcSel.innerHTML += opts;
            }
        }
    }
};

App.battleAddPCFromSelect = function() {
    const sel = document.getElementById('battlePCSelect');
    const idx = parseInt(sel.value);
    if (isNaN(idx)) { alert('Please select a character.'); return; }
    this.battleAddPC(idx);
    sel.value = '';
};

App.battleAddNPCFromSelect = function() {
    const sel = document.getElementById('battleNPCSelect');
    const name = sel.value;
    if (!name) { alert('Please select an NPC.'); return; }
    const count = Math.max(1, Math.min(20, parseInt(document.getElementById('battleNPCCount').value) || 1));
    this.battleAddNPC(name, count);
    sel.value = '';
    document.getElementById('battleNPCCount').value = '1';
};

App.battleAddCustomFromForm = function() {
    const name = document.getElementById('battleCustomName').value.trim();
    const hp = parseInt(document.getElementById('battleCustomHP').value);
    if (!name) { alert('Please enter a name.'); return; }
    if (!hp || hp <= 0) { alert('Please enter valid HP.'); return; }

    const initMod = parseInt(document.getElementById('battleCustomInitMod').value) || 0;
    const ob = parseInt(document.getElementById('battleCustomOB').value) || 0;
    const db = parseInt(document.getElementById('battleCustomDB').value) || 0;
    const team = document.getElementById('battleCustomTeam').value || 'enemy';

    this.battleAddCustom({ name, hp, initMod, ob, db, armor: 'No Armor', team });

    // Clear form
    document.getElementById('battleCustomName').value = '';
    document.getElementById('battleCustomHP').value = '';
    document.getElementById('battleCustomInitMod').value = '0';
    document.getElementById('battleCustomOB').value = '0';
    document.getElementById('battleCustomDB').value = '0';
};

App.battleAddPC = function(charIndex) {
    const char = this.characters[charIndex];
    if (!char) return;

    // Get primary weapon OB
    let ob = 0;
    if (char.weapons && char.weapons[0]) {
        ob = char.getWeaponOB(char.weapons[0]);
    }

    // Get Movement & Maneuver bonus for current armor (MERP initiative order)
    let mmBonus = 0;
    const currentArmor = char.armor || 'No Armor';
    const armorSkill = char.skills[currentArmor];
    if (armorSkill && typeof armorSkill.totalBonus === 'number') {
        mmBonus = armorSkill.totalBonus;
    } else {
        // Fallback: use AG stat bonus if M&M skill not found
        mmBonus = char.stats.AG ? char.stats.AG.totalBonus : 0;
    }

    const combatant = {
        id: this.battle.nextId++,
        name: char.name || 'Unnamed',
        source: 'character',
        sourceIndex: charIndex,
        sourceName: null,
        team: 'ally',
        hp: { current: char.hitPoints.current, max: char.hitPoints.max },
        initiative: 0,
        initiativeMod: mmBonus,
        ob: ob,
        db: char.defensiveBonus || 0,
        armor: currentArmor,
        statusEffects: [],
        defeated: false,
        notes: `${char.profession} L${char.level}`
    };

    this.battle.combatants.push(combatant);
    this.battleSaveState();
    this.battleRenderRoster();
};

App.battleAddNPC = function(templateName, count) {
    const npc = MERP.npcTemplates[templateName];
    if (!npc) return;

    count = count || 1;

    for (let i = 0; i < count; i++) {
        const suffix = count > 1 ? ` #${i + 1}` : '';
        const combatant = {
            id: this.battle.nextId++,
            name: templateName + suffix,
            source: 'npc',
            sourceIndex: null,
            sourceName: templateName,
            team: 'enemy',
            hp: { current: npc.hits, max: npc.hits },
            initiative: 0,
            initiativeMod: Math.floor(npc.level / 2),
            ob: npc.ob,
            db: npc.db,
            armor: npc.armor,
            statusEffects: [],
            defeated: false,
            notes: `L${npc.level} | ${npc.attackDesc} | ${npc.critType} | ${npc.size}`
        };
        this.battle.combatants.push(combatant);
    }

    this.battleSaveState();
    this.battleRenderRoster();
};

App.battleAddCustom = function(data) {
    const combatant = {
        id: this.battle.nextId++,
        name: data.name,
        source: 'custom',
        sourceIndex: null,
        sourceName: null,
        team: data.team || 'enemy',
        hp: { current: data.hp, max: data.hp },
        initiative: 0,
        initiativeMod: data.initMod || 0,
        ob: data.ob || 0,
        db: data.db || 0,
        armor: data.armor || 'No Armor',
        statusEffects: [],
        defeated: false,
        notes: ''
    };

    this.battle.combatants.push(combatant);
    this.battleSaveState();
    this.battleRenderRoster();
};

App.battleRemoveCombatant = function(id) {
    this.battle.combatants = this.battle.combatants.filter(c => c.id !== id);
    this.battleSaveState();
    this.battleRenderRoster();
};

App.battleClearRoster = function() {
    if (this.battle.combatants.length === 0) return;
    if (!confirm('Remove all combatants from the roster?')) return;
    this.battle.combatants = [];
    this.battle.nextId = 1;
    this.battleSaveState();
    this.battleRenderRoster();
};

App.battleRenderRoster = function() {
    const div = document.getElementById('battleRoster');
    const btn = document.getElementById('battleStartBtn');
    if (!div) return;

    if (this.battle.combatants.length === 0) {
        div.innerHTML = '<div style="color:var(--text-secondary);text-align:center;padding:20px;">No combatants added yet. Use the controls above to add PCs, NPCs, or custom combatants.</div>';
        if (btn) btn.disabled = true;
        return;
    }

    if (btn) btn.disabled = false;

    const allies = this.battle.combatants.filter(c => c.team === 'ally');
    const enemies = this.battle.combatants.filter(c => c.team === 'enemy');

    let html = '';

    if (allies.length > 0) {
        html += '<div style="color:var(--accent-blue);font-size:12px;font-weight:bold;margin-bottom:4px;text-transform:uppercase;">Allies</div>';
        for (const c of allies) {
            html += this._rosterCardHtml(c);
        }
    }

    if (enemies.length > 0) {
        html += '<div style="color:var(--accent-red);font-size:12px;font-weight:bold;margin:8px 0 4px;text-transform:uppercase;">Enemies</div>';
        for (const c of enemies) {
            html += this._rosterCardHtml(c);
        }
    }

    div.innerHTML = html;
};

App._rosterCardHtml = function(c) {
    const srcLabel = c.source === 'character' ? 'PC' : c.source === 'npc' ? 'NPC' : 'Custom';
    return `<div class="battle-roster-card ${c.team}">
        <div style="flex:1;">
            <strong style="color:var(--text-heading);">${c.name}</strong>
            <span style="font-size:11px;color:var(--text-secondary);margin-left:8px;">[${srcLabel}]</span>
            <div style="font-size:11px;color:var(--text-secondary);">
                HP: ${c.hp.max} | OB: ${c.ob} | DB: ${c.db} | Armor: ${c.armor}
                ${c.initiativeMod !== 0 ? ' | M&M: ' + (c.initiativeMod >= 0 ? '+' : '') + c.initiativeMod : ''}
            </div>
        </div>
        <button class="btn btn-danger btn-sm" onclick="App.battleRemoveCombatant(${c.id})" style="padding:2px 8px;">&times;</button>
    </div>`;
};

// ============================================================
// START BATTLE
// ============================================================
App.battleStart = function() {
    if (this.battle.combatants.length < 2) {
        alert('Add at least 2 combatants to start a battle.');
        return;
    }

    // MERP rules (Section 7.0): No initiative dice roll.
    // Turn order is determined by Movement & Maneuver Bonus (highest acts first).
    for (const c of this.battle.combatants) {
        c.initiative = c.initiativeMod;   // M&M bonus IS the initiative order
        c.initiativeRoll = null;           // No dice roll in MERP
    }

    // Sort by M&M bonus (descending), then alphabetical for ties
    this.battle.combatants.sort((a, b) => {
        if (b.initiative !== a.initiative) return b.initiative - a.initiative;
        return a.name.localeCompare(b.name);
    });

    this.battle.state = 'running';
    this.battle.round = 1;
    this.battle.currentTurnIndex = 0;
    this.battle.selectedId = this.battle.combatants[0].id;
    this.battle.log = [];

    // Log turn order
    this.battleLog('--- Battle Begins! ---');
    this.battleLog('Turn Order (by M&M Bonus):');
    for (const c of this.battle.combatants) {
        const sign = c.initiative >= 0 ? '+' : '';
        this.battleLog(`  ${sign}${c.initiative} - ${c.name}`);
    }
    this.battleLog('--- Round 1 ---');
    this.battleLog(`${this.battle.combatants[0].name}'s turn.`);

    this.battleSaveState();
    this.battleShowRunning();
};

// ============================================================
// RUNNING PHASE
// ============================================================
App.battleShowRunning = function() {
    const setup = document.getElementById('battleSetup');
    const running = document.getElementById('battleRunning');
    if (setup) setup.style.display = 'none';
    if (running) running.style.display = '';

    this.battleRender();
};

App.battleRender = function() {
    try { this.battleRenderHeader(); } catch(e) { console.error('battleRenderHeader error:', e); }
    try { this.battleRenderInitiativeList(); } catch(e) { console.error('battleRenderInitiativeList error:', e); }
    try { this.battleRenderDetail(); } catch(e) { console.error('battleRenderDetail error:', e); }
    try { this.battleRenderLog(); } catch(e) { console.error('battleRenderLog error:', e); }

    // Update undo button state
    const undoBtn = document.getElementById('battleUndoBtn');
    if (undoBtn) {
        const canUndo = this.battle.undoStack && this.battle.undoStack.length > 0;
        undoBtn.disabled = !canUndo;
        undoBtn.style.opacity = canUndo ? '1' : '0.4';
    }
};

App.battleRenderHeader = function() {
    const roundNum = document.getElementById('battleRoundNum');
    if (roundNum) roundNum.textContent = this.battle.round;

    const current = this.battle.combatants[this.battle.currentTurnIndex];
    const turnInfo = document.getElementById('battleTurnInfo');
    if (turnInfo && current) {
        turnInfo.innerHTML = `Current Turn: <strong style="color:var(--text-heading)">${current.name}</strong>`;
    }
};

App.battleRenderInitiativeList = function() {
    const div = document.getElementById('battleInitiativeList');
    if (!div) return;

    let html = '';
    for (let i = 0; i < this.battle.combatants.length; i++) {
        const c = this.battle.combatants[i];
        const isCurrent = (i === this.battle.currentTurnIndex);
        const isSelected = (c.id === this.battle.selectedId);
        const hpPct = c.hp.max > 0 ? Math.max(0, Math.round((c.hp.current / c.hp.max) * 100)) : 0;
        const hpClass = hpPct > 60 ? 'hp-high' : hpPct > 25 ? 'hp-mid' : 'hp-low';

        let classes = 'battle-combatant-card';
        classes += ` ${c.team}`;
        if (isCurrent) classes += ' current-turn';
        if (isSelected) classes += ' selected';
        if (c.defeated) classes += ' defeated';

        let statusHtml = '';
        if (c.statusEffects.length > 0) {
            statusHtml = '<div style="margin-top:2px;">';
            for (const eff of c.statusEffects) {
                const cssClass = this._statusCssClass(eff.name);
                const roundsText = eff.roundsLeft < 0 ? '' : ` (${eff.roundsLeft}r)`;
                statusHtml += `<span class="battle-status-tag ${cssClass}">${eff.name}${roundsText}</span>`;
            }
            statusHtml += '</div>';
        }

        const initSign = c.initiative >= 0 ? '+' : '';
        html += `<div class="${classes}" onclick="App.battleSelectCombatant(${c.id})">
            <div class="battle-init-num" title="M&M Bonus">${initSign}${c.initiative}</div>
            <div class="battle-combatant-info">
                <div class="battle-combatant-name">${c.name}</div>
                <div class="battle-combatant-hp-text">HP: ${c.hp.current} / ${c.hp.max}</div>
                <div class="battle-hp-bar"><div class="battle-hp-bar-fill ${hpClass}" style="width:${hpPct}%"></div></div>
                ${statusHtml}
            </div>
        </div>`;
    }

    div.innerHTML = html;
};

App._statusCssClass = function(name) {
    const lower = name.toLowerCase();
    if (lower.includes('stun')) return 'status-stunned';
    if (lower.includes('bleed')) return 'status-bleeding';
    if (lower.includes('prone')) return 'status-prone';
    if (lower.includes('immob')) return 'status-immobilized';
    if (lower.includes('daze')) return 'status-dazed';
    return 'status-default';
};

App.battleSelectCombatant = function(id) {
    this.battle.selectedId = id;
    this.battleSaveState();
    this.battleRenderInitiativeList();
    this.battleRenderDetail();
};

App.battleRenderDetail = function() {
    const div = document.getElementById('battleDetailContent');
    if (!div) return;

    const c = this.battle.combatants.find(x => x.id === this.battle.selectedId);
    if (!c) {
        div.innerHTML = '<div style="color:var(--text-secondary);text-align:center;padding:40px;">Click a combatant to view details.</div>';
        return;
    }

    const hpPct = c.hp.max > 0 ? Math.max(0, Math.round((c.hp.current / c.hp.max) * 100)) : 0;
    const hpClass = hpPct > 60 ? 'hp-high' : hpPct > 25 ? 'hp-mid' : 'hp-low';
    const teamColor = c.team === 'ally' ? 'var(--accent-blue)' : 'var(--accent-red)';
    const teamLabel = c.team === 'ally' ? 'ALLY' : 'ENEMY';

    // Status effects list with remove buttons
    let statusHtml = '';
    if (c.statusEffects.length > 0) {
        for (let si = 0; si < c.statusEffects.length; si++) {
            const eff = c.statusEffects[si];
            const cssClass = this._statusCssClass(eff.name);
            const roundsText = eff.roundsLeft < 0 ? 'Permanent' : `${eff.roundsLeft} round${eff.roundsLeft !== 1 ? 's' : ''} left`;
            statusHtml += `<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
                <span class="battle-status-tag ${cssClass}">${eff.name}</span>
                <span style="font-size:11px;color:var(--text-secondary);">${roundsText} - ${eff.description}</span>
                <button class="btn btn-danger btn-sm" onclick="App.battleRemoveStatus(${c.id}, ${si})" style="padding:1px 6px;font-size:10px;margin-left:auto;">&times;</button>
            </div>`;
        }
    } else {
        statusHtml = '<div style="color:var(--text-secondary);font-size:12px;">No active effects</div>';
    }

    // Status effect add dropdown
    let statusOptions = '';
    for (const eff of App.battleStatusEffects) {
        statusOptions += `<option value="${eff.name}">${eff.name} (${eff.defaultRounds < 0 ? 'perm' : eff.defaultRounds + 'r'})</option>`;
    }
    statusOptions += '<option value="__custom__">Custom...</option>';

    let html = `
        <div style="margin-bottom:12px;">
            <div style="font-size:18px;font-weight:bold;color:var(--text-heading);font-family:var(--font-heading);">${c.name}</div>
            <div style="font-size:12px;color:${teamColor};font-weight:bold;text-transform:uppercase;">${teamLabel}</div>
            ${c.notes ? `<div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">${c.notes}</div>` : ''}
        </div>

        <!-- Stats -->
        <div class="grid-4 gap-sm mb-2">
            <div class="battle-detail-stat">
                <div class="stat-label">M&M Bonus</div>
                <div class="stat-value">${c.initiative >= 0 ? '+' : ''}${c.initiative}</div>
            </div>
            <div class="battle-detail-stat">
                <div class="stat-label">OB</div>
                <div class="stat-value">${c.ob}</div>
            </div>
            <div class="battle-detail-stat">
                <div class="stat-label">DB</div>
                <div class="stat-value">${c.db}</div>
            </div>
            <div class="battle-detail-stat">
                <div class="stat-label">Armor</div>
                <div class="stat-value" style="font-size:12px;">${c.armor}</div>
            </div>
        </div>

        <!-- HP Management -->
        <div class="card mb-1">
            <div style="color:var(--text-heading);font-size:13px;font-weight:bold;margin-bottom:8px;">Hit Points</div>
            <div style="font-size:24px;font-weight:bold;font-family:var(--font-heading);color:${hpPct > 25 ? 'var(--text-highlight)' : 'var(--accent-red)'};">
                ${c.hp.current} / ${c.hp.max}
            </div>
            <div class="battle-hp-bar" style="height:14px;margin:8px 0;">
                <div class="battle-hp-bar-fill ${hpClass}" style="width:${hpPct}%"></div>
            </div>
            <div class="flex-row gap-sm mt-1">
                <label style="margin:0;white-space:nowrap;">Amount:</label>
                <input type="number" id="battleDmgAmount_${c.id}" value="10" min="1" style="width:70px;">
                <button class="btn btn-danger btn-sm" onclick="App.battleDamageFromInput(${c.id})">Damage</button>
                <button class="btn btn-success btn-sm" onclick="App.battleHealFromInput(${c.id})">Heal</button>
                ${c.defeated ?
                    `<button class="btn btn-primary btn-sm" onclick="App.battleRevive(${c.id})">Revive</button>` :
                    `<button class="btn btn-danger btn-sm" onclick="App.battleDefeat(${c.id})" style="font-size:10px;">Defeat</button>`
                }
            </div>
        </div>

        <!-- Status Effects -->
        <div class="card">
            <div style="color:var(--text-heading);font-size:13px;font-weight:bold;margin-bottom:8px;">Status Effects</div>
            ${statusHtml}
            <div class="flex-row gap-sm mt-1" style="border-top:1px solid var(--border-light);padding-top:8px;">
                <select id="battleStatusSelect_${c.id}" style="flex:1;" onchange="App.battleOnStatusSelect(${c.id})">
                    <option value="">-- Add Effect --</option>
                    ${statusOptions}
                </select>
                <input type="number" id="battleStatusRounds_${c.id}" value="1" min="-1" style="width:60px;" title="Rounds (-1 = permanent)">
                <button class="btn btn-primary btn-sm" onclick="App.battleAddStatusFromInput(${c.id})">Add</button>
            </div>
            <div id="battleCustomStatusRow_${c.id}" style="display:none;" class="flex-row gap-sm mt-1">
                <input type="text" id="battleCustomStatusName_${c.id}" placeholder="Effect name" style="flex:1;">
                <input type="text" id="battleCustomStatusDesc_${c.id}" placeholder="Description" style="flex:1;">
            </div>
        </div>
    `;

    div.innerHTML = html;
};

App.battleOnStatusSelect = function(combatantId) {
    const sel = document.getElementById(`battleStatusSelect_${combatantId}`);
    const customRow = document.getElementById(`battleCustomStatusRow_${combatantId}`);
    const roundsInput = document.getElementById(`battleStatusRounds_${combatantId}`);

    if (sel.value === '__custom__') {
        customRow.style.display = 'flex';
    } else {
        customRow.style.display = 'none';
        // Set default rounds for selected effect
        const eff = App.battleStatusEffects.find(e => e.name === sel.value);
        if (eff && roundsInput) {
            roundsInput.value = eff.defaultRounds;
        }
    }
};

App.battleAddStatusFromInput = function(combatantId) {
    const sel = document.getElementById(`battleStatusSelect_${combatantId}`);
    const roundsInput = document.getElementById(`battleStatusRounds_${combatantId}`);
    const rounds = parseInt(roundsInput.value);

    if (!sel.value) { alert('Please select a status effect.'); return; }
    if (isNaN(rounds)) { alert('Please enter valid rounds.'); return; }

    let name, description;
    if (sel.value === '__custom__') {
        name = document.getElementById(`battleCustomStatusName_${combatantId}`).value.trim();
        description = document.getElementById(`battleCustomStatusDesc_${combatantId}`).value.trim();
        if (!name) { alert('Please enter an effect name.'); return; }
    } else {
        name = sel.value;
        const eff = App.battleStatusEffects.find(e => e.name === name);
        description = eff ? eff.description : '';
    }

    this.battleAddStatus(combatantId, name, rounds, description);
    sel.value = '';
    const customRow = document.getElementById(`battleCustomStatusRow_${combatantId}`);
    if (customRow) customRow.style.display = 'none';
};

App.battleDamageFromInput = function(combatantId) {
    const input = document.getElementById(`battleDmgAmount_${combatantId}`);
    const amount = parseInt(input.value);
    if (!amount || amount <= 0) { alert('Enter a positive damage amount.'); return; }
    this.battleDamage(combatantId, amount);
};

App.battleHealFromInput = function(combatantId) {
    const input = document.getElementById(`battleDmgAmount_${combatantId}`);
    const amount = parseInt(input.value);
    if (!amount || amount <= 0) { alert('Enter a positive heal amount.'); return; }
    this.battleHeal(combatantId, amount);
};

// ============================================================
// COMBAT ACTIONS
// ============================================================
App.battleDamage = function(id, amount) {
    const c = this.battle.combatants.find(x => x.id === id);
    if (!c) return;
    this.battleSnapshot();

    c.hp.current = Math.max(0, c.hp.current - amount);
    this.battleLog(`${c.name} takes ${amount} damage. (HP: ${c.hp.current}/${c.hp.max})`);

    if (c.hp.current <= 0 && !c.defeated) {
        c.defeated = true;
        this.battleLog(`${c.name} is defeated!`);
    }

    this.battleSaveState();
    this.battleRender();
};

App.battleHeal = function(id, amount) {
    const c = this.battle.combatants.find(x => x.id === id);
    if (!c) return;
    this.battleSnapshot();

    const old = c.hp.current;
    c.hp.current = Math.min(c.hp.max, c.hp.current + amount);
    const healed = c.hp.current - old;
    this.battleLog(`${c.name} heals ${healed} HP. (HP: ${c.hp.current}/${c.hp.max})`);

    this.battleSaveState();
    this.battleRender();
};

App.battleDefeat = function(id) {
    const c = this.battle.combatants.find(x => x.id === id);
    if (!c || c.defeated) return;
    this.battleSnapshot();

    c.defeated = true;
    this.battleLog(`${c.name} is defeated!`);
    this.battleSaveState();
    this.battleRender();
};

App.battleRevive = function(id) {
    const c = this.battle.combatants.find(x => x.id === id);
    if (!c || !c.defeated) return;
    this.battleSnapshot();

    c.defeated = false;
    if (c.hp.current <= 0) c.hp.current = 1;
    this.battleLog(`${c.name} is revived! (HP: ${c.hp.current}/${c.hp.max})`);
    this.battleSaveState();
    this.battleRender();
};

App.battleAddStatus = function(id, effectName, rounds, description) {
    const c = this.battle.combatants.find(x => x.id === id);
    if (!c) return;
    this.battleSnapshot();

    c.statusEffects.push({
        name: effectName,
        roundsLeft: rounds,
        description: description || ''
    });

    const roundsText = rounds < 0 ? 'permanent' : `${rounds} round${rounds !== 1 ? 's' : ''}`;
    this.battleLog(`${c.name} gains status: ${effectName} (${roundsText})`);

    this.battleSaveState();
    this.battleRender();
};

App.battleRemoveStatus = function(id, effectIndex) {
    const c = this.battle.combatants.find(x => x.id === id);
    if (!c || effectIndex < 0 || effectIndex >= c.statusEffects.length) return;
    this.battleSnapshot();

    const removed = c.statusEffects.splice(effectIndex, 1)[0];
    this.battleLog(`${c.name} loses status: ${removed.name}`);

    this.battleSaveState();
    this.battleRender();
};

App.battleTickStatuses = function(combatant) {
    // Called at the START of a combatant's turn
    const expired = [];
    combatant.statusEffects = combatant.statusEffects.filter(eff => {
        if (eff.roundsLeft < 0) return true;  // Permanent
        eff.roundsLeft--;
        if (eff.roundsLeft <= 0) {
            expired.push(eff.name);
            return false;
        }
        return true;
    });

    for (const name of expired) {
        this.battleLog(`${combatant.name}: ${name} has expired.`);
    }
};

// ============================================================
// TURN & ROUND MANAGEMENT
// ============================================================
App.battleNextTurn = function() {
    try {
        const combatants = this.battle.combatants;
        if (combatants.length === 0) return;

        // Bounds check
        if (this.battle.currentTurnIndex >= combatants.length) {
            this.battle.currentTurnIndex = 0;
        }

        this.battleSnapshot();

        // Check if all combatants on one side are defeated
        const allAlliesDefeated = combatants.filter(c => c.team === 'ally').every(c => c.defeated);
        const allEnemiesDefeated = combatants.filter(c => c.team === 'enemy').every(c => c.defeated);

        if (allAlliesDefeated || allEnemiesDefeated) {
            const winner = allEnemiesDefeated ? 'Allies' : 'Enemies';
            this.battleLog(`--- ${winner} are victorious! ---`);
            this.battleSaveState();
            this.battleRender();
            alert(`Battle Over! ${winner} win!`);
            return;
        }

        // Find next non-defeated combatant
        let nextIndex = this.battle.currentTurnIndex;
        let wrapped = false;

        do {
            nextIndex++;
            if (nextIndex >= combatants.length) {
                nextIndex = 0;
                wrapped = true;
            }
            // Safety check: don't loop forever if all defeated
            if (nextIndex === this.battle.currentTurnIndex) return;
        } while (combatants[nextIndex].defeated);

        // New round if we wrapped past the end of the initiative order
        if (wrapped) {
            this.battle.round++;
            this.battleLog(`--- Round ${this.battle.round} ---`);
        }

        this.battle.currentTurnIndex = nextIndex;
        const current = combatants[nextIndex];

        // Tick status effects at the start of this combatant's turn
        this.battleTickStatuses(current);

        this.battle.selectedId = current.id;
        this.battleLog(`${current.name}'s turn.`);

        this.battleSaveState();
        this.battleRender();
    } catch(e) {
        console.error('battleNextTurn error:', e);
    }
};

App.battleResetState = function() {
    this.battle.state = 'setup';
    this.battle.combatants = [];
    this.battle.round = 0;
    this.battle.currentTurnIndex = 0;
    this.battle.log = [];
    this.battle.nextId = 1;
    this.battle.selectedId = null;
    this.battle.undoStack = [];
    localStorage.removeItem('merp_battle_state');
    this.battleShowSetup();
};

App.battleEndBattle = function() {
    this.battleResetState();
};

// ============================================================
// BATTLE LOG
// ============================================================
App.battleLog = function(message) {
    const time = new Date().toLocaleTimeString();
    this.battle.log.unshift({ time, message });
    if (this.battle.log.length > 200) this.battle.log.pop();
};

App.battleRenderLog = function() {
    const div = document.getElementById('battleLog');
    if (!div) return;

    if (this.battle.log.length === 0) {
        div.innerHTML = '<div style="color:var(--text-secondary);text-align:center;padding:10px;">No log entries yet.</div>';
        return;
    }

    div.innerHTML = this.battle.log.map(entry => {
        const isRound = entry.message.startsWith('---');
        const style = isRound ?
            'color:var(--text-heading);font-weight:bold;border-bottom:1px solid var(--border-gold);' :
            'border-bottom:1px solid rgba(255,255,255,0.05);';
        return `<div style="padding:3px 0;${style}">
            <span style="color:var(--text-secondary);font-size:10px;">[${entry.time}]</span> ${entry.message}
        </div>`;
    }).join('');
};

// ============================================================
// UNDO SYSTEM
// ============================================================
App.battleSnapshot = function() {
    // Deep-copy current battle state before a modifying action
    const snapshot = {
        combatants: JSON.parse(JSON.stringify(this.battle.combatants)),
        round: this.battle.round,
        currentTurnIndex: this.battle.currentTurnIndex,
        selectedId: this.battle.selectedId,
        logLength: this.battle.log.length
    };
    this.battle.undoStack.push(snapshot);
    // Cap at 20 entries
    if (this.battle.undoStack.length > 20) {
        this.battle.undoStack.shift();
    }
};

App.battleUndo = function() {
    if (!this.battle.undoStack || this.battle.undoStack.length === 0) return;

    const snapshot = this.battle.undoStack.pop();

    // Restore state
    this.battle.combatants = snapshot.combatants;
    this.battle.round = snapshot.round;
    this.battle.currentTurnIndex = snapshot.currentTurnIndex;
    this.battle.selectedId = snapshot.selectedId;

    // Trim log: new entries were prepended (unshift), so remove from the front
    const entriesAdded = this.battle.log.length - snapshot.logLength;
    if (entriesAdded > 0) {
        this.battle.log.splice(0, entriesAdded);
    }

    this.battleLog('(Action undone)');
    this.battleSaveState();
    this.battleRender();
};

// ============================================================
// BATTLE SIMULATION (test function — call from browser console)
// Creates 2 PCs vs 2 Orc Medium NPCs, runs 3 rounds automatically
// ============================================================
App.battleSimulate = function() {
    console.log("=== MERP Battle Simulation: 2 PCs vs 2 Orc, Medium ===");
    console.log("Initiative: MERP rules - sorted by M&M Bonus (no dice roll)");

    // Reset to clean state
    this.battle.state = 'setup';
    this.battle.combatants = [];
    this.battle.round = 0;
    this.battle.currentTurnIndex = 0;
    this.battle.log = [];
    this.battle.nextId = 1;
    this.battle.selectedId = null;
    this.battle.undoStack = [];
    localStorage.removeItem('merp_battle_state');

    // Add 2 custom PCs (initMod = M&M bonus)
    this.battleAddCustom({
        name: "Aragorn (Test)", hp: 80, initMod: 15, ob: 65, db: 30,
        armor: "Chain", team: "ally"
    });
    this.battleAddCustom({
        name: "Legolas (Test)", hp: 55, initMod: 25, ob: 75, db: 25,
        armor: "Soft Leather", team: "ally"
    });

    // Add 2 Orc, Medium NPCs
    if (MERP.npcTemplates && MERP.npcTemplates["Orc, Medium"]) {
        this.battleAddNPC("Orc, Medium", 2);
    } else {
        // Fallback if NPC template not found
        this.battleAddCustom({ name: "Orc #1", hp: 40, initMod: 5, ob: 40, db: 10, armor: "Rigid Leather", team: "enemy" });
        this.battleAddCustom({ name: "Orc #2", hp: 40, initMod: 5, ob: 40, db: 10, armor: "Rigid Leather", team: "enemy" });
    }

    // Start battle (sorts by M&M bonus, logs order)
    this.battleStart();
    console.log("Battle started. Turn order (by M&M Bonus):");
    for (const c of this.battle.combatants) {
        const sign = c.initiative >= 0 ? '+' : '';
        console.log(`  ${sign}${c.initiative} - ${c.name} (${c.team})`);
    }

    // Simulate 3 rounds of combat
    const numCombatants = this.battle.combatants.length;
    const totalTurns = numCombatants * 3;
    let turnsCompleted = 0;

    for (let t = 0; t < totalTurns && turnsCompleted < totalTurns; t++) {
        const current = this.battle.combatants[this.battle.currentTurnIndex];
        if (!current) break;

        if (!current.defeated) {
            // Pick a random non-defeated enemy target
            const targets = this.battle.combatants.filter(c =>
                c.team !== current.team && !c.defeated
            );
            if (targets.length > 0) {
                const target = targets[Math.floor(Math.random() * targets.length)];

                // Use CombatResolver for a proper attack roll
                const result = MERP.CombatResolver.resolveAttack({
                    attackerOB: current.ob,
                    defenderDB: target.db,
                    attackTable: "AT1",
                    armorType: target.armor || "No Armor"
                });

                if (result.hits > 0) {
                    this.battleDamage(target.id, result.hits);
                    const critMsg = result.criticalLetter ? ` + ${result.criticalLetter} crit!` : '';
                    console.log(`  R${this.battle.round}: ${current.name} → ${target.name}: ${result.hits} hits${critMsg} (roll: ${result.modifiedRoll})`);
                } else if (result.fumble) {
                    console.log(`  R${this.battle.round}: ${current.name} fumbles!`);
                } else {
                    console.log(`  R${this.battle.round}: ${current.name} → ${target.name}: Miss (roll: ${result.modifiedRoll})`);
                }
            }
        }

        // Check if battle should end
        const allAlliesDefeated = this.battle.combatants.filter(c => c.team === 'ally').every(c => c.defeated);
        const allEnemiesDefeated = this.battle.combatants.filter(c => c.team === 'enemy').every(c => c.defeated);
        if (allAlliesDefeated || allEnemiesDefeated) {
            const winner = allEnemiesDefeated ? 'Allies' : 'Enemies';
            console.log(`\n=== Battle Over! ${winner} win! ===`);
            break;
        }

        this.battleNextTurn();
        turnsCompleted++;
    }

    console.log("\n=== Simulation Complete ===");
    console.log("Final state:");
    for (const c of this.battle.combatants) {
        console.log(`  ${c.name}: HP ${c.hp.current}/${c.hp.max}${c.defeated ? ' [DEFEATED]' : ''}`);
    }
    this.battleRender();
};
