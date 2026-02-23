// MERP 2nd Edition - Battle Tracker Module
// Manages multi-combatant encounters: initiative, HP, status effects, round tracking
// Extends App object via monkey-patching (loaded after merp-app.js)

// ============================================================
// NPC ATTACK TYPE HELPERS
// ============================================================
App._npcAttackTable = function(attackType) {
    const type = (attackType || "Weapon").toLowerCase();
    if (type === "weapon") return { attackTable: "AT1", fumbleTable: 1, primaryCrit: "Slash" };
    if (type === "missile") return { attackTable: "AT4", fumbleTable: 2, primaryCrit: "Puncture" };
    if (type === "spell" || type === "weapon/spell") return { attackTable: "AT9", fumbleTable: 3, primaryCrit: "Heat" };
    if (type === "grapple") return { attackTable: "AT6", fumbleTable: 1, primaryCrit: "Grapple" };
    if (type.includes("bite") || type.includes("claw") || type.includes("sting"))
        return { attackTable: "AT5", fumbleTable: 1, primaryCrit: "Puncture" };
    if (type.includes("crush") || type.includes("hoof") || type.includes("tusk") ||
        type.includes("horn") || type.includes("antler"))
        return { attackTable: "AT5", fumbleTable: 1, primaryCrit: "Crush" };
    return { attackTable: "AT5", fumbleTable: 1, primaryCrit: "Slash" }; // fallback
};

App._npcFumbleTable = function(category) {
    if (category === "weaponMissile") return 2;
    return 1; // Hand Arms default
};

App._pcFumbleTable = function(weaponCategory) {
    if (weaponCategory === "weaponMissile") return 2;
    return 1; // Hand Arms for all melee
};

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
                // Backward compatibility: add combat integration fields if missing
                if (!c.pcWeapons) c.pcWeapons = [];
                if (c.weaponName === undefined) c.weaponName = null;
                if (!c.attackTable) c.attackTable = "AT1";
                if (!c.primaryCrit) c.primaryCrit = "Slash";
                if (c.secondaryCrit === undefined) c.secondaryCrit = null;
                if (!c.fumbleRange) c.fumbleRange = [1, 3];
                if (c.fumbleTable === undefined) c.fumbleTable = 1;
                if (c.isLargeCreature === undefined) c.isLargeCreature = false;
                // Spell attack fields backward compat
                if (c.level === undefined) c.level = 1;
                if (c.spellOB_AT7 === undefined) c.spellOB_AT7 = 0;
                if (c.spellOB_AT8 === undefined) c.spellOB_AT8 = 0;
                if (c.spellOB_AT9 === undefined) c.spellOB_AT9 = 0;
                if (c.isSpellUser === undefined) c.isSpellUser = false;
                // Parry backward compat
                if (c.parryDB === undefined) c.parryDB = 0;
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

    // Get primary weapon OB and weapon data
    let ob = 0;
    let weaponName = null;
    let attackTable = "AT1";
    let primaryCrit = "Slash";
    let secondaryCrit = null;
    let fumbleRange = [1, 3];
    let fumbleTable = 1;
    const pcWeapons = (char.weapons && char.weapons.length > 0) ? [...char.weapons] : [];

    if (pcWeapons.length > 0) {
        weaponName = pcWeapons[0];
        ob = char.getWeaponOB(weaponName);
        const wdata = MERP.weapons[weaponName];
        if (wdata) {
            attackTable = wdata.attackTable || "AT1";
            primaryCrit = wdata.primaryCrit || "Slash";
            secondaryCrit = wdata.secondaryCrit || null;
            fumbleRange = wdata.fumble || [1, 3];
            fumbleTable = this._pcFumbleTable(wdata.category);
        }
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
        notes: `${char.profession} L${char.level}`,
        // Combat integration fields
        pcWeapons: pcWeapons,
        weaponName: weaponName,
        attackTable: attackTable,
        primaryCrit: primaryCrit,
        secondaryCrit: secondaryCrit,
        fumbleRange: fumbleRange,
        fumbleTable: fumbleTable,
        isLargeCreature: false,
        parryDB: 0,
        // Spell attack fields
        level: char.level || 1,
        spellOB_AT7: (typeof char.getSpellOB === 'function') ? char.getSpellOB('AT7') : 0,
        spellOB_AT8: (typeof char.getSpellOB === 'function') ? char.getSpellOB('AT8') : 0,
        spellOB_AT9: (typeof char.getSpellOB === 'function') ? char.getSpellOB('AT9') : 0,
        isSpellUser: (char.spellLists && char.spellLists.length > 0) || false
    };

    this.battle.combatants.push(combatant);
    this.battleSaveState();
    this.battleRenderRoster();
};

App.battleAddNPC = function(templateName, count) {
    const npc = MERP.npcTemplates[templateName];
    if (!npc) return;

    count = count || 1;

    // Auto-detect attack table from NPC attackType
    const atkInfo = this._npcAttackTable(npc.attackType);
    const isLarge = (npc.size === "Large" || npc.size === "Huge");

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
            notes: `L${npc.level} | ${npc.attackDesc} | ${npc.critType} | ${npc.size}`,
            // Combat integration fields
            pcWeapons: [],
            weaponName: null,
            attackTable: atkInfo.attackTable,
            primaryCrit: atkInfo.primaryCrit,
            secondaryCrit: null,
            fumbleRange: [1, 2],
            fumbleTable: atkInfo.fumbleTable,
            isLargeCreature: isLarge,
            parryDB: 0,
            // Spell attack fields
            level: npc.level || 1,
            spellOB_AT7: (npc.attackType === "Spell" || npc.attackType === "Weapon/Spell") ? npc.ob : 0,
            spellOB_AT8: (npc.attackType === "Spell" || npc.attackType === "Weapon/Spell") ? npc.ob : 0,
            spellOB_AT9: (npc.attackType === "Spell" || npc.attackType === "Weapon/Spell") ? npc.ob : 0,
            isSpellUser: (npc.attackType === "Spell" || npc.attackType === "Weapon/Spell")
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
        notes: '',
        // Combat integration fields
        pcWeapons: [],
        weaponName: null,
        attackTable: data.attackTable || "AT1",
        primaryCrit: data.primaryCrit || "Slash",
        secondaryCrit: null,
        fumbleRange: data.fumbleRange || [1, 3],
        fumbleTable: data.fumbleTable || 1,
        isLargeCreature: data.isLargeCreature || false,
        parryDB: 0,
        // Spell attack fields
        level: data.level || 1,
        spellOB_AT7: data.spellOB || 0,
        spellOB_AT8: data.spellOB || 0,
        spellOB_AT9: data.spellOB || 0,
        isSpellUser: data.isSpellUser || false
    };

    this.battle.combatants.push(combatant);
    this.battleSaveState();
    this.battleRenderRoster();
};

// ============================================================
// WEAPON SWITCH (PCs)
// ============================================================
App.battleSwitchWeapon = function(combatantId, weaponName) {
    const c = this.battle.combatants.find(x => x.id === combatantId);
    if (!c || c.source !== 'character') return;

    const wdata = MERP.weapons[weaponName];
    if (!wdata) return;

    c.weaponName = weaponName;
    c.attackTable = wdata.attackTable || "AT1";
    c.primaryCrit = wdata.primaryCrit || "Slash";
    c.secondaryCrit = wdata.secondaryCrit || null;
    c.fumbleRange = wdata.fumble || [1, 3];
    c.fumbleTable = this._pcFumbleTable(wdata.category);

    // Recalculate OB from character sheet
    const char = this.characters[c.sourceIndex];
    if (char) {
        c.ob = char.getWeaponOB(weaponName);
    }

    this.battleSaveState();
    this.battleRenderDetail();
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
                const isPending = eff.pendingTicks > 0;
                const pendingTag = isPending ? ' ⏳' : '';
                const roundsText = eff.roundsLeft < 0 ? '' : eff.roundsLeft === 0 ? ' (last)' : ` (${eff.roundsLeft}r)`;
                statusHtml += `<span class="battle-status-tag ${cssClass}${isPending ? ' status-pending' : ''}">${eff.name}${roundsText}${pendingTag}</span>`;
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
            const isPending = eff.pendingTicks > 0;
            const pendingText = isPending ? ' (starts next round)' : '';
            const roundsText = eff.roundsLeft < 0 ? 'Permanent' : eff.roundsLeft === 0 ? 'Last round' : `${eff.roundsLeft} round${eff.roundsLeft !== 1 ? 's' : ''} left`;
            statusHtml += `<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
                <span class="battle-status-tag ${cssClass}${isPending ? ' status-pending' : ''}">${eff.name}</span>
                <span style="font-size:11px;color:var(--text-secondary);">${roundsText}${pendingText} - ${eff.description}</span>
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
                <div class="stat-label">DB${c.parryDB > 0 ? ' (parry)' : ''}</div>
                <div class="stat-value">${c.parryDB > 0 ? (c.db + c.parryDB) : c.db}</div>
                ${c.parryDB > 0 ? `<div style="font-size:10px;color:var(--accent-blue);">${c.db}+${c.parryDB}</div>` : ''}
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

        <!-- Attack Panel (only in running state) -->
        ${this.battle.state === 'running' && !c.defeated ? this._renderAttackPanel(c) : ''}

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

// ============================================================
// ATTACK PANEL RENDERING
// ============================================================
App._renderAttackPanel = function(c) {
    // Build target dropdown (non-defeated combatants except self)
    const enemies = this.battle.combatants.filter(x => x.id !== c.id && !x.defeated && x.team !== c.team);
    const allies = this.battle.combatants.filter(x => x.id !== c.id && !x.defeated && x.team === c.team);

    let targetOptions = '';
    if (enemies.length > 0) {
        targetOptions += `<optgroup label="Enemies">`;
        for (let i = 0; i < enemies.length; i++) {
            const t = enemies[i];
            const sel = i === 0 ? ' selected' : '';
            targetOptions += `<option value="${t.id}"${sel}>${t.name} (HP:${t.hp.current}/${t.hp.max}, ${t.armor})</option>`;
        }
        targetOptions += `</optgroup>`;
    }
    if (allies.length > 0) {
        targetOptions += `<optgroup label="Allies (Friendly Fire)">`;
        for (const t of allies) {
            targetOptions += `<option value="${t.id}">${t.name} (HP:${t.hp.current}/${t.hp.max}, ${t.armor})</option>`;
        }
        targetOptions += `</optgroup>`;
    }

    // Determine if this combatant uses spells by default (NPC spell casters)
    const defaultsToSpell = (c.attackTable === 'AT7' || c.attackTable === 'AT8' || c.attackTable === 'AT9');
    const defaultMode = defaultsToSpell ? 'spell' : 'weapon';

    // Weapon dropdown (PCs only, weapon mode)
    let weaponHtml = '';
    if (c.source === 'character' && c.pcWeapons && c.pcWeapons.length > 0) {
        let weaponOpts = '';
        for (const w of c.pcWeapons) {
            const sel = w === c.weaponName ? ' selected' : '';
            const wd = MERP.weapons[w];
            const info = wd ? ` (${wd.attackTable}, ${wd.primaryCrit})` : '';
            weaponOpts += `<option value="${w}"${sel}>${w}${info}</option>`;
        }
        weaponHtml = `
            <div class="flex-row gap-sm mb-1" id="battleWeaponRow_${c.id}">
                <label style="margin:0;white-space:nowrap;min-width:55px;">Weapon:</label>
                <select id="battleAtkWeapon_${c.id}" onchange="App.battleSwitchWeapon(${c.id}, this.value)" style="flex:1;">
                    ${weaponOpts}
                </select>
            </div>`;
    } else if (c.source === 'npc' && c.sourceName && !defaultsToSpell) {
        const npc = MERP.npcTemplates[c.sourceName];
        const atkDesc = npc ? npc.attackDesc : (c.attackTable || 'Unknown');
        weaponHtml = `
            <div class="flex-row gap-sm mb-1" id="battleWeaponRow_${c.id}">
                <label style="margin:0;white-space:nowrap;min-width:55px;">Attack:</label>
                <span style="color:var(--text-primary);font-size:13px;">${npc ? npc.attackType : 'Weapon'} — ${atkDesc}</span>
            </div>`;
    }

    // Attack table dropdown (physical)
    const atkTables = ['AT1','AT2','AT3','AT4','AT5','AT6'];
    const atkTableLabels = {
        'AT1':'AT-1 (1H Edged)', 'AT2':'AT-2 (1H Concuss)', 'AT3':'AT-3 (2H/Pole)',
        'AT4':'AT-4 (Missile)', 'AT5':'AT-5 (Tooth/Claw)', 'AT6':'AT-6 (Grapple)'
    };
    let atkTableOpts = '';
    for (const at of atkTables) {
        const sel = at === c.attackTable ? ' selected' : '';
        atkTableOpts += `<option value="${at}"${sel}>${atkTableLabels[at]}</option>`;
    }

    // Armor dropdown for target
    const armorTypes = ['No Armor','Soft Leather','Rigid Leather','Chain','Plate'];
    const firstTarget = enemies.length > 0 ? enemies[0] : (allies.length > 0 ? allies[0] : null);
    const defaultArmor = firstTarget ? firstTarget.armor : 'No Armor';
    let armorOpts = '';
    for (const a of armorTypes) {
        const sel = a === defaultArmor ? ' selected' : '';
        armorOpts += `<option value="${a}"${sel}>${a}</option>`;
    }

    // Spell crit type options
    const spellCritTypes = ['Heat','Cold','Electricity','Impact','Crush'];
    let spellCritOpts = '';
    for (const ct of spellCritTypes) {
        spellCritOpts += `<option value="${ct}">${ct}</option>`;
    }

    // Spell OB value based on default spell table
    const defaultSpellTable = defaultsToSpell ? c.attackTable : 'AT7';
    const spellOBval = c['spellOB_' + defaultSpellTable] || c.ob || 0;

    // First target level for RR
    const targetLevel = firstTarget ? (firstTarget.level || 1) : 1;

    return `
        <div class="card battle-attack-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <div style="color:var(--text-heading);font-size:13px;font-weight:bold;">Attack</div>
                <div class="battle-atk-toggle">
                    <button class="battle-atk-mode-btn ${defaultMode === 'weapon' ? 'active' : ''}" id="battleModeWeapon_${c.id}" onclick="App._battleSwitchMode(${c.id}, 'weapon')">Weapon</button>
                    <button class="battle-atk-mode-btn ${defaultMode === 'spell' ? 'active' : ''}" id="battleModeSpell_${c.id}" onclick="App._battleSwitchMode(${c.id}, 'spell')">Spell</button>
                </div>
            </div>

            <div class="flex-row gap-sm mb-1">
                <label style="margin:0;white-space:nowrap;min-width:55px;">Target:</label>
                <select id="battleAtkTarget_${c.id}" onchange="App._battleUpdateTargetArmor(${c.id})" style="flex:1;">
                    ${targetOptions || '<option value="">No targets available</option>'}
                </select>
            </div>

            <!-- PARRY SLIDER (hidden if OB <= 0) -->
            ${c.ob > 0 ? `
            <div class="battle-parry-section" id="battleParrySection_${c.id}">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                    <label style="margin:0;font-size:12px;color:var(--text-heading);">Parry (OB → DB)</label>
                    <span style="font-size:12px;color:var(--text-secondary);" id="battleParryLabel_${c.id}">0 of ${c.ob}</span>
                </div>
                <div class="battle-parry-row">
                    <span class="battle-parry-minmax">0</span>
                    <input type="range" class="battle-parry-slider" id="battleParry_${c.id}" min="0" max="${c.ob}" value="0"
                           oninput="App._battleUpdateParry(${c.id})">
                    <span class="battle-parry-minmax">${c.ob}</span>
                </div>
                <div class="battle-parry-values">
                    Attack OB: <strong id="battleParryOB_${c.id}" style="color:var(--text-highlight);">${c.ob}</strong>
                    <span style="color:var(--text-secondary);margin:0 6px;">|</span>
                    Effective DB: <strong id="battleParryDB_${c.id}" style="color:var(--accent-blue);">${c.db}</strong>
                </div>
            </div>
            ` : ''}

            <!-- WEAPON MODE SECTION -->
            <div id="battleWeaponSection_${c.id}" style="${defaultMode === 'spell' ? 'display:none;' : ''}">
                ${weaponHtml}

                <div class="grid-3 gap-sm mb-1">
                    <div>
                        <label>OB</label>
                        <input type="number" id="battleAtkOB_${c.id}" value="${c.ob}" style="width:100%;">
                    </div>
                    <div>
                        <label>Table</label>
                        <select id="battleAtkTable_${c.id}" style="width:100%;">${atkTableOpts}</select>
                    </div>
                    <div>
                        <label>Target Armor</label>
                        <select id="battleAtkArmor_${c.id}" style="width:100%;">${armorOpts}</select>
                    </div>
                </div>

                <div style="margin-bottom:8px;">
                    <label style="margin-bottom:4px;">Modifiers:</label>
                    <div style="display:flex;flex-wrap:wrap;gap:6px 12px;font-size:12px;">
                        <label style="display:inline-flex;align-items:center;margin:0;">
                            <input type="checkbox" id="battleMod_flank_${c.id}"> Flank (+15)
                        </label>
                        <label style="display:inline-flex;align-items:center;margin:0;">
                            <input type="checkbox" id="battleMod_rear_${c.id}"> Rear (+20)
                        </label>
                        <label style="display:inline-flex;align-items:center;margin:0;">
                            <input type="checkbox" id="battleMod_surprised_${c.id}"> Surprised (+20)
                        </label>
                        <label style="display:inline-flex;align-items:center;margin:0;">
                            <input type="checkbox" id="battleMod_stunned_${c.id}"> Stunned (+20)
                        </label>
                        <label style="display:inline-flex;align-items:center;margin:0;">
                            <input type="checkbox" id="battleMod_drawing_${c.id}"> Drawing Wpn (-30)
                        </label>
                        <label style="display:inline-flex;align-items:center;margin:0;">
                            <input type="checkbox" id="battleMod_halfhits_${c.id}"> Half Hits (-20)
                        </label>
                    </div>
                    <div class="flex-row gap-sm mt-1">
                        <label style="margin:0;white-space:nowrap;">Custom Mod:</label>
                        <input type="number" id="battleMod_custom_${c.id}" value="0" style="width:70px;">
                    </div>
                </div>
            </div>

            <!-- SPELL MODE SECTION -->
            <div id="battleSpellSection_${c.id}" style="${defaultMode === 'weapon' ? 'display:none;' : ''}">
                <div class="grid-2 gap-sm mb-1">
                    <div>
                        <label>Spell Type</label>
                        <select id="battleSpellType_${c.id}" onchange="App._battleOnSpellTypeChange(${c.id})" style="width:100%;">
                            <option value="AT7" ${defaultSpellTable === 'AT7' ? 'selected' : ''}>Bolt (AT-7)</option>
                            <option value="AT8" ${defaultSpellTable === 'AT8' ? 'selected' : ''}>Ball (AT-8)</option>
                            <option value="AT9" ${defaultSpellTable === 'AT9' ? 'selected' : ''}>Base Spell (AT-9)</option>
                        </select>
                    </div>
                    <div>
                        <label>Spell OB</label>
                        <input type="number" id="battleSpellOB_${c.id}" value="${spellOBval}" style="width:100%;">
                    </div>
                </div>

                <div class="grid-2 gap-sm mb-1" id="battleSpellCritRow_${c.id}">
                    <div>
                        <label>Spell Crit Type</label>
                        <select id="battleSpellCrit_${c.id}" style="width:100%;">${spellCritOpts}</select>
                    </div>
                    <div>
                        <label>Target Armor</label>
                        <select id="battleSpellArmor_${c.id}" style="width:100%;">${armorOpts}</select>
                    </div>
                </div>

                <div id="battleRRSection_${c.id}" style="${defaultSpellTable === 'AT9' ? '' : 'display:none;'}">
                    <div class="grid-3 gap-sm mb-1">
                        <div>
                            <label>Attacker Lvl</label>
                            <input type="number" id="battleRRAttLvl_${c.id}" value="${c.level || 1}" style="width:100%;">
                        </div>
                        <div>
                            <label>Target Lvl</label>
                            <input type="number" id="battleRRTgtLvl_${c.id}" value="${targetLevel}" style="width:100%;">
                        </div>
                        <div>
                            <label>Target RR Bonus</label>
                            <input type="number" id="battleRRBonus_${c.id}" value="0" style="width:100%;">
                        </div>
                    </div>
                </div>

                <div class="flex-row gap-sm mb-1">
                    <label style="margin:0;white-space:nowrap;">Custom Mod:</label>
                    <input type="number" id="battleSpellMod_${c.id}" value="0" style="width:70px;">
                </div>
            </div>

            <button class="btn btn-primary btn-lg" onclick="App.battleResolveAttack(${c.id})" style="width:100%;justify-content:center;font-family:var(--font-heading);">
                Attack!
            </button>

            <div id="battleAtkResult_${c.id}"></div>
        </div>`;
};

App._battleUpdateTargetArmor = function(attackerId) {
    const targetSel = document.getElementById(`battleAtkTarget_${attackerId}`);
    if (!targetSel) return;

    const targetId = parseInt(targetSel.value);
    const target = this.battle.combatants.find(x => x.id === targetId);
    if (!target) return;

    // Update weapon mode armor
    const armorSel = document.getElementById(`battleAtkArmor_${attackerId}`);
    if (armorSel) armorSel.value = target.armor || 'No Armor';

    // Update spell mode armor
    const spellArmorSel = document.getElementById(`battleSpellArmor_${attackerId}`);
    if (spellArmorSel) spellArmorSel.value = target.armor || 'No Armor';

    // Update target level for RR fields
    const tgtLvlInput = document.getElementById(`battleRRTgtLvl_${attackerId}`);
    if (tgtLvlInput) tgtLvlInput.value = target.level || 1;
};

// ============================================================
// SPELL MODE SWITCHING
// ============================================================
App._battleSwitchMode = function(attackerId, mode) {
    const weaponSection = document.getElementById(`battleWeaponSection_${attackerId}`);
    const spellSection = document.getElementById(`battleSpellSection_${attackerId}`);
    const weaponBtn = document.getElementById(`battleModeWeapon_${attackerId}`);
    const spellBtn = document.getElementById(`battleModeSpell_${attackerId}`);

    if (!weaponSection || !spellSection) return;

    if (mode === 'spell') {
        weaponSection.style.display = 'none';
        spellSection.style.display = '';
        if (weaponBtn) weaponBtn.classList.remove('active');
        if (spellBtn) spellBtn.classList.add('active');
    } else {
        weaponSection.style.display = '';
        spellSection.style.display = 'none';
        if (weaponBtn) weaponBtn.classList.add('active');
        if (spellBtn) spellBtn.classList.remove('active');
    }

    // Re-apply parry slider to the now-visible mode's OB input
    this._battleUpdateParry(attackerId);
};

App._battleOnSpellTypeChange = function(attackerId) {
    const spellTypeSel = document.getElementById(`battleSpellType_${attackerId}`);
    const rrSection = document.getElementById(`battleRRSection_${attackerId}`);
    const critRow = document.getElementById(`battleSpellCritRow_${attackerId}`);
    const spellOBInput = document.getElementById(`battleSpellOB_${attackerId}`);

    if (!spellTypeSel) return;
    const spellTable = spellTypeSel.value; // "AT7", "AT8", or "AT9"

    // Show/hide RR section (only for AT-9 Base Spells)
    if (rrSection) {
        rrSection.style.display = (spellTable === 'AT9') ? '' : 'none';
    }

    // Show/hide crit type & armor row (AT-7 and AT-8 deal damage; AT-9 does not)
    if (critRow) {
        critRow.style.display = (spellTable === 'AT9') ? 'none' : '';
    }

    // Update spell OB from combatant data, accounting for current parry
    const c = this.battle.combatants.find(x => x.id === attackerId);
    if (c && spellOBInput) {
        const obKey = 'spellOB_' + spellTable;
        const baseOB = c[obKey] || c.ob || 0;
        const parrySlider = document.getElementById(`battleParry_${attackerId}`);
        const parryValue = parseInt(parrySlider?.value) || 0;
        spellOBInput.value = Math.max(0, baseOB - parryValue);
    }
};

// ============================================================
// PARRY SLIDER
// ============================================================
App._battleUpdateParry = function(attackerId) {
    const slider = document.getElementById(`battleParry_${attackerId}`);
    const obInput = document.getElementById(`battleAtkOB_${attackerId}`);
    const spellOBInput = document.getElementById(`battleSpellOB_${attackerId}`);
    const parryLabel = document.getElementById(`battleParryLabel_${attackerId}`);
    const parryOBDisplay = document.getElementById(`battleParryOB_${attackerId}`);
    const parryDBDisplay = document.getElementById(`battleParryDB_${attackerId}`);

    if (!slider) return;

    const c = this.battle.combatants.find(x => x.id === attackerId);
    if (!c) return;

    const parryValue = parseInt(slider.value) || 0;
    const effectiveOB = c.ob - parryValue;
    const effectiveDB = c.db + parryValue;

    // Update displays
    if (parryLabel) parryLabel.textContent = `${parryValue} of ${c.ob}`;
    if (parryOBDisplay) parryOBDisplay.textContent = effectiveOB;
    if (parryDBDisplay) parryDBDisplay.textContent = effectiveDB;

    // Update the OB input field (weapon mode)
    if (obInput) obInput.value = effectiveOB;

    // Also update spell OB if in spell mode (reduce spell OB by parry amount)
    if (spellOBInput) {
        const isSpell = this._battleIsSpellMode(attackerId);
        if (isSpell) {
            // Recalculate: base spell OB - parryValue
            const spellTypeSel = document.getElementById(`battleSpellType_${attackerId}`);
            const spellTable = spellTypeSel?.value || 'AT7';
            const baseSpellOB = c['spellOB_' + spellTable] || c.ob || 0;
            spellOBInput.value = Math.max(0, baseSpellOB - parryValue);
        }
    }
};

// ============================================================
// ATTACK RESOLUTION
// ============================================================
App._battleIsSpellMode = function(attackerId) {
    // Check if spell section is visible (i.e., spell mode is active)
    const spellSection = document.getElementById(`battleSpellSection_${attackerId}`);
    return spellSection && spellSection.style.display !== 'none';
};

App.battleResolveAttack = function(attackerId) {
    const c = this.battle.combatants.find(x => x.id === attackerId);
    if (!c || c.defeated) return;

    const targetSel = document.getElementById(`battleAtkTarget_${attackerId}`);
    if (!targetSel || !targetSel.value) {
        alert('Please select a target.');
        return;
    }

    const targetId = parseInt(targetSel.value);
    const target = this.battle.combatants.find(x => x.id === targetId);
    if (!target) {
        alert('Invalid target.');
        return;
    }

    // Snapshot for undo BEFORE any changes
    this.battleSnapshot();

    // Determine attack mode: weapon or spell
    const isSpell = this._battleIsSpellMode(attackerId);

    if (isSpell) {
        this._battleResolveSpellAttack(attackerId, c, target);
    } else {
        this._battleResolveWeaponAttack(attackerId, c, target);
    }
};

// Weapon attack (existing logic, extracted)
App._battleResolveWeaponAttack = function(attackerId, c, target) {
    const obInput = document.getElementById(`battleAtkOB_${attackerId}`);
    const tableSel = document.getElementById(`battleAtkTable_${attackerId}`);
    const armorSel = document.getElementById(`battleAtkArmor_${attackerId}`);
    const customMod = document.getElementById(`battleMod_custom_${attackerId}`);

    // Read parry slider value and store on attacker
    const parrySlider = document.getElementById(`battleParry_${attackerId}`);
    const parryValue = parseInt(parrySlider?.value) || 0;
    c.parryDB = parryValue;

    const attackerOB = parseInt(obInput?.value) || 0;  // Already reduced by parry via slider
    const defenderDB = (target.db || 0) + (target.parryDB || 0);  // Include target's parry
    const attackTable = tableSel?.value || c.attackTable || "AT1";
    const armorType = armorSel?.value || target.armor || "No Armor";

    // Collect modifiers
    const modifiers = {};
    if (document.getElementById(`battleMod_flank_${attackerId}`)?.checked) modifiers.flank = true;
    if (document.getElementById(`battleMod_rear_${attackerId}`)?.checked) modifiers.rear = true;
    if (document.getElementById(`battleMod_surprised_${attackerId}`)?.checked) modifiers.surprised = true;
    if (document.getElementById(`battleMod_stunned_${attackerId}`)?.checked) modifiers.stunnedOrDown = true;
    if (document.getElementById(`battleMod_drawing_${attackerId}`)?.checked) modifiers.drawingWeapon = true;
    if (document.getElementById(`battleMod_halfhits_${attackerId}`)?.checked) modifiers.halfHitsTaken = true;
    const customVal = parseInt(customMod?.value) || 0;
    if (customVal !== 0) modifiers.custom = customVal;

    // Resolve attack
    const atkResult = MERP.CombatResolver.resolveAttack({
        attackerOB,
        defenderDB,
        weaponName: c.weaponName,
        attackTable,
        armorType,
        modifiers
    });

    // Resolve critical if any
    let critResult = null;
    if (atkResult.criticalLetter && atkResult.hits > 0) {
        critResult = MERP.CombatResolver.resolveCritical({
            critType: c.primaryCrit || "Slash",
            severity: atkResult.criticalLetter,
            isLargeCreature: target.isLargeCreature || false
        });
    }

    // Resolve fumble if any
    let fumbleResult = null;
    if (atkResult.fumble) {
        fumbleResult = MERP.CombatResolver.resolveFumble({
            fumbleType: c.fumbleTable || 1
        });
    }

    // Calculate total damage
    const atkHits = atkResult.hits || 0;
    const critHits = critResult ? (critResult.hits || 0) : 0;
    const totalDamage = atkHits + critHits;

    // Apply damage to target
    if (totalDamage > 0) {
        target.hp.current = Math.max(0, target.hp.current - totalDamage);
        if (target.hp.current <= 0 && !target.defeated) {
            target.defeated = true;
        }
    }

    // Auto-parse status effects from critical text
    if (critResult && critResult.text) {
        this._battleParseCritStatuses(target, critResult.text);
    }

    // Build log message
    const weaponLabel = c.weaponName || c.attackTable;
    const parryNote = parryValue > 0 ? ` (parry ${parryValue})` : '';
    let logMsg = `${c.name} attacks ${target.name} with ${weaponLabel}${parryNote}: `;

    if (atkResult.fumble) {
        logMsg += `FUMBLE! `;
        if (fumbleResult && fumbleResult.text) {
            logMsg += fumbleResult.text;
        }
    } else if (totalDamage > 0) {
        logMsg += `${atkHits} hits`;
        if (critResult) {
            logMsg += ` + ${atkResult.criticalLetter} ${c.primaryCrit} crit (${critHits} bonus hits)`;
        }
        logMsg += ` = ${totalDamage} total damage`;
        if (target.defeated) logMsg += ` [DEFEATED!]`;
        logMsg += ` (HP: ${target.hp.current}/${target.hp.max})`;
    } else {
        logMsg += `Miss (roll: ${atkResult.modifiedRoll})`;
    }
    this.battleLog(logMsg);

    // Display results
    this._battleDisplayAttackResult(attackerId, atkResult, critResult, fumbleResult, target, totalDamage);

    this.battleSaveState();
    try { this.battleRenderInitiativeList(); } catch(e) { console.error(e); }
    try { this.battleRenderLog(); } catch(e) { console.error(e); }
};

// Spell attack resolution
App._battleResolveSpellAttack = function(attackerId, c, target) {
    const spellTypeSel = document.getElementById(`battleSpellType_${attackerId}`);
    const spellOBInput = document.getElementById(`battleSpellOB_${attackerId}`);
    const spellArmorSel = document.getElementById(`battleSpellArmor_${attackerId}`);
    const spellCritSel = document.getElementById(`battleSpellCrit_${attackerId}`);
    const spellModInput = document.getElementById(`battleSpellMod_${attackerId}`);

    const spellTable = spellTypeSel?.value || 'AT9';
    const spellOB = parseInt(spellOBInput?.value) || 0;
    const armorType = spellArmorSel?.value || target.armor || 'No Armor';
    const spellCritType = spellCritSel?.value || 'Heat';
    const customMod = parseInt(spellModInput?.value) || 0;

    if (spellTable === 'AT9') {
        // --- AT-9 Base Spell: Roll on table → get RR modifier → target makes RR ---
        this._battleResolveAT9(attackerId, c, target, spellOB, customMod);
    } else {
        // --- AT-7 or AT-8: Bolt/Ball spells work like weapon attacks ---
        this._battleResolveBoltBall(attackerId, c, target, spellTable, spellOB, armorType, spellCritType, customMod);
    }
};

// AT-7 / AT-8: Bolt and Ball spells (hits + crit, like weapon attacks)
App._battleResolveBoltBall = function(attackerId, c, target, spellTable, spellOB, armorType, spellCritType, customMod) {
    // Read and store parry slider value on attacker
    const parrySlider = document.getElementById(`battleParry_${attackerId}`);
    const parryValue = parseInt(parrySlider?.value) || 0;
    c.parryDB = parryValue;

    const defenderDB = (target.db || 0) + (target.parryDB || 0);  // Include target's parry
    const modifiers = {};
    if (customMod !== 0) modifiers.custom = customMod;

    const atkResult = MERP.CombatResolver.resolveAttack({
        attackerOB: spellOB,
        defenderDB,
        attackTable: spellTable,
        armorType,
        modifiers
    });

    // UM fumble check: AT-7 UM is 01-02, AT-8 UM is 01-04
    // Even if high OB pushes modified roll out of fumble rows, UM roll in fumble range = fumble
    const rawRoll = atkResult.roll.rolls[0];
    const umFumbleMax = (spellTable === 'AT8') ? 4 : 2; // AT-7: 01-02, AT-8: 01-04
    if (rawRoll >= 1 && rawRoll <= umFumbleMax && !atkResult.fumble) {
        atkResult.fumble = true;
    }

    // Resolve critical using spell crit type (Heat, Cold, Electricity, Impact)
    let critResult = null;
    if (atkResult.criticalLetter && atkResult.hits > 0 && !atkResult.fumble) {
        critResult = MERP.CombatResolver.resolveCritical({
            critType: spellCritType,
            severity: atkResult.criticalLetter,
            isLargeCreature: target.isLargeCreature || false
        });
    }

    // Resolve fumble (spell fumble = FT-3)
    let fumbleResult = null;
    if (atkResult.fumble) {
        fumbleResult = MERP.CombatResolver.resolveFumble({
            fumbleType: 3  // Spell fumble table
        });
    }

    // No damage on fumble
    const atkHits = atkResult.fumble ? 0 : (atkResult.hits || 0);
    const critHits = critResult ? (critResult.hits || 0) : 0;
    const totalDamage = atkHits + critHits;

    // Apply damage
    if (totalDamage > 0) {
        target.hp.current = Math.max(0, target.hp.current - totalDamage);
        if (target.hp.current <= 0 && !target.defeated) {
            target.defeated = true;
        }
    }

    // Auto-parse status effects
    if (critResult && critResult.text) {
        this._battleParseCritStatuses(target, critResult.text);
    }

    // Log
    const spellLabel = spellTable === 'AT7' ? 'Bolt Spell' : 'Ball Spell';
    const parryNote = parryValue > 0 ? ` (parry ${parryValue})` : '';
    let logMsg = `${c.name} casts ${spellLabel} (${spellCritType}) at ${target.name}${parryNote}: `;
    if (atkResult.fumble) {
        logMsg += `FUMBLE! `;
        if (fumbleResult && fumbleResult.text) logMsg += fumbleResult.text;
    } else if (totalDamage > 0) {
        logMsg += `${atkHits} hits`;
        if (critResult) logMsg += ` + ${atkResult.criticalLetter} ${spellCritType} crit (${critHits} bonus hits)`;
        logMsg += ` = ${totalDamage} total damage`;
        if (target.defeated) logMsg += ` [DEFEATED!]`;
        logMsg += ` (HP: ${target.hp.current}/${target.hp.max})`;
    } else {
        logMsg += `Miss (roll: ${atkResult.modifiedRoll})`;
    }
    this.battleLog(logMsg);

    // Display — reuse weapon display (bolt/ball results look the same)
    // Override primaryCrit on atkResult for display purposes
    const displayData = {
        ...atkResult,
        _spellMode: true,
        _spellLabel: spellLabel,
        _spellCritType: spellCritType
    };
    this._battleDisplayAttackResult(attackerId, displayData, critResult, fumbleResult, target, totalDamage);

    this.battleSaveState();
    try { this.battleRenderInitiativeList(); } catch(e) { console.error(e); }
    try { this.battleRenderLog(); } catch(e) { console.error(e); }
};

// AT-9 Base Spell: Roll attack → get RR modifier → resolve Resistance Roll
App._battleResolveAT9 = function(attackerId, c, target, spellOB, customMod) {
    // Read and store parry slider value on attacker
    const parrySlider = document.getElementById(`battleParry_${attackerId}`);
    const parryValue = parseInt(parrySlider?.value) || 0;
    c.parryDB = parryValue;

    const attLvlInput = document.getElementById(`battleRRAttLvl_${attackerId}`);
    const tgtLvlInput = document.getElementById(`battleRRTgtLvl_${attackerId}`);
    const rrBonusInput = document.getElementById(`battleRRBonus_${attackerId}`);

    const attackerLevel = parseInt(attLvlInput?.value) || c.level || 1;
    const targetLevel = parseInt(tgtLvlInput?.value) || target.level || 1;
    const targetRRBonus = parseInt(rrBonusInput?.value) || 0;

    // Step 1: Roll on AT-9 to get the RR modifier
    // AT-9 has 3 effective columns (indices 0, 1, 2); index 3 is null
    // We use column 2 (most common — roughly "standard" for most spell levels)
    // The modifiedRoll = OB + roll + customMod (no DB for AT-9)
    const spellRoll = MERP.openEndedRoll();
    const modifiedSpellRoll = spellOB + spellRoll.total + customMod;

    // Look up AT-9 with armor column 2 (middle column — typical for most levels)
    const at9Result = MERP.lookupAttackTable('AT9', modifiedSpellRoll, 2);

    // Check for fumble on AT-9
    let fumbleResult = null;
    if (at9Result.fumble) {
        fumbleResult = MERP.CombatResolver.resolveFumble({ fumbleType: 3 });

        // Log fumble
        this.battleLog(`${c.name} casts Base Spell at ${target.name}: FUMBLE! ${fumbleResult.text || ''}`);

        // Display fumble result
        const fakeAtkResult = {
            roll: spellRoll,
            modifiedRoll: modifiedSpellRoll,
            attackerOB: spellOB,
            defenderDB: 0,
            totalMod: customMod,
            hits: 0,
            criticalLetter: null,
            fumble: true,
            _spellMode: true,
            _spellLabel: 'Base Spell',
            _isAT9: true
        };
        this._battleDisplayAttackResult(attackerId, fakeAtkResult, null, fumbleResult, target, 0);
        this.battleSaveState();
        try { this.battleRenderInitiativeList(); } catch(e) { console.error(e); }
        try { this.battleRenderLog(); } catch(e) { console.error(e); }
        return;
    }

    // The AT-9 "hits" value is actually the RR modifier (e.g., -30, 0, 45)
    const rrModifier = at9Result.hits || 0;

    // Step 2: Target makes a Resistance Roll
    const rrResult = MERP.CombatResolver.resolveResistanceRoll({
        targetLevel,
        attackLevel: attackerLevel,
        targetRRBonus,
        baseModifier: rrModifier  // AT-9 modifier (negative = harder to resist)
    });

    // Log
    const rrSuccessText = rrResult.success ? 'SPELL RESISTED!' : 'SPELL TAKES EFFECT!';
    this.battleLog(`${c.name} casts Base Spell at ${target.name}: RR mod ${rrModifier >= 0 ? '+' : ''}${rrModifier}. ${target.name} RR: ${rrResult.modifiedRoll} vs ${rrResult.needed} needed. ${rrSuccessText}`);

    // Build combined result for display
    const combinedResult = {
        roll: spellRoll,
        modifiedRoll: modifiedSpellRoll,
        attackerOB: spellOB,
        defenderDB: 0,
        totalMod: customMod,
        hits: 0,
        criticalLetter: null,
        fumble: false,
        _spellMode: true,
        _spellLabel: 'Base Spell',
        _isAT9: true,
        _rrModifier: rrModifier,
        _rrResult: rrResult,
        _attackerLevel: attackerLevel,
        _targetLevel: targetLevel,
        _targetRRBonus: targetRRBonus,
        _targetName: target.name
    };

    this._battleDisplayAttackResult(attackerId, combinedResult, null, null, target, 0);

    this.battleSaveState();
    try { this.battleRenderInitiativeList(); } catch(e) { console.error(e); }
    try { this.battleRenderLog(); } catch(e) { console.error(e); }
};

App._battleDisplayAttackResult = function(attackerId, atkResult, critResult, fumbleResult, target, totalDamage) {
    const div = document.getElementById(`battleAtkResult_${attackerId}`);
    if (!div) return;

    const rollInfo = atkResult.roll;
    const rollText = rollInfo.openEnded ?
        `${rollInfo.total} (open-ended: ${rollInfo.rolls.join(', ')})` :
        `${rollInfo.total}`;

    // Check if this is an AT-9 RR result
    const isAT9 = atkResult._isAT9;
    const isSpell = atkResult._spellMode;
    const spellLabel = atkResult._spellLabel || 'Spell';

    let html = '<div class="battle-attack-result';
    if (critResult) html += ' crit';
    if (fumbleResult) html += ' fumble';
    if (isAT9 && atkResult._rrResult && !atkResult._rrResult.success) html += ' spell-effect';
    html += '">';

    // Attack type header for spells
    if (isSpell) {
        html += `<div style="font-size:11px;color:var(--accent-blue);font-weight:bold;text-transform:uppercase;margin-bottom:6px;">${spellLabel} Attack</div>`;
    }

    // Roll breakdown
    html += `<div style="margin-bottom:8px;">`;
    html += `<div><strong>Roll:</strong> <span class="roll-display">${rollText}</span></div>`;
    if (isAT9) {
        html += `<div class="roll-detail">Modified: ${atkResult.roll.total} + ${atkResult.attackerOB}OB`;
        if (atkResult.totalMod !== 0) html += ` ${atkResult.totalMod >= 0 ? '+' : ''}${atkResult.totalMod}mod`;
        html += ` = ${atkResult.modifiedRoll} (AT-9 lookup)</div>`;
    } else {
        html += `<div class="roll-detail">Modified: ${atkResult.roll.total} + ${atkResult.attackerOB}OB - ${atkResult.defenderDB}DB`;
        if (atkResult.totalMod !== 0) html += ` ${atkResult.totalMod >= 0 ? '+' : ''}${atkResult.totalMod}mod`;
        html += ` = ${atkResult.modifiedRoll}</div>`;
    }
    html += `</div>`;

    if (atkResult.fumble) {
        // Fumble result
        html += `<div class="result-fumble">`;
        html += `<div style="font-size:16px;font-weight:bold;color:#c080e0;">FUMBLE!</div>`;
        if (fumbleResult) {
            html += `<div class="roll-detail">Fumble roll: ${fumbleResult.roll.total} + ${fumbleResult.modifier} = ${fumbleResult.modifiedRoll} (FT-${fumbleResult.fumbleTable})</div>`;
            html += `<div style="margin-top:6px;color:var(--text-primary);line-height:1.5;">${fumbleResult.text}</div>`;
        }
        html += `</div>`;
    } else if (isAT9 && atkResult._rrResult) {
        // AT-9 Resistance Roll result
        const rr = atkResult._rrResult;
        const rrMod = atkResult._rrModifier;
        const rrModSign = rrMod >= 0 ? '+' : '';

        html += `<div style="margin-bottom:8px;">`;
        html += `<div style="font-size:14px;font-weight:bold;color:var(--accent-blue);">RR Modifier from AT-9: <span style="color:var(--text-highlight);">${rrModSign}${rrMod}</span></div>`;
        html += `<div class="roll-detail">Attacker L${atkResult._attackerLevel} vs Target L${atkResult._targetLevel}</div>`;
        html += `</div>`;

        // RR roll breakdown
        const rrRoll = rr.roll;
        const rrRollText = rrRoll.openEnded ?
            `${rrRoll.total} (open-ended: ${rrRoll.rolls.join(', ')})` :
            `${rrRoll.total}`;

        html += `<div style="margin-bottom:8px;padding:10px;background:var(--bg-card);border:1px solid var(--border-light);border-radius:4px;">`;
        html += `<div style="font-size:12px;font-weight:bold;color:var(--text-heading);margin-bottom:4px;">Resistance Roll (${atkResult._targetName})</div>`;
        html += `<div><strong>RR Roll:</strong> <span class="roll-display">${rrRollText}</span></div>`;
        html += `<div class="roll-detail">`;
        html += `${rrRoll.total} (roll)`;
        if (rr.targetRRBonus !== 0) html += ` ${rr.targetRRBonus >= 0 ? '+' : ''}${rr.targetRRBonus} (RR bonus)`;
        html += ` ${rrModSign}${rrMod} (AT-9 mod)`;
        html += ` = ${rr.modifiedRoll} (needed: ${rr.needed})`;
        html += `</div>`;
        html += `</div>`;

        // Result
        if (rr.success) {
            html += `<div style="font-size:18px;font-weight:bold;font-family:var(--font-heading);color:var(--accent-green);text-align:center;padding:8px;">`;
            html += `SPELL RESISTED!`;
            html += `</div>`;
        } else {
            html += `<div style="font-size:18px;font-weight:bold;font-family:var(--font-heading);color:var(--accent-red);text-align:center;padding:8px;background:rgba(200,60,60,0.1);border:1px solid var(--accent-red);border-radius:4px;">`;
            html += `SPELL TAKES EFFECT!`;
            html += `</div>`;
            html += `<div style="font-size:12px;color:var(--text-secondary);text-align:center;margin-top:4px;">Apply spell effect manually using status effects.</div>`;
        }
    } else if (totalDamage > 0 || atkResult.hits > 0) {
        // Hit result
        html += `<div style="font-size:16px;font-weight:bold;color:var(--accent-red);">`;
        html += `${atkResult.hits} hits`;
        if (atkResult.criticalLetter) html += ` + ${atkResult.criticalLetter} critical`;
        html += `</div>`;

        // Critical result
        if (critResult) {
            html += `<div class="result-critical">`;
            html += `<div><span class="crit-severity">${critResult.critType} ${critResult.severity}</span>`;
            html += ` <span class="roll-detail">(roll: ${critResult.roll.total}, modified: ${critResult.modifiedRoll})</span></div>`;
            html += `<div class="crit-text">`;
            if (critResult.hits > 0) html += `<strong>+${critResult.hits} bonus hits.</strong> `;
            html += `${critResult.text}`;
            html += `</div></div>`;
        }

        // Total damage
        html += `<div style="margin-top:8px;font-size:18px;font-weight:bold;font-family:var(--font-heading);color:var(--text-highlight);">`;
        html += `${totalDamage} damage applied to ${target.name}`;
        if (target.defeated) html += ` <span style="color:var(--accent-red);">[DEFEATED]</span>`;
        html += `</div>`;
        html += `<div class="roll-detail">Target HP: ${target.hp.current} / ${target.hp.max}</div>`;

        // Secondary crit button (only for weapon attacks and spell bolt/ball)
        const c = this.battle.combatants.find(x => x.id === attackerId);
        if (c && c.secondaryCrit && atkResult.criticalLetter && !isSpell) {
            html += `<button class="btn btn-primary btn-sm mt-1" onclick="App.battleResolveSecondaryCrit(${attackerId}, '${c.secondaryCrit}', '${atkResult.criticalLetter}', ${target.id})">Roll Secondary Crit (${c.secondaryCrit})</button>`;
        }
    } else {
        // Miss
        html += `<div style="font-size:16px;font-weight:bold;color:var(--text-secondary);">Miss</div>`;
    }

    html += '</div>';
    div.innerHTML = html;
};

App.battleResolveSecondaryCrit = function(attackerId, critType, severity, targetId) {
    const target = this.battle.combatants.find(x => x.id === targetId);
    if (!target) return;

    // Snapshot before secondary crit damage
    this.battleSnapshot();

    const critResult = MERP.CombatResolver.resolveCritical({
        critType: critType,
        severity: severity,
        isLargeCreature: target.isLargeCreature || false
    });

    // Apply bonus hits from secondary crit
    const bonusHits = critResult.hits || 0;
    if (bonusHits > 0) {
        target.hp.current = Math.max(0, target.hp.current - bonusHits);
        if (target.hp.current <= 0 && !target.defeated) {
            target.defeated = true;
        }
    }

    // Auto-parse status effects
    if (critResult.text) {
        this._battleParseCritStatuses(target, critResult.text);
    }

    // Log
    const attacker = this.battle.combatants.find(x => x.id === attackerId);
    const aName = attacker ? attacker.name : 'Unknown';
    this.battleLog(`${aName} → ${target.name} secondary crit (${critType} ${severity}): ${bonusHits} bonus hits. ${critResult.text || ''}`);

    // Append result to existing attack result
    const div = document.getElementById(`battleAtkResult_${attackerId}`);
    if (div) {
        const extraHtml = `<div class="result-critical" style="margin-top:8px;">
            <div><span class="crit-severity">${critResult.critType} ${severity} (Secondary)</span>
            <span class="roll-detail">(roll: ${critResult.roll.total}, modified: ${critResult.modifiedRoll})</span></div>
            <div class="crit-text">
                ${bonusHits > 0 ? `<strong>+${bonusHits} bonus hits.</strong> ` : ''}${critResult.text}
            </div>
            <div style="margin-top:4px;font-weight:bold;color:var(--text-highlight);">
                Target HP: ${target.hp.current} / ${target.hp.max}${target.defeated ? ' <span style="color:var(--accent-red);">[DEFEATED]</span>' : ''}
            </div>
        </div>`;
        div.querySelector('.battle-attack-result').insertAdjacentHTML('beforeend', extraHtml);
    }

    this.battleSaveState();
    try { this.battleRenderInitiativeList(); } catch(e) { console.error(e); }
    try { this.battleRenderLog(); } catch(e) { console.error(e); }
};

// ============================================================
// AUTO-PARSE CRITICAL STATUS EFFECTS
// ============================================================
App._battleParseCritStatuses = function(target, critText) {
    if (!critText) return;
    const text = critText.toLowerCase();

    // All effects from criticals are "pending" — they take effect starting NEXT round,
    // not the round in which the critical was scored.
    // pendingTicks: number of turn-ticks to skip before the effect becomes active.
    // Set to 1 so the effect skips the target's next turn-tick (rest of current round),
    // then becomes fully active on the following round.

    // Parse "stunned X rounds" patterns
    const stunMatch = text.match(/stun\w*\s+(\d+)\s+r(?:ou)?nd/);
    if (stunMatch) {
        const rounds = parseInt(stunMatch[1]) || 1;
        target.statusEffects.push({ name: "Stunned", roundsLeft: rounds, description: "Cannot act", pendingTicks: 1 });
        this.battleLog(`${target.name} is stunned for ${rounds} round${rounds > 1 ? 's' : ''} (from critical, starts next round).`);
    } else if (text.includes('stun') && !text.includes('no stun')) {
        // Generic stun without round count
        target.statusEffects.push({ name: "Stunned", roundsLeft: 1, description: "Cannot act", pendingTicks: 1 });
        this.battleLog(`${target.name} is stunned for 1 round (from critical, starts next round).`);
    }

    // Parse bleeding / hits per round
    // Patterns from critical tables: "1 hit per round", "3 hits per round", "2 hits/rnd", "8 hits per rnd"
    const hprMatch = text.match(/(\d+)\s+hits?\s*(?:per|\/)\s*r(?:ou)?nd/i);
    if (hprMatch) {
        const hpPerRound = parseInt(hprMatch[1]) || 1;
        const rounds = hpPerRound >= 10 ? -1 : 3;  // Severe bleeding (10+ hp/rnd) is permanent until healed
        target.statusEffects.push({
            name: "Bleeding",
            roundsLeft: rounds,
            description: `Loses ${hpPerRound} HP/round`,
            hpPerRound: hpPerRound,
            pendingTicks: 1
        });
        this.battleLog(`${target.name} is bleeding for ${hpPerRound} HP/round (from critical, starts next round).`);
    } else if (text.includes('bleed') && !text.includes('no bleed')) {
        // Generic bleeding without a specific number
        target.statusEffects.push({
            name: "Bleeding",
            roundsLeft: 3,
            description: "Loses 1 HP/round",
            hpPerRound: 1,
            pendingTicks: 1
        });
        this.battleLog(`${target.name} is bleeding for 1 HP/round (from critical, starts next round).`);
    }

    // Parse prone/knocked down
    if (text.includes('prone') || text.includes('knocked down') || text.includes('falls down')) {
        target.statusEffects.push({ name: "Prone", roundsLeft: 1, description: "Must spend action to stand", pendingTicks: 1 });
        this.battleLog(`${target.name} is knocked prone (from critical, starts next round).`);
    }

    // Parse broken arm/leg
    if (text.includes('arm broken') || text.includes('breaks arm') || text.includes('arm is broken')) {
        target.statusEffects.push({ name: "Arm Broken", roundsLeft: -1, description: "Cannot use arm (-50 if weapon arm)", pendingTicks: 1 });
        this.battleLog(`${target.name} has a broken arm (from critical, starts next round).`);
    }
    if (text.includes('leg broken') || text.includes('breaks leg') || text.includes('leg is broken')) {
        target.statusEffects.push({ name: "Leg Broken", roundsLeft: -1, description: "Cannot move normally", pendingTicks: 1 });
        this.battleLog(`${target.name} has a broken leg (from critical, starts next round).`);
    }

    // Parse unconscious
    if (text.includes('unconscious') || text.includes('pass out') || text.includes('knocked out')) {
        target.statusEffects.push({ name: "Unconscious", roundsLeft: -1, description: "Out of action", pendingTicks: 1 });
        this.battleLog(`${target.name} is knocked unconscious (from critical, starts next round).`);
    }
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
    // Called at the START of a combatant's turn.
    //
    // Timing model:
    //   pendingTicks > 0 : Effect was recently inflicted and hasn't started yet.
    //                      Decrement pendingTicks each tick. No other processing.
    //   pendingTicks = 0 : Effect is ACTIVE this turn. The combatant is affected
    //                      (stunned, bleeding, etc.) during this turn.
    //   roundsLeft > 0   : After applying the effect this turn, decrement roundsLeft.
    //   roundsLeft = 0   : Effect has run its course — remove it at the START of
    //                      the next tick (so it was still active last turn).
    //
    // Example: "Stunned 1 round" inflicted Round 1, pendingTicks=1
    //   Round 1 (target's turn): pendingTicks 1→0. Effect activates. No other action.
    //   Round 2 (target's turn): Active. roundsLeft 1→0. Stun applies this turn.
    //   Round 3 (target's turn): roundsLeft=0 → expired. Stun gone. Target can act.

    // Phase 1: Expire effects that were fully consumed last turn (roundsLeft = 0)
    const expired = [];
    combatant.statusEffects = combatant.statusEffects.filter(eff => {
        if (eff.pendingTicks > 0) return true;     // Still pending — don't expire
        if (eff.roundsLeft < 0) return true;        // Permanent
        if (eff.roundsLeft === 0) {
            expired.push(eff.name);
            return false;
        }
        return true;
    });

    for (const name of expired) {
        this.battleLog(`${combatant.name}: ${name} has expired.`);
    }

    // Phase 2: Process pending effects (decrement pendingTicks)
    // Track which effects just became active so Phase 3 skips them
    const justActivated = new Set();
    for (const eff of combatant.statusEffects) {
        if (eff.pendingTicks > 0) {
            eff.pendingTicks--;
            if (eff.pendingTicks === 0) {
                justActivated.add(eff);
                this.battleLog(`${combatant.name}: ${eff.name} is now active.`);
            }
        }
    }

    // Phase 3: Decrement roundsLeft for active (non-pending) effects
    // Skip effects that JUST activated this tick — they get their first full turn
    // before being decremented.
    for (const eff of combatant.statusEffects) {
        if (eff.pendingTicks > 0) continue;   // Still pending
        if (justActivated.has(eff)) continue;  // Just activated — first active turn
        if (eff.roundsLeft < 0) continue;      // Permanent
        eff.roundsLeft--;
        // roundsLeft is now 0 or more. If 0, effect is active THIS turn
        // but will be expired at the start of NEXT turn.
    }

    // Phase 4: Apply bleeding damage for active (non-pending, non-just-activated) Bleeding effects
    for (const eff of combatant.statusEffects) {
        if (eff.name === "Bleeding" && !(eff.pendingTicks > 0) && !justActivated.has(eff)) {
            // Get HP per round: from hpPerRound field, or parse from description, or default 1
            let bleedDmg = eff.hpPerRound;
            if (!bleedDmg && eff.description) {
                const m = eff.description.match(/(\d+)\s*HP/i);
                bleedDmg = m ? parseInt(m[1]) : 1;
            }
            bleedDmg = bleedDmg || 1;

            combatant.hp.current = Math.max(0, combatant.hp.current - bleedDmg);
            this.battleLog(`${combatant.name} bleeds for ${bleedDmg} HP. (HP: ${combatant.hp.current}/${combatant.hp.max})`);

            if (combatant.hp.current <= 0 && !combatant.defeated) {
                combatant.defeated = true;
                this.battleLog(`${combatant.name} has bled out!`);
            }
        }
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

        // Reset parry from previous turn
        if (current.parryDB > 0) {
            this.battleLog(`${current.name}: Parry expired (was +${current.parryDB} DB).`);
            current.parryDB = 0;
        }

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
// Uses full combat integration (attack tables, criticals, fumbles)
// ============================================================
App.battleSimulate = function() {
    console.log("=== MERP Battle Simulation: 2 PCs vs 2 Orc, Medium ===");
    console.log("Initiative: MERP rules - sorted by M&M Bonus (no dice roll)");
    console.log("Combat: Full attack resolution with criticals & fumbles");

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

    // Add 2 custom PCs with weapon data
    this.battleAddCustom({
        name: "Aragorn (Test)", hp: 80, initMod: 15, ob: 65, db: 30,
        armor: "Chain", team: "ally",
        attackTable: "AT1", primaryCrit: "Slash", fumbleRange: [1, 3], fumbleTable: 1
    });
    this.battleAddCustom({
        name: "Legolas (Test)", hp: 55, initMod: 25, ob: 75, db: 25,
        armor: "Soft Leather", team: "ally",
        attackTable: "AT4", primaryCrit: "Puncture", fumbleRange: [1, 5], fumbleTable: 2
    });

    // Add 2 Orc, Medium NPCs (auto-detects attack table)
    if (MERP.npcTemplates && MERP.npcTemplates["Orc, Medium"]) {
        this.battleAddNPC("Orc, Medium", 2);
    } else {
        this.battleAddCustom({ name: "Orc #1", hp: 60, initMod: 1, ob: 60, db: 30, armor: "Rigid Leather", team: "enemy" });
        this.battleAddCustom({ name: "Orc #2", hp: 60, initMod: 1, ob: 60, db: 30, armor: "Rigid Leather", team: "enemy" });
    }

    // Start battle
    this.battleStart();
    console.log("Battle started. Turn order (by M&M Bonus):");
    for (const c of this.battle.combatants) {
        const sign = c.initiative >= 0 ? '+' : '';
        console.log(`  ${sign}${c.initiative} - ${c.name} (${c.team}) [${c.attackTable}, ${c.primaryCrit}]`);
    }

    // Simulate 3 rounds of combat with full attack resolution
    const numCombatants = this.battle.combatants.length;
    const totalTurns = numCombatants * 3;
    let turnsCompleted = 0;

    for (let t = 0; t < totalTurns && turnsCompleted < totalTurns; t++) {
        const current = this.battle.combatants[this.battle.currentTurnIndex];
        if (!current) break;

        if (!current.defeated) {
            const targets = this.battle.combatants.filter(c =>
                c.team !== current.team && !c.defeated
            );
            if (targets.length > 0) {
                const target = targets[Math.floor(Math.random() * targets.length)];

                // Full attack resolution using combatant's attack data
                const atkResult = MERP.CombatResolver.resolveAttack({
                    attackerOB: current.ob,
                    defenderDB: (target.db || 0) + (target.parryDB || 0),
                    attackTable: current.attackTable || "AT1",
                    armorType: target.armor || "No Armor"
                });

                let totalDamage = atkResult.hits || 0;
                let critMsg = '';
                let fumbleMsg = '';

                // Auto-resolve critical
                if (atkResult.criticalLetter && atkResult.hits > 0) {
                    const critResult = MERP.CombatResolver.resolveCritical({
                        critType: current.primaryCrit || "Slash",
                        severity: atkResult.criticalLetter,
                        isLargeCreature: target.isLargeCreature || false
                    });
                    totalDamage += (critResult.hits || 0);
                    critMsg = ` + ${atkResult.criticalLetter} ${current.primaryCrit} crit (${critResult.hits || 0} bonus)`;
                    if (critResult.text) critMsg += ` [${critResult.text.substring(0, 60)}...]`;
                }

                // Auto-resolve fumble
                if (atkResult.fumble) {
                    const fumbleResult = MERP.CombatResolver.resolveFumble({
                        fumbleType: current.fumbleTable || 1
                    });
                    fumbleMsg = fumbleResult.text ? ` [${fumbleResult.text.substring(0, 60)}...]` : '';
                }

                if (atkResult.fumble) {
                    console.log(`  R${this.battle.round}: ${current.name} FUMBLES!${fumbleMsg}`);
                    this.battleLog(`${current.name} fumbles!${fumbleMsg}`);
                } else if (totalDamage > 0) {
                    target.hp.current = Math.max(0, target.hp.current - totalDamage);
                    if (target.hp.current <= 0 && !target.defeated) {
                        target.defeated = true;
                    }
                    console.log(`  R${this.battle.round}: ${current.name} → ${target.name}: ${totalDamage} total damage${critMsg} (HP: ${target.hp.current}/${target.hp.max})`);
                    this.battleLog(`${current.name} → ${target.name}: ${totalDamage} damage${critMsg}`);
                } else {
                    console.log(`  R${this.battle.round}: ${current.name} → ${target.name}: Miss (roll: ${atkResult.modifiedRoll})`);
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
        console.log(`  ${c.name}: HP ${c.hp.current}/${c.hp.max}${c.defeated ? ' [DEFEATED]' : ''} [${c.attackTable}]`);
    }
    this.battleSaveState();
    this.battleRender();
};
