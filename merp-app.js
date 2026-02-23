// MERP 2nd Edition - Application Controller
// Handles UI interactions, navigation, state management

const App = {
    characters: [],
    currentCharIndex: -1,
    wizardStep: 1,
    wizardChar: null,  // Character being created in wizard
    combatLogEntries: [],

    // ============================================================
    // INITIALIZATION
    // ============================================================
    init: function() {
        this.setupTabs();
        this.loadFromStorage();
        this.populateWeaponSelect();
        this.populateNPCSelects();
        this.updateCharSelector();
        this.updateCombatCharSelects();
    },

    // ============================================================
    // TAB NAVIGATION
    // ============================================================
    setupTabs: function() {
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById('tab-' + tab.dataset.tab).classList.add('active');

                // Auto-render content when switching to table tabs
                const tabName = tab.dataset.tab;
                if (tabName === 'spells') App.showSpellsTab();
                else if (tabName === 'attack-tables') App.showAttackTable();
                else if (tabName === 'critical-tables') App.showCriticalTable();
                else if (tabName === 'reference') App.showReferenceTable();
            });
        });
    },

    // ============================================================
    // LOCAL STORAGE
    // ============================================================
    saveToStorage: function() {
        const data = this.characters.map(c => c.toJSON());
        localStorage.setItem('merp_characters', JSON.stringify(data));
    },

    loadFromStorage: function() {
        try {
            const data = JSON.parse(localStorage.getItem('merp_characters'));
            if (data && Array.isArray(data)) {
                this.characters = data.map(j => MerpCharacter.fromJSON(j));
            }
        } catch(e) { /* ignore */ }
    },

    // ============================================================
    // CHARACTER SELECTOR
    // ============================================================
    updateCharSelector: function() {
        const sel = document.getElementById('charSelector');
        if (this.characters.length === 0) {
            sel.innerHTML = '<span class="char-chip" style="opacity:0.5">No characters yet</span>';
            document.getElementById('charSheet').style.display = 'none';
            return;
        }
        sel.innerHTML = this.characters.map((c, i) =>
            `<span class="char-chip ${i === this.currentCharIndex ? 'active' : ''}" onclick="App.selectCharacter(${i})">${c.name || 'Unnamed'} (${(MERP.races[c.race]?.label || c.race)} ${c.profession} L${c.level})</span>`
        ).join('');
    },

    selectCharacter: function(index) {
        this.currentCharIndex = index;
        this.updateCharSelector();
        this.showCharSheet();
    },

    // ============================================================
    // CHARACTER SHEET DISPLAY
    // ============================================================
    showCharSheet: function() {
        const char = this.characters[this.currentCharIndex];
        if (!char) return;

        // If character is mid-level-up, show the level-up panel instead
        if (char.levelUpState) {
            document.getElementById('charWizard').style.display = 'none';
            document.getElementById('charSheet').style.display = 'block';
            document.getElementById('charSheetContent').style.display = 'none';
            document.getElementById('levelUpPanel').style.display = 'block';
            this.renderLevelUpPanel();
            return;
        }

        document.getElementById('charWizard').style.display = 'none';
        const sheet = document.getElementById('charSheet');
        sheet.style.display = 'block';

        // Name, race, profession
        document.getElementById('sheetName').textContent = char.name || 'Unnamed';
        const raceLabel = MERP.races[char.race]?.label || char.race;
        document.getElementById('sheetRaceProf').textContent = `${raceLabel} ${char.profession}`;
        document.getElementById('sheetLevel').textContent = `Level ${char.level} | XP: ${char.experiencePoints}`;

        // Stats
        const statsDiv = document.getElementById('sheetStats');
        statsDiv.innerHTML = MERP.stats.map(s => {
            const st = char.stats[s];
            const sign = st.totalBonus >= 0 ? '+' : '';
            return `<div class="stat-block">
                <div class="stat-label">${MERP.statNames[s]}</div>
                <div class="stat-value">${st.value}</div>
                <div class="stat-bonus">${sign}${st.totalBonus}</div>
            </div>`;
        }).join('');

        // HP, PP, DB
        document.getElementById('sheetHP').textContent = `${char.hitPoints.current}/${char.hitPoints.max}`;
        document.getElementById('sheetPP').textContent = `${char.powerPoints.current}/${char.powerPoints.max}`;
        document.getElementById('sheetDB').textContent = char.defensiveBonus;

        // Resistance Bonuses
        document.getElementById('sheetRR').innerHTML = ['essence', 'channeling', 'poison', 'disease'].map(rr =>
            `<div class="stat-block"><div class="stat-label">${rr}</div><div class="stat-value" style="font-size:16px">${char.resistanceBonuses[rr]}</div></div>`
        ).join('');

        // Languages
        const langDiv = document.getElementById('sheetLanguages');
        langDiv.innerHTML = Object.entries(char.languages).map(([lang, rank]) =>
            `<span style="margin-right:12px;">${lang}: ${rank}</span>`
        ).join('') || '<span style="color:var(--text-secondary)">None</span>';

        // Known Spell Lists
        const spellPanel = document.getElementById('sheetSpellListsPanel');
        const spellDiv = document.getElementById('sheetSpellLists');
        const prof = MERP.professions[char.profession];
        const hasSpellLists = char.spellLists && char.spellLists.length > 0;
        const hasProgress = char.spellListProgress && Object.keys(char.spellListProgress).length > 0;
        if (prof && prof.spellUser && (hasSpellLists || hasProgress)) {
            spellPanel.style.display = '';
            let spellHtml = '';

            // Known lists
            if (hasSpellLists) {
                spellHtml += char.spellLists.map(name => {
                    const listData = MERP.spellListData ? MERP.spellListData[name] : null;
                    const type = listData ? listData.type : 'base';
                    return `<span class="spell-list-tag">${name} <span style="color:var(--text-secondary);font-size:10px;">(${type})</span></span>`;
                }).join('');
            }

            // In-progress lists
            if (hasProgress) {
                spellHtml += '<div style="margin-top:8px;font-size:11px;color:var(--text-secondary);width:100%;">In Progress:</div>';
                for (const [name, dp] of Object.entries(char.spellListProgress)) {
                    const chance = dp * 20;
                    spellHtml += `<span class="spell-list-tag" style="opacity:0.7;border-style:dashed;">${name} <span style="font-size:10px;">${dp} DP (${chance}%)</span></span>`;
                }
            }

            spellDiv.innerHTML = spellHtml;
        } else {
            spellPanel.style.display = 'none';
        }

        // Level Up button: show XP for next level
        const nextLevelXP = MERP.expForLevel(char.level + 1);
        const btnLevelUp = document.getElementById('btnLevelUp');
        if (btnLevelUp) {
            btnLevelUp.textContent = `Level Up (Next: ${nextLevelXP.toLocaleString()} XP)`;
        }

        // Ensure charSheetContent is visible and levelUpPanel hidden
        document.getElementById('charSheetContent').style.display = '';
        document.getElementById('levelUpPanel').style.display = 'none';

        // Skills
        this.renderSheetSkills(char);

        // Level History
        this.renderLevelHistory(char);
    },

    renderSheetSkills: function(char) {
        const div = document.getElementById('sheetSkills');
        let html = `<div class="skill-row header">
            <span>Skill</span><span class="text-center">Ranks</span><span class="text-center">Rank</span>
            <span class="text-center">Stat</span><span class="text-center">Prof</span>
            <span class="text-center">Item</span><span class="text-center">Total</span><span></span>
        </div>`;

        for (const [catKey, catData] of Object.entries(MERP.skillCategories)) {
            html += `<div class="skill-cat-header">${catData.label}</div>`;
            const skills = catData.skills || [];
            for (const skillName of skills) {
                const skill = char.skills[skillName];
                if (!skill) continue;
                html += `<div class="skill-row">
                    <span class="skill-name">${skillName}</span>
                    <span class="text-center">${skill.totalRanks}</span>
                    <span class="text-center">${skill.rankBonus}</span>
                    <span class="text-center">${skill.statBonus}</span>
                    <span class="text-center">${skill.profBonus}</span>
                    <span class="text-center">${skill.itemBonus}</span>
                    <span class="text-center" style="font-weight:bold;color:var(--text-heading)">${skill.totalBonus}</span>
                    <span></span>
                </div>`;
            }
        }
        div.innerHTML = html;
    },

    // ============================================================
    // LEVEL HISTORY DISPLAY
    // ============================================================
    renderLevelHistory: function(char) {
        const panel = document.getElementById('sheetLevelHistoryPanel');
        const div = document.getElementById('sheetLevelHistory');
        if (!panel || !div) return;

        if (!char.levelHistory || char.levelHistory.length === 0) {
            panel.style.display = 'none';
            return;
        }

        panel.style.display = '';
        let html = '';

        // Show most recent level first
        const entries = [...char.levelHistory].reverse();

        for (const entry of entries) {
            const date = entry.timestamp ? new Date(entry.timestamp).toLocaleDateString() : 'Unknown date';

            // Skills summary
            const skillEntries = Object.entries(entry.skillRanks || {});
            const skillCount = skillEntries.reduce((sum, [, count]) => sum + count, 0);
            const skillSummary = skillCount > 0 ? `${skillCount} rank${skillCount !== 1 ? 's' : ''}` : 'No skills';

            // Spell list summary
            let spellSummary = '';
            if (entry.spellListResults && entry.spellListResults.length > 0) {
                const learned = entry.spellListResults.filter(r => r.learned).length;
                const total = entry.spellListResults.length;
                spellSummary = ` | Spells: ${learned}/${total} learned`;
            }

            // Header line
            html += `<div class="level-history-entry" onclick="App.toggleLevelHistory(this)">
                <div class="level-history-header">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <span>
                            <strong style="color:var(--text-heading);">Level ${entry.level}</strong>
                            <span style="color:var(--text-secondary);font-size:11px;margin-left:8px;">${date}</span>
                        </span>
                        <span style="font-size:12px;color:var(--text-secondary);">
                            +${entry.hpGain} HP | ${skillSummary}${spellSummary}
                            <span style="margin-left:6px;">&#9660;</span>
                        </span>
                    </div>
                </div>
                <div class="level-history-detail collapsed">`;

            // HP detail — new format uses hpRolls array, old format has hpRoll/hpGain
            if (entry.hpRolls && entry.hpRolls.length > 0) {
                const bdCount = entry.bdRanks || entry.hpRolls.length;
                html += `<div style="margin-bottom:8px;">
                    <strong style="color:var(--accent-green);">Hit Points:</strong>
                    ${bdCount} Body Dev rank${bdCount > 1 ? 's' : ''}: rolled ${entry.hpRolls.join(' + ')} = <strong>+${entry.hpGain} HP</strong>
                    (Max: ${entry.hpMaxAfter})
                </div>`;
            } else if (entry.hpGain > 0) {
                // Backward compat: old format with hpRoll + CO bonus
                const coBonus = entry.hpGain - (entry.hpRoll || 0);
                const coSign = coBonus >= 0 ? '+' : '';
                html += `<div style="margin-bottom:8px;">
                    <strong style="color:var(--accent-green);">Hit Points:</strong>
                    Rolled ${entry.hpRoll || '?'} ${coSign}${coBonus} CO bonus = <strong>+${entry.hpGain} HP</strong>
                    (Max: ${entry.hpMaxAfter})
                </div>`;
            } else {
                html += `<div style="margin-bottom:8px;">
                    <strong style="color:var(--text-secondary);">Hit Points:</strong>
                    No Body Dev ranks purchased — 0 HP gained. (Max: ${entry.hpMaxAfter})
                </div>`;
            }

            // Development points
            if (entry.dpTotal > 0) {
                html += `<div style="margin-bottom:8px;">
                    <strong style="color:var(--text-heading);">Development Points:</strong>
                    ${entry.dpSpent} / ${entry.dpTotal} spent
                </div>`;
            }

            // Skill ranks
            if (skillEntries.length > 0) {
                html += `<div style="margin-bottom:8px;">
                    <strong style="color:var(--text-heading);">Skills Developed:</strong>
                    <div style="margin-top:4px;">`;
                for (const [skillName, count] of skillEntries) {
                    html += `<span style="display:inline-block;background:var(--bg-card);border:1px solid var(--border-light);border-radius:4px;padding:2px 8px;margin:2px;font-size:12px;">
                        ${skillName} <strong>+${count}</strong>
                    </span>`;
                }
                html += `</div></div>`;
            }

            // Spell list results
            if (entry.spellListResults && entry.spellListResults.length > 0) {
                html += `<div>
                    <strong style="color:var(--text-heading);">Spell List Learning:</strong>
                    <div style="margin-top:4px;">`;
                for (const r of entry.spellListResults) {
                    if (r.auto) {
                        html += `<div style="font-size:12px;color:var(--accent-green);margin:2px 0;">
                            &#10003; ${r.listName}: <strong>Learned</strong> (100% auto-learn, ${r.dpAllocated} DP)
                        </div>`;
                    } else if (r.learned) {
                        html += `<div style="font-size:12px;color:var(--accent-green);margin:2px 0;">
                            &#10003; ${r.listName}: <strong>Learned!</strong> (rolled ${r.roll}, needed &le; ${r.needed}, ${r.dpAllocated} DP)
                        </div>`;
                    } else {
                        html += `<div style="font-size:12px;color:var(--accent-red);margin:2px 0;">
                            &#10007; ${r.listName}: Not learned (rolled ${r.roll}, needed &le; ${r.needed}, ${r.dpAllocated} DP) - progress carried over
                        </div>`;
                    }
                }
                html += `</div></div>`;
            }

            html += `</div></div>`;
        }

        div.innerHTML = html;
    },

    toggleLevelHistory: function(entryEl) {
        const detail = entryEl.querySelector('.level-history-detail');
        if (detail) {
            detail.classList.toggle('collapsed');
            // Toggle arrow direction
            const arrow = entryEl.querySelector('.level-history-header span span:last-child');
            if (arrow) {
                arrow.innerHTML = detail.classList.contains('collapsed') ? '&#9660;' : '&#9650;';
            }
        }
    },

    // ============================================================
    // CHARACTER CREATION WIZARD
    // ============================================================
    newCharacter: function() {
        this.wizardChar = new MerpCharacter();
        this.wizardStep = 1;
        document.getElementById('charSheet').style.display = 'none';
        document.getElementById('charWizard').style.display = 'block';
        this.renderWizardStep();
    },

    renderWizardStep: function() {
        // Update step indicator
        const steps = ['Stats', 'Race', 'Profession', 'Skills', 'Details'];
        const ind = document.getElementById('stepIndicator');
        ind.innerHTML = steps.map((s, i) => {
            const num = i + 1;
            let cls = 'step';
            if (num < this.wizardStep) cls += ' completed';
            if (num === this.wizardStep) cls += ' active';
            return `<div class="${cls}">${num}. ${s}</div>`;
        }).join('');

        // Show/hide steps
        for (let i = 1; i <= 5; i++) {
            document.getElementById('wizStep' + i).style.display = (i === this.wizardStep) ? 'block' : 'none';
        }

        // Render step content
        if (this.wizardStep === 1) this.renderStatStep();
        if (this.wizardStep === 2) this.renderRaceStep();
        if (this.wizardStep === 3) this.renderProfStep();
        if (this.wizardStep === 4) this.renderSkillStep();
    },

    wizardNext: function() {
        if (this.wizardStep === 2 && !this.wizardChar.race) { alert('Please select a race.'); return; }
        if (this.wizardStep === 3 && !this.wizardChar.profession) { alert('Please select a profession.'); return; }
        if (this.wizardStep < 5) {
            this.wizardStep++;
            this.renderWizardStep();
        }
    },

    wizardPrev: function() {
        if (this.wizardStep > 1) {
            this.wizardStep--;
            this.renderWizardStep();
        }
    },

    // Step 1: Stats
    renderStatStep: function() {
        const div = document.getElementById('statInputs');
        div.innerHTML = MERP.stats.map(s => {
            const val = this.wizardChar.stats[s].value;
            const lookup = MERP.statBonusTable.lookup(val);
            const sign = lookup.bonus >= 0 ? '+' : '';
            return `<div class="stat-block">
                <div class="stat-label">${MERP.statNames[s]} (${s})</div>
                <input type="number" class="rank-input" id="stat_${s}" value="${val}" min="1" max="102"
                    onchange="App.updateStatInput('${s}', this.value)" style="width:60px;font-size:18px;text-align:center;margin:4px auto">
                <div class="stat-bonus">${sign}${lookup.bonus}</div>
            </div>`;
        }).join('');
    },

    updateStatInput: function(stat, val) {
        val = Math.max(1, Math.min(102, parseInt(val) || 50));
        this.wizardChar.stats[stat].value = val;
        const lookup = MERP.statBonusTable.lookup(val);
        this.wizardChar.stats[stat].normalBonus = lookup.bonus;
        this.renderStatStep();
    },

    rollAllStats: function() {
        const rolled = MerpCharacter.rollStats();
        for (const s of MERP.stats) {
            this.wizardChar.stats[s].value = rolled[s];
            this.wizardChar.stats[s].normalBonus = MERP.statBonusTable.lookup(rolled[s]).bonus;
        }
        this.renderStatStep();
    },

    // Step 2: Race
    renderRaceStep: function() {
        const renderGroup = (containerId, type) => {
            const container = document.getElementById(containerId);
            container.innerHTML = Object.entries(MERP.races)
                .filter(([_, r]) => r.type === type)
                .map(([key, r]) => {
                    const label = r.label || key.replace(/_/g, ' ');
                    const sel = this.wizardChar.race === key ? 'selected' : '';
                    return `<div class="choice-card ${sel}" onclick="App.selectRace('${key}')">
                        <div class="choice-title">${label}</div>
                        <div class="choice-detail">${type}</div>
                    </div>`;
                }).join('');
        };
        renderGroup('raceChoicesNonMannish', 'Non-Mannish');
        renderGroup('raceChoicesMannish', 'Mannish');

        // Show race details if selected
        if (this.wizardChar.race) {
            this.showRaceDetails(this.wizardChar.race);
        }
    },

    selectRace: function(raceKey) {
        this.wizardChar.setRace(raceKey);
        // Apply stat values
        const statVals = {};
        for (const s of MERP.stats) statVals[s] = this.wizardChar.stats[s].value;
        this.wizardChar.setStats(statVals);
        this.renderRaceStep();
    },

    showRaceDetails: function(raceKey) {
        const race = MERP.races[raceKey];
        const details = document.getElementById('raceDetails');
        details.style.display = 'block';
        const label = race.label || raceKey.replace(/_/g, ' ');
        const mods = MERP.stats.map(s => {
            const m = race.statMods[s];
            return m !== 0 ? `${s}: ${m > 0 ? '+' : ''}${m}` : null;
        }).filter(Boolean).join(', ') || 'None';
        const rr = ['essence', 'channeling', 'poison', 'disease']
            .map(r => race.rrMods[r] !== 0 ? `${r}: +${race.rrMods[r]}` : null)
            .filter(Boolean).join(', ') || 'None';
        details.innerHTML = `<strong style="color:var(--text-heading)">${label}</strong><br>
            <span style="color:var(--text-secondary)">Stat Mods:</span> ${mods}<br>
            <span style="color:var(--text-secondary)">RR Mods:</span> ${rr}<br>
            <span style="color:var(--text-secondary)">Background Options:</span> ${race.bgOptions}<br>
            <span style="color:var(--text-secondary)">Languages:</span> ${race.languages.join(', ')}`;
    },

    // Step 3: Profession
    renderProfStep: function() {
        const container = document.getElementById('profChoices');
        container.innerHTML = Object.entries(MERP.professions).map(([key, p]) => {
            const sel = this.wizardChar.profession === key ? 'selected' : '';
            const spellType = p.spellUser ? `(${p.spellUser} spells)` : '(no spells)';
            return `<div class="choice-card ${sel}" onclick="App.selectProf('${key}')">
                <div class="choice-title">${key}</div>
                <div class="choice-detail">Prime: ${p.primeStat} ${spellType}</div>
            </div>`;
        }).join('');

        if (this.wizardChar.profession) {
            this.showProfDetails(this.wizardChar.profession);
        }
    },

    selectProf: function(profKey) {
        this.wizardChar.setProfession(profKey);
        this.renderProfStep();
    },

    showProfDetails: function(profKey) {
        const prof = MERP.professions[profKey];
        const details = document.getElementById('profDetails');
        details.style.display = 'block';
        const bpl = prof.bonusPerLevel;
        details.innerHTML = `<strong style="color:var(--text-heading)">${profKey}</strong><br>
            <span style="color:var(--text-secondary)">Prime Stat:</span> ${prof.primeStat} (${MERP.statNames[prof.primeStat]})<br>
            <span style="color:var(--text-secondary)">Weapon OB/level:</span> +${bpl.weaponOB} |
            <span style="color:var(--text-secondary)">Non-Weapon/level:</span> +${bpl.nonWeaponOB} |
            <span style="color:var(--text-secondary)">Body Dev/level:</span> +${bpl.bodyDev} |
            <span style="color:var(--text-secondary)">Power Points/level:</span> +${bpl.powerPoints}<br>
            <span style="color:var(--text-secondary)">Spell User:</span> ${prof.spellUser || 'No'}`;
    },

    // Step 4: Skills
    renderSkillStep: function() {
        const char = this.wizardChar;
        char.updateDevelopmentPoints();
        const remaining = char.developmentPoints.total - char.developmentPoints.spent;
        document.getElementById('dpRemaining').textContent = remaining;
        document.getElementById('dpTotal').textContent = char.developmentPoints.total;

        const div = document.getElementById('skillGrid');
        let html = `<div class="skill-row header">
            <span>Skill</span><span class="text-center">Adol</span><span class="text-center">Dev</span>
            <span class="text-center">Total</span><span class="text-center">Bonus</span>
            <span class="text-center">Cost</span><span class="text-center">Total</span><span></span>
        </div>`;

        const costs = MERP.devPointCosts[char.profession];
        if (!costs) { div.innerHTML = 'Select a profession first.'; return; }

        for (const [catKey, catData] of Object.entries(MERP.skillCategories)) {
            html += `<div class="skill-cat-header">${catData.label}</div>`;
            const catCost = costs[catKey];
            const skills = catData.skills || [];
            for (const skillName of skills) {
                const skill = char.skills[skillName] || { adolRanks: 0, devRanks: 0, totalRanks: 0, rankBonus: -25, totalBonus: -25 };
                const nextCost = skill.devRanks === 0 ? (catCost ? catCost[0] : '?') : (catCost ? catCost[1] : '?');
                html += `<div class="skill-row">
                    <span class="skill-name">${skillName}</span>
                    <span class="text-center">${skill.adolRanks || 0}</span>
                    <span class="text-center">${skill.devRanks || 0}</span>
                    <span class="text-center">${skill.totalRanks || 0}</span>
                    <span class="text-center">${skill.rankBonus}</span>
                    <span class="text-center" style="color:var(--text-secondary)">${nextCost} DP</span>
                    <span class="text-center" style="font-weight:bold;color:var(--text-heading)">${skill.totalBonus || skill.rankBonus}</span>
                    <span><button class="btn btn-sm btn-primary" onclick="App.buySkillRank('${skillName}','${catKey}')">+</button></span>
                </div>`;
            }
        }
        div.innerHTML = html;
    },

    buySkillRank: function(skillName, catKey) {
        const result = this.wizardChar.addSkillRank(skillName, catKey);
        if (!result.success) {
            alert(result.reason);
            return;
        }
        this.renderSkillStep();
    },

    // Step 5: Finish
    finishCharacter: function() {
        const char = this.wizardChar;
        char.name = document.getElementById('charName').value || 'Unnamed';
        char.gender = document.getElementById('charGender').value;
        char.age = parseInt(document.getElementById('charAge').value) || 25;
        char.height = document.getElementById('charHeight').value;
        char.weight = document.getElementById('charWeight').value;
        char.hair = document.getElementById('charHair').value;
        char.eyes = document.getElementById('charEyes').value;
        char.demeanor = document.getElementById('charDemeanor').value;
        char.alignment = document.getElementById('charAlignment').value;

        // Set initial hit points based on Body Development ranks (MERP BT-4)
        // Each BD rank = roll 1d10. The starting bonus of +5 is included in the
        // adolescence rank count already. Minimum 1 HP.
        const bdSkill = char.skills["Body Development"];
        const bdRanks = bdSkill ? bdSkill.totalRanks : 0;
        let totalHP = 0;
        for (let i = 0; i < Math.max(1, bdRanks); i++) {
            totalHP += MERP.rollD10();
        }
        char.hitPoints.max = Math.max(1, totalHP);
        char.hitPoints.current = char.hitPoints.max;

        // Set initial power points
        char.powerPoints.current = char.powerPoints.max;

        // Grant starting spell lists for spell casters (canonical base lists per profession)
        const charProf = MERP.professions[char.profession];
        if (charProf && charProf.spellUser) {
            char.spellLists = [];
            const profSpellLists = MERP.spellLists[char.profession];
            if (profSpellLists && profSpellLists.base) {
                char.spellLists = [...profSpellLists.base];
            }
        }

        // Apply starting equipment
        const equip = MERP.startingEquipment[char.profession];
        if (equip) {
            char.armor = equip.armor;
            char.shield = equip.shield;
            char.weapons = [equip.weapon];
            char.gold = equip.gold;
        }

        char.recalculate();

        this.characters.push(char);
        this.currentCharIndex = this.characters.length - 1;
        this.wizardChar = null;
        this.saveToStorage();

        document.getElementById('charWizard').style.display = 'none';
        this.updateCharSelector();
        this.updateCombatCharSelects();
        this.showCharSheet();
    },

    deleteCharacter: function() {
        if (this.currentCharIndex < 0) return;
        if (!confirm('Delete this character? This cannot be undone.')) return;
        this.characters.splice(this.currentCharIndex, 1);
        this.currentCharIndex = this.characters.length > 0 ? 0 : -1;
        this.saveToStorage();
        this.updateCharSelector();
        this.updateCombatCharSelects();
        if (this.currentCharIndex >= 0) this.showCharSheet();
    },

    // ============================================================
    // LEVEL-UP SYSTEM
    // ============================================================
    levelUpCharacter: function() {
        const char = this.characters[this.currentCharIndex];
        if (!char) return;

        // Begin level-up process
        char.beginLevelUp();

        // Hide normal sheet, show level-up panel
        document.getElementById('charSheetContent').style.display = 'none';
        document.getElementById('levelUpPanel').style.display = 'block';

        this.renderLevelUpPanel();
        this.saveToStorage();
    },

    renderLevelUpPanel: function() {
        const char = this.characters[this.currentCharIndex];
        if (!char || !char.levelUpState) return;

        // Header info
        const raceLabel = MERP.races[char.race]?.label || char.race;
        document.getElementById('levelUpInfo').textContent =
            `${char.name} - ${raceLabel} ${char.profession} - Now Level ${char.level}`;

        // DP display
        const remaining = char.developmentPoints.total - char.developmentPoints.spent;
        document.getElementById('luDpRemaining').textContent = remaining;
        document.getElementById('luDpTotal').textContent = char.developmentPoints.total;

        // HP info — dynamic based on Body Development ranks purchased (MERP BT-4)
        const bdRanks = char.levelUpState.ranksThisLevel["Body Development"] || 0;
        const hpInfoDiv = document.getElementById('levelUpHpInfo');
        if (bdRanks === 0) {
            hpInfoDiv.innerHTML =
                `<span style="color:var(--text-secondary);">Hit Points: Purchase Body Development ranks to gain HP this level. ` +
                `Each rank = roll 1d10 HP. (Current HP: ${char.hitPoints.max})</span>`;
        } else {
            hpInfoDiv.innerHTML =
                `<span style="color:var(--accent-green);">Hit Points: ${bdRanks} Body Dev rank${bdRanks > 1 ? 's' : ''} purchased → ` +
                `<strong>${bdRanks}d10 HP</strong> will be rolled at confirmation. ` +
                `(Current HP: ${char.hitPoints.max})</span>`;
        }

        // Render skill grid
        this.renderLevelUpSkills(char);

        // Render spell section
        this.renderLevelUpSpells(char);
    },

    renderLevelUpSkills: function(char) {
        const div = document.getElementById('levelUpSkillGrid');
        let html = `<div class="skill-row-levelup header">
            <span>Skill</span><span class="text-center">Ranks</span>
            <span class="text-center">This Lvl</span>
            <span class="text-center">Rank</span><span class="text-center">Stat</span>
            <span class="text-center">Prof</span><span class="text-center">Total</span>
            <span class="text-center">Cost</span><span></span><span></span>
        </div>`;

        const costs = MERP.devPointCosts[char.profession];
        if (!costs) { div.innerHTML = 'Error: No cost data.'; return; }
        const remaining = char.developmentPoints.total - char.developmentPoints.spent;

        for (const [catKey, catData] of Object.entries(MERP.skillCategories)) {
            html += `<div class="skill-cat-header">${catData.label}</div>`;
            const catCost = costs[catKey];
            const skills = catData.skills || [];

            for (const skillName of skills) {
                const skill = char.skills[skillName] || {
                    adolRanks: 0, devRanks: 0, totalRanks: 0,
                    rankBonus: -25, statBonus: 0, profBonus: 0,
                    itemBonus: 0, totalBonus: -25
                };

                const ranksThisLevel = char.levelUpState.ranksThisLevel[skillName] || 0;
                const isMovement = (catKey === 'movementArmor');
                const atLimit = !isMovement && ranksThisLevel >= 2;

                // Next rank cost based on ranks this level
                const nextCost = ranksThisLevel === 0 ?
                    (catCost ? catCost[0] : '?') : (catCost ? catCost[1] : '?');

                const canAfford = typeof nextCost === 'number' && nextCost <= remaining;
                const canBuy = canAfford && !atLimit;
                const canRemove = ranksThisLevel > 0;
                const modClass = ranksThisLevel > 0 ? ' modified' : '';

                // Escape skill name for onclick (handle apostrophes)
                const escapedName = skillName.replace(/'/g, "\\'");

                html += `<div class="skill-row-levelup${modClass}">
                    <span class="skill-name">${skillName}</span>
                    <span class="text-center">${skill.totalRanks}</span>
                    <span class="text-center" style="color:${ranksThisLevel > 0 ? 'var(--text-heading)' : 'var(--text-secondary)'}">${ranksThisLevel > 0 ? '+' + ranksThisLevel : '-'}</span>
                    <span class="text-center">${skill.rankBonus}</span>
                    <span class="text-center">${skill.statBonus}</span>
                    <span class="text-center">${skill.profBonus}</span>
                    <span class="text-center" style="font-weight:bold;color:var(--text-heading)">${skill.totalBonus}</span>
                    <span class="text-center" style="color:var(--text-secondary);font-size:11px;">${atLimit ? 'MAX' : nextCost + ' DP'}</span>
                    <span><button class="btn btn-sm btn-primary" ${canBuy ? '' : 'disabled style="opacity:0.4"'} onclick="App.luBuyRank('${escapedName}','${catKey}')">+</button></span>
                    <span><button class="btn btn-sm btn-danger" ${canRemove ? '' : 'disabled style="opacity:0.4"'} onclick="App.luRemoveRank('${escapedName}','${catKey}')">&minus;</button></span>
                </div>`;
            }
        }
        div.innerHTML = html;
    },

    renderLevelUpSpells: function(char) {
        const prof = MERP.professions[char.profession];
        const section = document.getElementById('levelUpSpellSection');

        if (!prof || !prof.spellUser) {
            section.style.display = 'none';
            return;
        }
        section.style.display = 'block';

        const div = document.getElementById('levelUpSpellLists');
        const pool = char.levelUpState.spellListDPPool;
        const spent = char.levelUpState.spellListDPSpent;
        const slRemaining = pool - spent;

        if (pool === 0) {
            div.innerHTML = '<div style="color:var(--text-secondary);">This profession receives no spell list DP this level.</div>';
            return;
        }

        // Get all available spell lists for this profession
        const availableLists = MERP.getSpellListsForProfession(char.profession);

        // Also include lists from MERP.spellLists that may not be in spellListData
        const profSpellLists = MERP.spellLists[char.profession];
        if (profSpellLists) {
            for (const type of ['base', 'open', 'closed']) {
                if (profSpellLists[type]) {
                    for (const listName of profSpellLists[type]) {
                        if (!availableLists[listName]) {
                            availableLists[listName] = {
                                profession: char.profession,
                                realm: prof.spellUser === 'essence' ? 'Essence' : 'Channeling',
                                type: type,
                                spells: []
                            };
                        }
                    }
                }
            }
        }

        // Group by type
        const groups = { base: [], open: [] };
        for (const [listName, listData] of Object.entries(availableLists)) {
            const type = listData.type || 'base';
            if (!groups[type]) groups[type] = [];
            groups[type].push({ name: listName, ...listData });
        }

        const allocs = char.levelUpState.spellListAllocations;

        let html = `<div style="color:var(--text-secondary);font-size:12px;margin-bottom:8px;">
            Spell List DP: <strong style="color:var(--text-heading)">${slRemaining}</strong> / ${pool} remaining
            <span style="margin-left:12px;">(Each DP = 20% chance. 5 DP = auto-learn.)</span>
        </div>`;

        const groupLabels = { base: 'Base Lists', open: 'Open Lists' };

        for (const [type, lists] of Object.entries(groups)) {
            if (lists.length === 0) continue;
            html += `<div class="skill-cat-header">${groupLabels[type] || type}</div>`;

            for (const list of lists.sort((a, b) => a.name.localeCompare(b.name))) {
                const isKnown = char.spellLists.includes(list.name);
                const carryover = char.spellListProgress[list.name] || 0;
                const thisLevel = allocs[list.name] || 0;
                const totalDP = carryover + thisLevel;
                const chance = Math.min(100, totalDP * 20);
                const escapedName = list.name.replace(/'/g, "\\'");

                let statusHtml = '';
                let actionHtml = '';
                let cardClass = '';

                if (isKnown) {
                    cardClass = 'known';
                    statusHtml = '<span style="color:var(--accent-green);">Known</span>';
                } else {
                    const canAdd = slRemaining > 0;
                    const canRemove = thisLevel > 0;

                    let chanceColor = chance >= 100 ? 'var(--accent-green)' :
                                      chance >= 60 ? 'var(--text-heading)' :
                                      'var(--text-secondary)';

                    let parts = [];
                    if (carryover > 0) parts.push(`Carryover: ${carryover} DP`);
                    parts.push(`This level: ${thisLevel} DP`);
                    parts.push(`Total: <strong>${totalDP}</strong>`);
                    parts.push(`Chance: <strong style="color:${chanceColor}">${chance}%</strong>`);
                    if (chance >= 100) parts.push('<span style="color:var(--accent-green)">Auto-learn</span>');

                    statusHtml = `<span style="font-size:11px;">${parts.join(' | ')}</span>`;

                    actionHtml = `
                        <button class="btn btn-sm btn-primary" ${canAdd ? '' : 'disabled style="opacity:0.4"'}
                            onclick="App.luAllocateSpellDP('${escapedName}')">+1 DP</button>
                        <button class="btn btn-sm btn-danger" ${canRemove ? '' : 'disabled style="opacity:0.4"'}
                            onclick="App.luDeallocateSpellDP('${escapedName}')">&minus;1 DP</button>
                    `;

                    if (thisLevel > 0) cardClass = 'acquired-this-level';
                }

                html += `<div class="spell-list-card ${cardClass}">
                    <div>
                        <strong style="color:var(--text-heading)">${list.name}</strong>
                        <span style="font-size:11px;color:var(--text-secondary);margin-left:8px;">(${list.realm || '?'}, ${type})</span>
                        <div style="margin-top:4px;">${statusHtml}</div>
                    </div>
                    <div style="display:flex;gap:4px;align-items:center;">${actionHtml}</div>
                </div>`;
            }
        }

        div.innerHTML = html;
    },

    // Level-Up Action Handlers
    luBuyRank: function(skillName, catKey) {
        const char = this.characters[this.currentCharIndex];
        if (!char || !char.levelUpState) return;
        const result = char.addSkillRank(skillName, catKey);
        if (!result.success) { alert(result.reason); return; }
        this.renderLevelUpPanel();
        this.saveToStorage();
    },

    luRemoveRank: function(skillName, catKey) {
        const char = this.characters[this.currentCharIndex];
        if (!char || !char.levelUpState) return;
        const result = char.removeSkillRank(skillName, catKey);
        if (!result.success) { alert(result.reason); return; }
        this.renderLevelUpPanel();
        this.saveToStorage();
    },

    luAllocateSpellDP: function(listName) {
        const char = this.characters[this.currentCharIndex];
        if (!char || !char.levelUpState) return;
        const result = char.allocateSpellListDP(listName);
        if (!result.success) { alert(result.reason); return; }
        this.renderLevelUpPanel();
        this.saveToStorage();
    },

    luDeallocateSpellDP: function(listName) {
        const char = this.characters[this.currentCharIndex];
        if (!char || !char.levelUpState) return;
        const result = char.deallocateSpellListDP(listName);
        if (!result.success) { alert(result.reason); return; }
        this.renderLevelUpPanel();
        this.saveToStorage();
    },

    confirmLevelUp: function() {
        const char = this.characters[this.currentCharIndex];
        if (!char || !char.levelUpState) return;

        const remaining = char.developmentPoints.total - char.developmentPoints.spent;
        if (remaining > 0) {
            if (!confirm(`You have ${remaining} unspent skill development points. Continue anyway?`)) return;
        }

        // Warn about unspent spell list DP
        const slRemaining = char.levelUpState.spellListDPPool - char.levelUpState.spellListDPSpent;
        if (slRemaining > 0) {
            if (!confirm(`You have ${slRemaining} unspent spell list DP. Continue anyway?`)) return;
        }

        char.confirmLevelUp();

        // Build result message including HP and spell list roll results
        let resultMsg = `Level up complete! ${char.name} is now Level ${char.level}.`;

        // Show Body Development HP results
        const lastHistory = char.levelHistory && char.levelHistory.length > 0
            ? char.levelHistory[char.levelHistory.length - 1] : null;
        if (lastHistory && lastHistory.hpRolls && lastHistory.hpRolls.length > 0) {
            resultMsg += `\n\nBody Development HP: rolled ${lastHistory.hpRolls.join(' + ')} = +${lastHistory.hpGain} HP`;
            resultMsg += ` (Max HP now: ${lastHistory.hpMaxAfter})`;
        } else {
            resultMsg += '\n\nNo Body Development ranks purchased — 0 HP gained this level.';
        }

        if (char.lastSpellListRollResults && char.lastSpellListRollResults.length > 0) {
            resultMsg += '\n\nSpell List Learning Results:';
            for (const r of char.lastSpellListRollResults) {
                if (r.auto) {
                    resultMsg += `\n  ${r.listName}: LEARNED! (100% - auto-learn)`;
                } else if (r.learned) {
                    resultMsg += `\n  ${r.listName}: LEARNED! (rolled ${r.roll}, needed \u2264 ${r.needed})`;
                } else {
                    resultMsg += `\n  ${r.listName}: Not learned (rolled ${r.roll}, needed \u2264 ${r.needed}). Progress carries over.`;
                }
            }
            char.lastSpellListRollResults = null;
        }

        // Switch back to normal sheet
        document.getElementById('levelUpPanel').style.display = 'none';
        document.getElementById('charSheetContent').style.display = '';

        this.saveToStorage();
        this.updateCharSelector();
        this.showCharSheet();
        alert(resultMsg);
    },

    cancelLevelUp: function() {
        const char = this.characters[this.currentCharIndex];
        if (!char) return;

        if (!char.levelUpState) {
            // Recovery: levelUpState is gone (e.g., old save format) — just hide the panel
            document.getElementById('levelUpPanel').style.display = 'none';
            document.getElementById('charSheetContent').style.display = '';
            this.showCharSheet();
            return;
        }

        if (!confirm('Cancel level-up? All changes will be reverted.')) return;

        char.cancelLevelUp();

        // Switch back to normal sheet
        document.getElementById('levelUpPanel').style.display = 'none';
        document.getElementById('charSheetContent').style.display = '';

        this.saveToStorage();
        this.updateCharSelector();
        this.showCharSheet();
    },

    exportCharacter: function() {
        const char = this.characters[this.currentCharIndex];
        if (!char) { alert('No character selected.'); return; }
        const json = char.toJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = (char.name || 'character') + '.json';
        a.click();
        URL.revokeObjectURL(url);
    },

    importCharacter: function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const char = MerpCharacter.fromJSON(ev.target.result);
                    this.characters.push(char);
                    this.currentCharIndex = this.characters.length - 1;
                    this.saveToStorage();
                    this.updateCharSelector();
                    this.showCharSheet();
                } catch(err) {
                    alert('Error importing character: ' + err.message);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    },

    // ============================================================
    // COMBAT: ATTACKER/DEFENDER SOURCE SWITCHING
    // ============================================================
    switchAttackerSource: function() {
        const source = document.querySelector('input[name="atkSource"]:checked').value;
        document.getElementById('atkCharPanel').style.display = source === 'character' ? 'block' : 'none';
        document.getElementById('atkNpcPanel').style.display = source === 'npc' ? 'block' : 'none';
        if (source === 'character') this.updateCombatCharSelects();
    },

    switchDefenderSource: function() {
        const source = document.querySelector('input[name="defSource"]:checked').value;
        document.getElementById('defCharPanel').style.display = source === 'character' ? 'block' : 'none';
        document.getElementById('defNpcPanel').style.display = source === 'npc' ? 'block' : 'none';
        if (source === 'character') this.updateCombatCharSelects();
    },

    updateCombatCharSelects: function() {
        const opts = '<option value="">-- Select Character --</option>' +
            this.characters.map((c, i) => {
                const label = `${c.name || 'Unnamed'} (${c.profession} L${c.level})`;
                return `<option value="${i}">${label}</option>`;
            }).join('');
        const atkSel = document.getElementById('atkCharSelect');
        const defSel = document.getElementById('defCharSelect');
        if (atkSel) atkSel.innerHTML = opts;
        if (defSel) defSel.innerHTML = opts;
    },

    populateNPCSelects: function() {
        if (!MERP.npcCategories) return;
        let opts = '<option value="">-- Select NPC/Creature --</option>';
        for (const [cat, names] of Object.entries(MERP.npcCategories)) {
            opts += `<optgroup label="${cat}">`;
            for (const name of names) {
                opts += `<option value="${name}">${name}</option>`;
            }
            opts += '</optgroup>';
        }
        const atkSel = document.getElementById('atkNpcSelect');
        const defSel = document.getElementById('defNpcSelect');
        if (atkSel) atkSel.innerHTML = opts;
        if (defSel) defSel.innerHTML = opts;
    },

    loadAttackerFromChar: function() {
        const idx = parseInt(document.getElementById('atkCharSelect').value);
        if (isNaN(idx)) return;
        const char = this.characters[idx];
        if (!char) return;

        // Get primary weapon OB (first weapon, or default)
        let ob = 0;
        let obSource = 'none';
        const weaponName = char.weapons && char.weapons[0] ? char.weapons[0] : null;
        if (weaponName) {
            ob = char.getWeaponOB(weaponName);
            obSource = weaponName;
            // Set weapon dropdown
            const weapSel = document.getElementById('combatWeapon');
            if (weapSel) {
                for (const opt of weapSel.options) {
                    if (opt.value === weaponName) { opt.selected = true; break; }
                }
                // Sync attack table
                const weapon = MERP.weapons[weaponName];
                if (weapon) document.getElementById('combatTable').value = weapon.attackTable;
            }
        }

        // If spell mode is active and a spell is selected, use spell OB instead
        const attackType = document.querySelector('input[name="attackType"]:checked');
        if (attackType && attackType.value === 'spell') {
            const spellVal = document.getElementById('spellSelect').value;
            if (spellVal) {
                try {
                    const spell = JSON.parse(spellVal);
                    if (spell.isAttack && spell.attackTable) {
                        ob = char.getSpellOB(spell.attackTable);
                        obSource = spell.attackTable === 'AT7' ? 'Directed Spells' : 'Base Spell OB';
                    }
                } catch(e) { /* ignore parse error */ }
            }
        }

        document.getElementById('combatOB').value = ob;

        // Show spell lists if spell user (filtered to character's known lists)
        const prof = MERP.professions[char.profession];
        if (prof && prof.spellUser) {
            this.populateSpellListSelect(char);
        }

        // Info display
        const raceLabel = MERP.races[char.race]?.label || char.race;
        document.getElementById('atkCharInfo').innerHTML =
            `<strong>${char.name}</strong> | ${raceLabel} ${char.profession} L${char.level} | HP: ${char.hitPoints.current}/${char.hitPoints.max} | PP: ${char.powerPoints.current}/${char.powerPoints.max} | OB: ${ob} | ${obSource !== 'none' ? obSource : 'No weapon'}`;
    },

    loadDefenderFromChar: function() {
        const idx = parseInt(document.getElementById('defCharSelect').value);
        if (isNaN(idx)) return;
        const char = this.characters[idx];
        if (!char) return;

        document.getElementById('combatDB').value = char.defensiveBonus;
        // Set armor
        const armorSel = document.getElementById('combatArmor');
        for (const opt of armorSel.options) {
            if (opt.value === char.armor || opt.textContent === char.armor) { opt.selected = true; break; }
        }

        const raceLabel = MERP.races[char.race]?.label || char.race;
        document.getElementById('defCharInfo').innerHTML =
            `<strong>${char.name}</strong> | ${raceLabel} ${char.profession} L${char.level} | HP: ${char.hitPoints.current}/${char.hitPoints.max} | DB: ${char.defensiveBonus} | Armor: ${char.armor}`;
    },

    loadAttackerFromNPC: function() {
        const name = document.getElementById('atkNpcSelect').value;
        if (!name) return;
        const npc = MERP.npcTemplates[name];
        if (!npc) return;

        document.getElementById('combatOB').value = npc.ob;

        document.getElementById('atkNpcInfo').innerHTML =
            `<strong>${name}</strong> | L${npc.level} | HP: ${npc.hits} | DB: ${npc.db} | OB: ${npc.ob} | Armor: ${npc.armor} | Attack: ${npc.attackDesc} | Crit: ${npc.critType} | Size: ${npc.size}`;
    },

    loadDefenderFromNPC: function() {
        const name = document.getElementById('defNpcSelect').value;
        if (!name) return;
        const npc = MERP.npcTemplates[name];
        if (!npc) return;

        document.getElementById('combatDB').value = npc.db;
        // Set armor
        const armorSel = document.getElementById('combatArmor');
        for (const opt of armorSel.options) {
            if (opt.value === npc.armor || opt.textContent === npc.armor) { opt.selected = true; break; }
        }

        document.getElementById('defNpcInfo').innerHTML =
            `<strong>${name}</strong> | L${npc.level} | HP: ${npc.hits} | DB: ${npc.db} | Armor: ${npc.armor} | Crit: ${npc.critType} | Size: ${npc.size}`;
    },

    // ============================================================
    // COMBAT: ATTACK TYPE SWITCHING (Melee vs Spell)
    // ============================================================
    switchAttackType: function() {
        const type = document.querySelector('input[name="attackType"]:checked').value;
        document.getElementById('meleePanel').style.display = type === 'melee' ? 'block' : 'none';
        document.getElementById('spellPanel').style.display = type === 'spell' ? 'block' : 'none';

        // Auto-populate spell lists if character selected
        if (type === 'spell') {
            const atkSource = document.querySelector('input[name="atkSource"]:checked').value;
            if (atkSource === 'character') {
                const idx = parseInt(document.getElementById('atkCharSelect').value);
                if (!isNaN(idx) && this.characters[idx]) {
                    this.populateSpellListSelect(this.characters[idx]);
                }
            } else {
                // Show all spell lists for manual selection
                this.populateSpellListSelect(null);
            }
        }
    },

    populateSpellListSelect: function(charOrNull) {
        const sel = document.getElementById('spellListSelect');
        sel.innerHTML = '<option value="">-- Select Spell List --</option>';

        let lists;
        if (charOrNull && charOrNull.spellLists && charOrNull.spellLists.length > 0) {
            // Character selected: only show their known spell lists
            lists = {};
            for (const listName of charOrNull.spellLists) {
                if (MERP.spellListData && MERP.spellListData[listName]) {
                    lists[listName] = MERP.spellListData[listName];
                }
            }
        } else if (charOrNull && charOrNull.profession && MERP.getSpellListsForProfession) {
            // Character with no known lists: fall back to profession lists
            lists = MERP.getSpellListsForProfession(charOrNull.profession);
        } else {
            // Manual mode: show all spell lists
            lists = MERP.spellListData || {};
        }

        // Group by type
        const groups = { base: [], open: [], closed: [] };
        for (const [name, data] of Object.entries(lists)) {
            const type = data.type || 'base';
            if (!groups[type]) groups[type] = [];
            groups[type].push(name);
        }

        for (const [type, names] of Object.entries(groups)) {
            if (names.length === 0) continue;
            const label = type === 'base' ? 'Base Lists' : type === 'open' ? 'Open Lists' : 'Closed Lists';
            const group = document.createElement('optgroup');
            group.label = label;
            names.sort().forEach(n => {
                const opt = document.createElement('option');
                opt.value = n;
                opt.textContent = n;
                group.appendChild(opt);
            });
            sel.appendChild(group);
        }
    },

    updateSpellSelect: function() {
        const listName = document.getElementById('spellListSelect').value;
        const sel = document.getElementById('spellSelect');
        sel.innerHTML = '<option value="">-- Select Spell --</option>';

        if (!listName || !MERP.spellListData[listName]) return;

        const list = MERP.spellListData[listName];
        for (const spell of list.spells) {
            const opt = document.createElement('option');
            opt.value = JSON.stringify(spell);
            const attackTag = spell.isAttack ? ' [ATTACK]' : '';
            opt.textContent = `L${spell.level}: ${spell.name}${attackTag}`;
            sel.appendChild(opt);
        }
    },

    onSpellSelected: function() {
        const val = document.getElementById('spellSelect').value;
        if (!val) {
            document.getElementById('spellInfo').style.display = 'none';
            return;
        }

        try {
            const spell = JSON.parse(val);
            // Set attack table
            if (spell.attackTable) {
                document.getElementById('spellAttackTable').value = spell.attackTable;
            }

            // Auto-fill OB from selected attacker character's spell skill
            if (spell.isAttack && spell.attackTable) {
                const charIdx = parseInt(document.getElementById('atkCharSelect').value);
                if (!isNaN(charIdx) && this.characters[charIdx]) {
                    const char = this.characters[charIdx];
                    const spellOB = char.getSpellOB(spell.attackTable);
                    document.getElementById('combatOB').value = spellOB;
                }
            }

            // Show spell info
            const info = document.getElementById('spellInfo');
            info.style.display = 'block';
            let infoText = `<strong style="color:var(--text-heading)">${spell.name}</strong> (L${spell.level}) | Class: ${spell.class} | Area: ${spell.area} | Duration: ${spell.duration} | Range: ${spell.range}`;
            if (spell.isAttack) {
                infoText += `<br><span style="color:var(--accent-red)">Attack Spell</span> | Table: ${spell.attackTable}`;
                if (spell.critType) infoText += ` | Crit: ${spell.critType}`;
                if (spell.secondaryCrit) infoText += ` / ${spell.secondaryCrit}`;
                // Show which skill and the OB value
                const charIdx = parseInt(document.getElementById('atkCharSelect').value);
                const char = (!isNaN(charIdx) && this.characters[charIdx]) ? this.characters[charIdx] : null;
                if (spell.attackTable === 'AT7') {
                    const ob = char ? char.getSpellOB('AT7') : '?';
                    infoText += `<br>Uses: Directed Spells skill bonus (OB: ${ob})`;
                } else if (spell.attackTable === 'AT8') {
                    const ob = char ? char.getSpellOB('AT8') : '?';
                    infoText += `<br>Uses: Base Spell OB (OB: ${ob})`;
                } else if (spell.attackTable === 'AT9') {
                    const ob = char ? char.getSpellOB('AT9') : '?';
                    infoText += `<br>Uses: Base Spell OB (OB: ${ob}) (target gets RR)`;
                }
            } else {
                infoText += '<br><span style="color:var(--text-secondary)">Non-combat spell</span>';
            }
            document.getElementById('spellInfoText').innerHTML = infoText;
        } catch(e) {
            document.getElementById('spellInfo').style.display = 'none';
        }
    },

    // ============================================================
    // COMBAT RESOLUTION UI
    // ============================================================
    populateWeaponSelect: function() {
        const sel = document.getElementById('combatWeapon');
        sel.innerHTML = '<option value="">-- Select Weapon --</option>';
        const categories = {};
        for (const [name, w] of Object.entries(MERP.weapons)) {
            const catLabel = MERP.skillCategories[w.category]?.label || w.category;
            if (!categories[catLabel]) categories[catLabel] = [];
            categories[catLabel].push(name);
        }
        for (const [cat, weapons] of Object.entries(categories)) {
            const group = document.createElement('optgroup');
            group.label = cat;
            weapons.forEach(w => {
                const opt = document.createElement('option');
                opt.value = w;
                opt.textContent = w;
                group.appendChild(opt);
            });
            sel.appendChild(group);
        }

        // Sync weapon selection with attack table
        sel.addEventListener('change', () => {
            const weapon = MERP.weapons[sel.value];
            if (weapon) {
                document.getElementById('combatTable').value = weapon.attackTable;
            }
        });
    },

    resolveAttack: function() {
        const ob = parseInt(document.getElementById('combatOB').value) || 0;
        const db = parseInt(document.getElementById('combatDB').value) || 0;
        const armor = document.getElementById('combatArmor').value;
        const rollInput = document.getElementById('combatRoll').value;
        const roll = rollInput ? parseInt(rollInput) : null;

        const mods = {
            flank: document.getElementById('modFlank').checked,
            rear: document.getElementById('modRear').checked,
            surprised: document.getElementById('modSurprised').checked,
            stunnedOrDown: document.getElementById('modStunned').checked,
            drawingWeapon: document.getElementById('modDrawing').checked,
            halfHitsTaken: document.getElementById('modHalfHits').checked,
            custom: parseInt(document.getElementById('modCustom').value) || 0
        };

        // Determine if this is a spell attack or melee/missile
        const attackType = document.querySelector('input[name="attackType"]:checked').value;

        let weapon = null;
        let table = null;
        let spellCritType = null;
        let spellSecCrit = null;
        let spellName = null;
        let prepMod = 0;
        let isSpellAttack = false;

        if (attackType === 'spell') {
            isSpellAttack = true;
            // Get spell info
            const spellVal = document.getElementById('spellSelect').value;
            if (!spellVal) { alert('Please select a spell.'); return; }

            try {
                const spell = JSON.parse(spellVal);
                if (!spell.isAttack) { alert('Selected spell is not an attack spell.'); return; }

                table = spell.attackTable;
                spellCritType = spell.critType;
                spellSecCrit = spell.secondaryCrit || null;
                spellName = spell.name;

                // Apply preparation round modifier to custom mod
                const prepRounds = parseInt(document.getElementById('spellPrepRounds').value) || 2;
                prepMod = MERP.spellPrepMods[prepRounds] || 0;
                mods.custom = (mods.custom || 0) + prepMod;

                // For AT-9 (base spells / force), resolve via RR instead of normal attack
                if (table === 'AT9') {
                    // AT-9 spells: resolve on the attack table first, then target gets RR
                    // The result might include a note about resistance
                }
            } catch(e) {
                alert('Error reading spell data.'); return;
            }
        } else {
            weapon = document.getElementById('combatWeapon').value || null;
            table = document.getElementById('combatTable').value;
        }

        const result = MERP.CombatResolver.resolveAttack({
            attackerOB: ob,
            defenderDB: db,
            roll,
            weaponName: weapon,
            attackTable: table,
            armorType: armor,
            modifiers: mods
        });

        // Attach spell info to result for display
        result.isSpellAttack = isSpellAttack;
        result.spellCritType = spellCritType;
        result.spellSecCrit = spellSecCrit;
        result.spellName = spellName;
        result.prepMod = prepMod;

        this.displayAttackResult(result);
    },

    displayAttackResult: function(result) {
        const div = document.getElementById('combatResults');
        const rollStr = result.roll.openEnded ?
            `${result.roll.total} (rolls: ${result.roll.rolls.join(', ')})` :
            `${result.roll.total}`;

        const titleLabel = result.isSpellAttack ? `Spell Attack: ${result.spellName}` : 'Attack Result';
        const prepInfo = result.isSpellAttack && result.prepMod !== 0 ?
            ` | Prep Mod: ${result.prepMod >= 0 ? '+' : ''}${result.prepMod}` : '';

        let html = `<div class="result-box">
            <div class="result-title">${titleLabel}</div>
            <div class="flex-row flex-between mb-1">
                <span>Roll: <span class="roll-display">${rollStr}</span></span>
                <span class="roll-detail">OB: ${result.attackerOB} | DB: ${result.defenderDB} | Mods: ${result.totalMod}${prepInfo}</span>
            </div>
            <div class="roll-detail mb-1">Modified Roll: ${result.modifiedRoll} | Armor: ${result.armorType} | Table: ${result.attackTable}</div>`;

        if (result.fumble) {
            const fumbleTable = result.isSpellAttack ? 3 : 1; // FT-3 for spell failures
            html += `<div class="result-fumble">
                <div style="font-size:20px;font-weight:bold;color:#c080ff;">FUMBLE!</div>
                <div style="color:var(--text-secondary);margin-top:4px;">Roll on Fumble Table ${fumbleTable === 3 ? 'FT-3 (Spell Failure)' : 'FT-1/FT-2 (Weapon)'}.</div>
                <div class="mt-1"><button class="btn btn-sm btn-primary" onclick="App.autoResolveFumble(${fumbleTable})">Roll FT-${fumbleTable} Fumble</button></div>
            </div>`;
        } else if (result.hits > 0 || result.criticalLetter) {
            html += `<div class="result-hit">${result.hits} Hit${result.hits !== 1 ? 's' : ''}`;
            if (result.criticalLetter) {
                html += ` + "${result.criticalLetter}" Critical`;
            }
            html += `</div>`;

            // For AT-9 spell attacks, note that the target gets a Resistance Roll
            if (result.isSpellAttack && result.attackTable === 'AT9') {
                html += `<div style="color:var(--accent-blue);font-size:13px;margin-top:6px;">
                    <strong>Note:</strong> Target may attempt a Resistance Roll (RR) to resist this spell's effects.
                </div>`;
            }

            // Auto-resolve critical if present
            if (result.criticalLetter) {
                // Determine critical type: use spell crit type for spell attacks, weapon crit for melee
                let critType;
                let critLabel;
                if (result.isSpellAttack && result.spellCritType) {
                    critType = result.spellCritType;
                    critLabel = `${critType}${result.spellSecCrit ? ' / ' + result.spellSecCrit : ''}`;
                } else if (result.weapon && MERP.weapons[result.weapon]) {
                    critType = MERP.weapons[result.weapon].primaryCrit;
                    critLabel = critType;
                } else {
                    critType = 'Slash';
                    critLabel = 'Slash';
                }

                // Check if defender is large creature
                const defSource = document.querySelector('input[name="defSource"]:checked').value;
                let isLarge = false;
                if (defSource === 'npc') {
                    const npcName = document.getElementById('defNpcSelect').value;
                    const npc = npcName ? MERP.npcTemplates[npcName] : null;
                    if (npc && (npc.size === 'Large' || npc.size === 'Huge')) isLarge = true;
                }

                const escCrit = critType.replace(/'/g, "\\'");
                html += `<div class="mt-1">
                    <button class="btn btn-danger btn-sm" onclick="App.autoResolveCritical('${escCrit}', '${result.criticalLetter}', ${isLarge})">Roll ${critLabel} ${result.criticalLetter}-Critical</button>`;

                // If there's a secondary crit (e.g., Ice Bolt = Impact + Cold)
                if (result.isSpellAttack && result.spellSecCrit) {
                    const escSec = result.spellSecCrit.replace(/'/g, "\\'");
                    html += ` <button class="btn btn-danger btn-sm" onclick="App.autoResolveCritical('${escSec}', '${result.criticalLetter}', ${isLarge})">Roll ${result.spellSecCrit} ${result.criticalLetter}-Critical</button>`;
                }
                html += `</div>`;
            }
        } else {
            html += `<div class="result-miss">Miss</div>`;
        }

        html += `</div>`;
        div.innerHTML = html;

        // Add to combat log
        const attackLabel = result.isSpellAttack ? `Spell: ${result.spellName}` : 'Attack';
        const logEntry = result.fumble ? 'FUMBLE' :
            (result.hits > 0 ? `${result.hits} hits${result.criticalLetter ? ' + ' + result.criticalLetter + ' crit' : ''}` : 'Miss');
        this.addCombatLog(`${attackLabel} (roll ${result.roll.total}, mod ${result.modifiedRoll}): ${logEntry}`);
    },

    autoResolveCritical: function(critType, severity, isLargeCreature) {
        const result = MERP.CombatResolver.resolveCritical({ critType, severity, isLargeCreature: !!isLargeCreature });
        this.displayCriticalResult(result);
    },

    autoResolveFumble: function(fumbleTable) {
        const result = MERP.CombatResolver.resolveFumble({ fumbleType: fumbleTable });
        const div = document.getElementById('combatResults');
        const rollStr = result.roll.openEnded ?
            `${result.roll.total} (rolls: ${result.roll.rolls.join(', ')})` :
            `${result.roll.total}`;

        div.innerHTML = `<div class="result-box">
            <div class="result-title">Fumble Result (FT-${fumbleTable})</div>
            <div class="flex-row mb-1">
                <span>Roll: <span class="roll-display">${rollStr}</span></span>
                <span class="roll-detail" style="margin-left:12px">Modified: ${result.modifiedRoll}</span>
            </div>
            <div class="result-fumble">
                <div style="font-size:16px;font-weight:bold;color:#c080ff;">Fumble!</div>
                <div style="color:var(--text-primary);margin-top:6px;">${result.text}</div>
            </div>
        </div>`;

        this.addCombatLog(`Fumble FT-${fumbleTable} (roll ${result.roll.total}): ${result.text.substring(0, 80)}...`);
    },

    resolveCritical: function() {
        const critType = document.getElementById('critType').value;
        const severity = document.getElementById('critSeverity').value;
        const rollInput = document.getElementById('critRoll').value;
        const roll = rollInput ? parseInt(rollInput) : null;

        const result = MERP.CombatResolver.resolveCritical({ critType, severity, roll });
        this.displayCriticalResult(result);
    },

    displayCriticalResult: function(result) {
        const div = document.getElementById('combatResults');
        const rollStr = result.roll.openEnded ?
            `${result.roll.total} (rolls: ${result.roll.rolls.join(', ')})` :
            `${result.roll.total}`;

        let html = `<div class="result-box">
            <div class="result-title">${result.critType} Critical - Severity ${result.severity}</div>
            <div class="flex-row mb-1">
                <span>Roll: <span class="roll-display">${rollStr}</span></span>
                <span class="roll-detail" style="margin-left:12px">Severity mod: ${result.severityMod >= 0 ? '+' : ''}${result.severityMod} | Modified: ${result.modifiedRoll}</span>
            </div>
            <div class="result-critical">
                <div class="crit-severity">${result.critType} ${result.severity} Critical</div>
                ${result.hits > 0 ? `<div style="color:var(--accent-red);font-size:16px;margin-top:4px;">+${result.hits} additional hits</div>` : ''}
                <div class="crit-text">${result.text}</div>
            </div>
        </div>`;
        div.innerHTML = html;

        this.addCombatLog(`${result.critType} ${result.severity}-crit (roll ${result.roll.total}, mod ${result.modifiedRoll}): ${result.text.substring(0, 80)}...`);
    },

    resolveFumble: function() {
        const tableNum = parseInt(document.getElementById('fumbleTable').value);
        const mod = parseInt(document.getElementById('fumbleMod').value) || 0;
        const rollInput = document.getElementById('fumbleRoll').value;
        const roll = rollInput ? parseInt(rollInput) : null;

        const result = MERP.CombatResolver.resolveFumble({ fumbleType: tableNum, roll, modifier: mod });

        const div = document.getElementById('combatResults');
        const rollStr = result.roll.openEnded ?
            `${result.roll.total} (rolls: ${result.roll.rolls.join(', ')})` :
            `${result.roll.total}`;

        div.innerHTML = `<div class="result-box">
            <div class="result-title">Fumble Result (FT-${tableNum})</div>
            <div class="flex-row mb-1">
                <span>Roll: <span class="roll-display">${rollStr}</span></span>
                <span class="roll-detail" style="margin-left:12px">Modifier: ${mod} | Modified: ${result.modifiedRoll}</span>
            </div>
            <div class="result-fumble">
                <div style="font-size:16px;font-weight:bold;color:#c080ff;">Fumble!</div>
                <div style="color:var(--text-primary);margin-top:6px;">${result.text}</div>
            </div>
        </div>`;

        this.addCombatLog(`Fumble FT-${tableNum} (roll ${result.roll.total}): ${result.text.substring(0, 80)}...`);
    },

    // ============================================================
    // COMBAT: RESISTANCE ROLL
    // ============================================================
    resolveRR: function() {
        const targetLevel = parseInt(document.getElementById('rrTargetLevel').value) || 1;
        const attackLevel = parseInt(document.getElementById('rrAttackLevel').value) || 1;
        const rrBonus = parseInt(document.getElementById('rrBonus').value) || 0;
        const rollInput = document.getElementById('rrRoll').value;
        const roll = rollInput ? parseInt(rollInput) : null;

        const result = MERP.CombatResolver.resolveResistanceRoll({
            targetLevel,
            attackLevel,
            targetRRBonus: rrBonus,
            roll
        });

        const div = document.getElementById('combatResults');
        const rollStr = result.roll.openEnded ?
            `${result.roll.total} (rolls: ${result.roll.rolls.join(', ')})` :
            `${result.roll.total}`;

        const successColor = result.success ? 'var(--accent-green)' : 'var(--accent-red)';
        const successText = result.success ? 'RESISTED!' : 'FAILED TO RESIST!';

        div.innerHTML = `<div class="result-box">
            <div class="result-title">Resistance Roll</div>
            <div class="flex-row flex-between mb-1">
                <span>Roll: <span class="roll-display">${rollStr}</span></span>
                <span class="roll-detail">Target L${targetLevel} vs Attacker L${attackLevel}</span>
            </div>
            <div class="roll-detail mb-1">RR Bonus: +${rrBonus} | Modified: ${result.modifiedRoll} | Needed: ${result.needed}</div>
            <div style="font-size:28px;font-weight:bold;color:${successColor};font-family:var(--font-heading);margin-top:8px;">
                ${successText}
            </div>
            <div style="color:var(--text-secondary);font-size:12px;margin-top:4px;">
                Modified Roll (${result.modifiedRoll}) ${result.success ? '>=' : '<'} Target Number (${result.needed})
            </div>
        </div>`;

        this.addCombatLog(`RR: Target L${targetLevel} vs Attacker L${attackLevel} (roll ${result.roll.total}, mod ${result.modifiedRoll}, needed ${result.needed}): ${result.text}`);
    },

    addCombatLog: function(entry) {
        const time = new Date().toLocaleTimeString();
        this.combatLogEntries.unshift(`[${time}] ${entry}`);
        if (this.combatLogEntries.length > 50) this.combatLogEntries.pop();
        const log = document.getElementById('combatLog');
        log.innerHTML = this.combatLogEntries.map(e =>
            `<div style="padding:3px 0;border-bottom:1px solid rgba(255,255,255,0.05);">${e}</div>`
        ).join('');
    },

    // ============================================================
    // TABLE DISPLAY
    // ============================================================
    // ============================================================
    // SPELLS TAB
    // ============================================================
    showSpellsTab: function() {
        const div = document.getElementById('spellsTableDisplay');
        if (!div) return;
        this.showSpellListsTable(div);
    },

    // ============================================================
    // ATTACK TABLES TAB
    // ============================================================
    showAttackTable: function() {
        const sel = document.getElementById('attackTableSelect');
        const div = document.getElementById('attackTableDisplay');
        if (!sel || !div) return;

        const tableId = sel.value;
        const table = MERP[tableId];
        if (!table) { div.innerHTML = 'Table not found.'; return; }

        let html = `<table class="data-table"><tr><th>Roll</th><th>Plate</th><th>Chain</th><th>Rigid Leather</th><th>Soft Leather</th><th>No Armor</th></tr>`;
        for (const row of table) {
            const range = row[0] === row[1] ? row[0] : `${row[0]}-${row[1]}`;
            html += `<tr><td>${range}</td>`;
            for (let c = 2; c < row.length; c++) {
                const val = row[c];
                let cls = '';
                if (val === "F") cls = 'style="color:#c080ff"';
                else if (typeof val === 'string' && val.match(/[A-E]$/)) cls = 'style="color:var(--accent-red);font-weight:bold"';
                else if (val === 0) cls = 'style="color:var(--text-secondary)"';
                html += `<td class="text-center" ${cls}>${val}</td>`;
            }
            html += `</tr>`;
        }
        html += `</table>`;
        div.innerHTML = html;
    },

    // ============================================================
    // CRITICAL TABLES TAB
    // ============================================================
    showCriticalTable: function() {
        const sel = document.getElementById('criticalTableSelect');
        const div = document.getElementById('criticalTableDisplay');
        if (!sel || !div) return;

        const tableId = sel.value;
        const table = MERP[tableId];
        if (!table) { div.innerHTML = 'Table not found.'; return; }

        let html = `<h3 style="color:var(--text-heading);margin-bottom:8px;">${table.name} Critical Table</h3>`;
        html += `<table class="data-table"><tr><th>Roll</th><th>Result</th></tr>`;
        for (const entry of table.entries) {
            const range = entry[0] <= -900 ? `<${entry[1]+1}` :
                entry[1] >= 900 ? `${entry[0]}+` :
                entry[0] === entry[1] ? entry[0] : `${entry[0]}-${entry[1]}`;
            const hitStr = entry[2].hits > 0 ? `<span style="color:var(--accent-red);font-weight:bold">+${entry[2].hits} hits.</span> ` : '';
            html += `<tr><td class="text-center" style="white-space:nowrap">${range}</td><td>${hitStr}${entry[2].text}</td></tr>`;
        }
        html += `</table>`;
        html += `<div style="color:var(--text-secondary);font-size:11px;margin-top:8px;">Severity Modifiers: T=-50, A=-20, B=-10, C=+0, D=+10, E=+20</div>`;
        div.innerHTML = html;
    },

    // ============================================================
    // REFERENCE TAB (Fumbles, Weapons, NPCs)
    // ============================================================
    showReferenceTable: function() {
        const sel = document.getElementById('referenceTableSelect');
        const div = document.getElementById('referenceTableDisplay');
        if (!sel || !div) return;

        const tableId = sel.value;

        if (tableId === 'weapons') {
            this.showWeaponsTable(div);
            return;
        }

        if (tableId === 'npcTemplates') {
            this.showNPCTable(div);
            return;
        }

        // Fumble tables
        if (tableId.startsWith('FT')) {
            const table = MERP[tableId];
            if (!table) { div.innerHTML = 'Table not found.'; return; }
            let html = `<h3 style="color:var(--text-heading);margin-bottom:8px;">${table.name}</h3>`;
            html += `<table class="data-table"><tr><th>Roll</th><th>Result</th></tr>`;
            for (const entry of table.entries) {
                const range = entry[0] <= -900 ? `<${entry[1]+1}` :
                    entry[1] >= 900 ? `${entry[0]}+` :
                    entry[0] === entry[1] ? entry[0] : `${entry[0]}-${entry[1]}`;
                html += `<tr><td class="text-center" style="white-space:nowrap">${range}</td><td>${entry[2].text}</td></tr>`;
            }
            html += `</table>`;
            if (table.mods) {
                html += `<div style="color:var(--text-secondary);font-size:11px;margin-top:8px;">Modifications: `;
                html += Object.entries(table.mods).map(([k,v]) => `${v >= 0 ? '+' : ''}${v} ${k}`).join(', ');
                html += `</div>`;
            }
            div.innerHTML = html;
            return;
        }
    },

    showWeaponsTable: function(div) {
        let html = `<table class="data-table"><tr><th>Weapon</th><th>Category</th><th>Fumble</th><th>Primary Crit</th><th>Secondary Crit</th><th>Range</th><th>Weight</th><th>Special</th></tr>`;
        for (const [name, w] of Object.entries(MERP.weapons)) {
            const catLabel = MERP.skillCategories[w.category]?.label || w.category;
            html += `<tr>
                <td>${name}</td>
                <td>${catLabel}</td>
                <td class="text-center">${w.fumble[0]}-${w.fumble[1]}</td>
                <td>${w.primaryCrit}</td>
                <td>${w.secondaryCrit || '—'}</td>
                <td class="text-center">${w.baseRange || '—'}</td>
                <td class="text-center">${w.weight}</td>
                <td style="font-size:11px;color:var(--text-secondary)">${w.special || '—'}</td>
            </tr>`;
        }
        html += `</table>`;
        div.innerHTML = html;
    },

    showNPCTable: function(div) {
        if (!MERP.npcTemplates) { div.innerHTML = 'No NPC data loaded.'; return; }
        let html = `<h3 style="color:var(--text-heading);margin-bottom:8px;">NPC / Creature Templates (ST-2)</h3>`;
        html += `<table class="data-table"><tr><th>Name</th><th>Lvl</th><th>Hits</th><th>Armor</th><th>DB</th><th>OB</th><th>Attack</th><th>Crit</th><th>Size</th></tr>`;

        for (const [cat, names] of Object.entries(MERP.npcCategories)) {
            html += `<tr><td colspan="9" style="background:var(--bg-panel);color:var(--text-heading);font-weight:bold;padding:8px;">${cat}</td></tr>`;
            for (const name of names) {
                const npc = MERP.npcTemplates[name];
                if (!npc) continue;
                html += `<tr>
                    <td style="font-weight:bold">${name}</td>
                    <td class="text-center">${npc.level}</td>
                    <td class="text-center" style="color:var(--accent-red)">${npc.hits}</td>
                    <td>${npc.armor}</td>
                    <td class="text-center">${npc.db}</td>
                    <td class="text-center" style="font-weight:bold">${npc.ob}</td>
                    <td>${npc.attackDesc}</td>
                    <td>${npc.critType}</td>
                    <td class="text-center">${npc.size}</td>
                </tr>`;
            }
        }
        html += `</table>`;
        div.innerHTML = html;
    },

    showSpellListsTable: function(div) {
        if (!MERP.spellListData) { div.innerHTML = 'No spell data loaded.'; return; }

        // Group spell lists by profession
        const byProf = {};
        for (const [listName, listData] of Object.entries(MERP.spellListData)) {
            const prof = listData.profession || 'Other';
            if (!byProf[prof]) byProf[prof] = [];
            byProf[prof].push({ name: listName, ...listData });
        }

        const profLabels = {
            "Mage": "Mage Base Lists (Essence)",
            "Animist": "Animist Base Lists (Channeling)",
            "Ranger": "Ranger Base Lists (Channeling)",
            "Bard": "Bard Base Lists (Essence)",
            "open_essence": "Open Essence Lists",
            "open_channeling": "Open Channeling Lists"
        };

        let html = `<h3 style="color:var(--text-heading);margin-bottom:8px;">Spell Lists Reference</h3>`;
        html += `<div style="color:var(--text-secondary);font-size:12px;margin-bottom:12px;">
            Spell Classes: <strong>DE</strong>=Directed Elemental (AT-7), <strong>BE</strong>=Ball Elemental (AT-8),
            <strong>F</strong>=Force (AT-9/RR), <strong>E</strong>=Elemental, <strong>P</strong>=Passive,
            <strong>U</strong>=Utility, <strong>I</strong>=Informational |
            <span style="color:var(--accent-red)">Red = Attack spell</span>
        </div>`;

        for (const [prof, lists] of Object.entries(byProf)) {
            const label = profLabels[prof] || prof;
            html += `<div class="panel-title" style="margin-top:16px;font-size:16px;">${label}</div>`;

            for (const list of lists) {
                html += `<div class="card" style="margin-bottom:8px;">
                    <div style="color:var(--text-heading);font-weight:bold;margin-bottom:4px;">${list.name}
                        <span style="font-weight:normal;font-size:11px;color:var(--text-secondary);"> (${list.realm}, ${list.type})</span>
                    </div>`;
                html += `<table class="data-table"><tr><th>Lvl</th><th>Spell</th><th>Class</th><th>Area</th><th>Duration</th><th>Range</th><th>Attack</th></tr>`;
                for (const spell of list.spells) {
                    const atkStyle = spell.isAttack ? 'color:var(--accent-red);font-weight:bold' : 'color:var(--text-secondary)';
                    const atkInfo = spell.isAttack ?
                        `${spell.attackTable}${spell.critType ? ' (' + spell.critType + ')' : ''}` : '—';
                    html += `<tr>
                        <td class="text-center">${spell.level}</td>
                        <td style="${spell.isAttack ? 'color:var(--accent-red)' : ''}">${spell.name}</td>
                        <td class="text-center">${spell.class}</td>
                        <td>${spell.area}</td>
                        <td>${spell.duration}</td>
                        <td>${spell.range}</td>
                        <td class="text-center" style="${atkStyle}">${atkInfo}</td>
                    </tr>`;
                }
                html += `</table></div>`;
            }
        }
        div.innerHTML = html;
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => App.init());
