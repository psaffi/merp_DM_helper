// MERP 2nd Edition - Character Creation & Management Module

// ============================================================
// CHARACTER CLASS
// ============================================================
class MerpCharacter {
    constructor() {
        this.name = "";
        this.race = "";
        this.profession = "";
        this.level = 1;
        this.experiencePoints = 0;

        // Personal details
        this.age = 0;
        this.gender = "";
        this.height = "";
        this.weight = "";
        this.hair = "";
        this.eyes = "";
        this.demeanor = "";
        this.personality = "";
        this.alignment = "";

        // Stats: {value, normalBonus, raceBonus, totalBonus}
        this.stats = {};
        for (const stat of MERP.stats) {
            this.stats[stat] = { value: 50, normalBonus: 0, raceBonus: 0, totalBonus: 0 };
        }

        // Skills: {rank, statBonus, profBonus, itemBonus, specialBonus, totalBonus}
        this.skills = {};

        // Derived values
        this.hitPoints = { max: 0, current: 0 };
        this.powerPoints = { max: 0, current: 0 };
        this.defensiveBonus = 0;
        this.resistanceBonuses = { essence: 0, channeling: 0, poison: 0, disease: 0 };

        // Equipment
        this.armor = "No Armor";
        this.shield = false;
        this.weapons = [];
        this.equipment = [];
        this.gold = 0;

        // Spell lists
        this.spellLists = [];
        // Spell list learning progress (carries over between levels)
        // Format: { "listName": dpAllocated, ... }
        this.spellListProgress = {};

        // Languages
        this.languages = {};

        // Development points tracking
        this.developmentPoints = { total: 0, spent: 0 };

        // Background options used
        this.backgroundOptions = [];

        // Level-up history: records what happened at each level-up
        this.levelHistory = [];

        // Level-up transient state (not serialized)
        this.levelUpState = null;
    }

    // ============================================================
    // STAT GENERATION
    // ============================================================
    static rollStats() {
        // Roll method: roll d100 for each stat (or use point-buy)
        const stats = {};
        for (const stat of MERP.stats) {
            // Simulate 1-100 roll, reroll if below 20
            let roll;
            do {
                roll = Math.floor(Math.random() * 100) + 1;
            } while (roll < 20);
            stats[stat] = roll;
        }
        return stats;
    }

    setStats(statValues) {
        for (const stat of MERP.stats) {
            if (statValues[stat] !== undefined) {
                this.stats[stat].value = statValues[stat];
                const lookup = MERP.statBonusTable.lookup(statValues[stat]);
                this.stats[stat].normalBonus = lookup.bonus;
            }
        }
        this.updateRaceBonuses();
        this.recalculate();
    }

    updateRaceBonuses() {
        if (!this.race || !MERP.races[this.race]) return;
        const race = MERP.races[this.race];
        for (const stat of MERP.stats) {
            this.stats[stat].raceBonus = race.statMods[stat] || 0;
            this.stats[stat].totalBonus = this.stats[stat].normalBonus + this.stats[stat].raceBonus;
        }
    }

    // ============================================================
    // SET RACE
    // ============================================================
    setRace(raceName) {
        if (!MERP.races[raceName]) return false;
        this.race = raceName;
        this.updateRaceBonuses();

        // Set default languages
        const raceData = MERP.races[raceName];
        this.languages = {};
        if (raceData.languages) {
            for (const lang of raceData.languages) {
                this.languages[lang] = 5; // Default rank 5
            }
        }

        // Apply adolescence skill ranks
        this.applyAdolescenceRanks();
        this.recalculate();
        return true;
    }

    // ============================================================
    // SET PROFESSION
    // ============================================================
    setProfession(profName) {
        if (!MERP.professions[profName]) return false;
        this.profession = profName;
        this.recalculate();
        return true;
    }

    // ============================================================
    // APPLY ADOLESCENCE SKILL RANKS
    // ============================================================
    applyAdolescenceRanks() {
        const ranks = MERP.adolescenceRanks[this.race];
        if (!ranks) return;

        // Initialize all skills with adolescence ranks
        this.skills = {};
        for (const [skillName, rank] of Object.entries(ranks)) {
            this.skills[skillName] = {
                adolRanks: rank,
                apprenticeRanks: 0,
                devRanks: 0,
                totalRanks: rank,
                rankBonus: MERP.skillRankBonus(rank),
                statBonus: 0,
                profBonus: 0,
                itemBonus: 0,
                specialBonus: 0,
                totalBonus: 0
            };
        }
    }

    // ============================================================
    // SPEND DEVELOPMENT POINTS ON A SKILL
    // ============================================================
    addSkillRank(skillName, categoryKey) {
        if (!this.skills[skillName]) {
            this.skills[skillName] = {
                adolRanks: 0, apprenticeRanks: 0, devRanks: 0,
                totalRanks: 0, rankBonus: -25,
                statBonus: 0, profBonus: 0, itemBonus: 0, specialBonus: 0, totalBonus: 0
            };
        }
        const skill = this.skills[skillName];
        const costs = MERP.devPointCosts[this.profession];
        if (!costs || !costs[categoryKey]) return { success: false, reason: "Invalid category" };

        // During level-up: enforce 2-rank-per-skill limit (M&M skills exempt)
        if (this.levelUpState) {
            const ranksThisLevel = this.levelUpState.ranksThisLevel[skillName] || 0;
            const isMovement = (categoryKey === 'movementArmor');
            if (!isMovement && ranksThisLevel >= 2) {
                return { success: false, reason: "Maximum 2 ranks per skill per level" };
            }
        }

        // Cost: during level-up, tiers reset per level (1st this level = cost[0], 2nd = cost[1])
        // During creation (no levelUpState): use total devRanks for cost tier
        let cost;
        if (this.levelUpState) {
            const ranksThisLevel = this.levelUpState.ranksThisLevel[skillName] || 0;
            cost = ranksThisLevel === 0 ? costs[categoryKey][0] : costs[categoryKey][1];
        } else {
            cost = skill.devRanks === 0 ? costs[categoryKey][0] : costs[categoryKey][1];
        }

        const remaining = this.developmentPoints.total - this.developmentPoints.spent;
        if (cost > remaining) return { success: false, reason: "Not enough development points" };

        skill.devRanks++;
        skill.totalRanks = skill.adolRanks + skill.apprenticeRanks + skill.devRanks;
        skill.rankBonus = MERP.skillRankBonus(skill.totalRanks);
        this.developmentPoints.spent += cost;

        // Track ranks for this level-up
        if (this.levelUpState) {
            this.levelUpState.ranksThisLevel[skillName] =
                (this.levelUpState.ranksThisLevel[skillName] || 0) + 1;
        }

        this.recalculate();
        return { success: true, cost };
    }

    // ============================================================
    // UNDO A SKILL RANK PURCHASE (level-up only)
    // ============================================================
    removeSkillRank(skillName, categoryKey) {
        if (!this.levelUpState) return { success: false, reason: "Not in level-up mode" };
        const ranksThisLevel = this.levelUpState.ranksThisLevel[skillName] || 0;
        if (ranksThisLevel <= 0) return { success: false, reason: "No ranks to remove" };

        const skill = this.skills[skillName];
        if (!skill || skill.devRanks <= 0) return { success: false, reason: "No dev ranks to remove" };

        const costs = MERP.devPointCosts[this.profession];
        if (!costs || !costs[categoryKey]) return { success: false, reason: "Invalid category" };

        // Refund: removing the Nth rank refunds its cost
        // If removing 2nd rank (ranksThisLevel=2): refund cost[1]
        // If removing 1st rank (ranksThisLevel=1): refund cost[0]
        const refundCost = ranksThisLevel <= 1 ? costs[categoryKey][0] : costs[categoryKey][1];

        skill.devRanks--;
        skill.totalRanks = skill.adolRanks + skill.apprenticeRanks + skill.devRanks;
        skill.rankBonus = MERP.skillRankBonus(skill.totalRanks);
        this.developmentPoints.spent -= refundCost;
        this.levelUpState.ranksThisLevel[skillName] = ranksThisLevel - 1;

        this.recalculate();
        return { success: true, refund: refundCost };
    }

    // ============================================================
    // RECALCULATE ALL DERIVED VALUES
    // ============================================================
    recalculate() {
        this.updateSkillBonuses();
        this.updateDefensiveBonus();
        this.updateResistanceBonuses();
        this.updatePowerPoints();
        this.updateDevelopmentPoints();
    }

    updateSkillBonuses() {
        const prof = MERP.professions[this.profession];
        if (!prof) return;

        for (const [catKey, catData] of Object.entries(MERP.skillCategories)) {
            const skills = catData.skills || [];
            for (const skillName of skills) {
                if (!this.skills[skillName]) continue;
                const skill = this.skills[skillName];

                // Determine stat bonus for this skill
                let statKey;
                if (catData.getStatForSkill) {
                    statKey = catData.getStatForSkill(skillName);
                } else {
                    statKey = catData.statBonus;
                }
                // Base Spell OB uses realm stat: IG for essence, IT for channeling
                if (skillName === "Base Spell OB" && !statKey && prof.spellUser) {
                    statKey = prof.spellUser === "essence" ? "IG" : "IT";
                }
                skill.statBonus = statKey ? (this.stats[statKey]?.totalBonus || 0) : 0;

                // Profession bonus per level
                if (catKey.startsWith("weapon")) {
                    skill.profBonus = (prof.bonusPerLevel.weaponOB || 0) * this.level;
                } else if (catKey === "bodyDev") {
                    skill.profBonus = 0; // Body dev bonus handled differently
                } else {
                    skill.profBonus = (prof.bonusPerLevel.nonWeaponOB || 0) * this.level;
                }

                // Total bonus
                skill.totalBonus = skill.rankBonus + skill.statBonus + skill.profBonus
                    + skill.itemBonus + skill.specialBonus;
            }
        }
    }

    updateDefensiveBonus() {
        // DB = AG stat bonus + armor penalty (quickness)
        const agBonus = this.stats.AG?.totalBonus || 0;
        const armorPen = MERP.armorPenalties[this.armor] || 0;
        const shieldBonus = this.shield ? 25 : 0;
        this.defensiveBonus = agBonus + shieldBonus;
        // Note: Armor affects MM, not DB directly in MERP
    }

    updateResistanceBonuses() {
        const race = MERP.races[this.race];
        if (!race) return;

        // Essence RR = IG bonus + race mod
        // Channeling RR = IT bonus + race mod
        // Poison RR = CO bonus + race mod
        // Disease RR = CO bonus + race mod
        this.resistanceBonuses = {
            essence: (this.stats.IG?.totalBonus || 0) + (race.rrMods?.essence || 0),
            channeling: (this.stats.IT?.totalBonus || 0) + (race.rrMods?.channeling || 0),
            poison: (this.stats.CO?.totalBonus || 0) + (race.rrMods?.poison || 0),
            disease: (this.stats.CO?.totalBonus || 0) + (race.rrMods?.disease || 0)
        };
    }

    updatePowerPoints() {
        const prof = MERP.professions[this.profession];
        if (!prof || !prof.spellUser) {
            this.powerPoints.max = 0;
            return;
        }

        // PP = sum of power points from relevant stat(s) + profession bonus per level
        let ppStat;
        if (prof.spellUser === "essence") ppStat = "IG";
        else if (prof.spellUser === "channeling") ppStat = "IT";
        else ppStat = "IG";

        const statPP = MERP.statBonusTable.lookup(this.stats[ppStat]?.value || 50).powerPoints;
        this.powerPoints.max = statPP + (prof.bonusPerLevel.powerPoints * this.level);
        if (this.powerPoints.current > this.powerPoints.max) {
            this.powerPoints.current = this.powerPoints.max;
        }
    }

    updateDevelopmentPoints() {
        if (!this.profession) return;
        const prof = MERP.professions[this.profession];
        if (!prof) return;
        const primeStatBonus = this.stats[prof.primeStat]?.totalBonus || 0;
        this.developmentPoints.total = MERP.developmentPointsPerLevel(this.profession, primeStatBonus);
    }

    // ============================================================
    // LEVEL UP
    // ============================================================
    canLevelUp() {
        const nextLevelXP = MERP.expForLevel(this.level + 1);
        return this.experiencePoints >= nextLevelXP;
    }

    beginLevelUp() {
        const previousDPSpent = this.developmentPoints.spent;
        this.level++;
        this.developmentPoints.spent = 0;
        this.updateDevelopmentPoints();

        // HP is NOT auto-rolled. Per MERP BT-4: each Body Development rank
        // purchased this level = 1d10 HP. Rolls happen at confirmLevelUp().
        this.levelUpState = {
            ranksThisLevel: {},
            spellListsAcquired: [],
            spellListDPPool: MERP.spellListDPPerLevel[this.profession] || 0,
            spellListDPSpent: 0,
            spellListAllocations: {},
            hpRoll: 0,
            hpGain: 0,
            hpRolls: [],            // Individual d10 rolls, one per BD rank
            previousDPSpent: previousDPSpent  // For cancel restoration
        };

        this.recalculate();
    }

    confirmLevelUp() {
        if (!this.levelUpState) return false;

        // Calculate HP from Body Development ranks purchased this level (MERP BT-4)
        // Each BD rank = roll 1d10 HP. 0 ranks = 0 HP gained.
        const bdRanksThisLevel = this.levelUpState.ranksThisLevel["Body Development"] || 0;
        const hpRolls = [];
        let hpGain = 0;
        for (let i = 0; i < bdRanksThisLevel; i++) {
            const roll = MERP.rollD10();
            hpRolls.push(roll);
            hpGain += roll;
        }
        this.levelUpState.hpRolls = hpRolls;
        this.levelUpState.hpGain = hpGain;
        this.levelUpState.hpRoll = hpGain; // backward compat

        // Apply HP gain
        this.hitPoints.max += hpGain;
        this.hitPoints.current = this.hitPoints.max;

        // Resolve spell list learning
        const rollResults = [];
        for (const [listName, dpThisLevel] of Object.entries(this.levelUpState.spellListAllocations)) {
            const result = this.rollSpellListLearning(listName);
            result.listName = listName;
            result.dpAllocated = dpThisLevel;
            rollResults.push(result);

            if (result.learned) {
                if (!this.spellLists.includes(listName)) {
                    this.spellLists.push(listName);
                }
                this.levelUpState.spellListsAcquired.push(listName);
                delete this.spellListProgress[listName];
            } else {
                // Carry over total DP (existing + this level)
                this.spellListProgress[listName] =
                    (this.spellListProgress[listName] || 0) + dpThisLevel;
            }
        }
        this.lastSpellListRollResults = rollResults;

        // Record level history before clearing transient state
        const historyEntry = {
            level: this.level,
            timestamp: new Date().toISOString(),
            hpRolls: hpRolls,
            bdRanks: bdRanksThisLevel,
            hpGain: hpGain,
            hpMaxAfter: this.hitPoints.max,
            skillRanks: { ...this.levelUpState.ranksThisLevel },
            dpSpent: this.developmentPoints.spent,
            dpTotal: this.developmentPoints.total,
            spellListResults: rollResults.map(r => ({
                listName: r.listName, learned: r.learned,
                roll: r.roll, needed: r.needed, auto: r.auto,
                dpAllocated: r.dpAllocated
            }))
        };
        if (!this.levelHistory) this.levelHistory = [];
        this.levelHistory.push(historyEntry);

        // Clear transient state
        this.levelUpState = null;
        this.recalculate();
        return true;
    }

    cancelLevelUp() {
        if (!this.levelUpState) return false;

        // Undo all rank purchases
        for (const [skillName, count] of Object.entries(this.levelUpState.ranksThisLevel)) {
            const skill = this.skills[skillName];
            if (skill) {
                skill.devRanks -= count;
                skill.totalRanks = skill.adolRanks + skill.apprenticeRanks + skill.devRanks;
                skill.rankBonus = MERP.skillRankBonus(skill.totalRanks);
            }
        }

        // Undo spell list acquisitions
        for (const listName of this.levelUpState.spellListsAcquired) {
            this.spellLists = this.spellLists.filter(l => l !== listName);
        }

        // Restore DP spent to pre-level-up value
        this.developmentPoints.spent = this.levelUpState.previousDPSpent || 0;

        // Revert level
        this.level--;
        this.levelUpState = null;
        this.recalculate();
        return true;
    }

    // ============================================================
    // SPELL LIST DP ALLOCATION (level-up only)
    // Spell list learning uses a separate DP pool (CGT-4)
    // Each DP gives 20% chance; 5 DP = 100% auto-learn
    // ============================================================
    allocateSpellListDP(listName) {
        if (!this.levelUpState) return { success: false, reason: "Not in level-up mode" };
        if (this.spellLists.includes(listName)) return { success: false, reason: "Already known" };

        const pool = this.levelUpState.spellListDPPool;
        const spent = this.levelUpState.spellListDPSpent;
        if (spent >= pool) return { success: false, reason: "No spell list DP remaining" };

        const allocs = this.levelUpState.spellListAllocations;
        allocs[listName] = (allocs[listName] || 0) + 1;
        this.levelUpState.spellListDPSpent++;

        const totalDP = this.getSpellListTotalDP(listName);
        return { success: true, allocated: allocs[listName], totalDP, chance: Math.min(100, totalDP * 20) };
    }

    deallocateSpellListDP(listName) {
        if (!this.levelUpState) return { success: false, reason: "Not in level-up mode" };

        const allocs = this.levelUpState.spellListAllocations;
        if (!allocs[listName] || allocs[listName] <= 0) {
            return { success: false, reason: "No DP allocated to this list this level" };
        }

        allocs[listName]--;
        if (allocs[listName] === 0) delete allocs[listName];
        this.levelUpState.spellListDPSpent--;

        return { success: true };
    }

    getSpellListTotalDP(listName) {
        const carryover = this.spellListProgress[listName] || 0;
        const thisLevel = (this.levelUpState && this.levelUpState.spellListAllocations[listName]) || 0;
        return carryover + thisLevel;
    }

    rollSpellListLearning(listName) {
        const totalDP = this.getSpellListTotalDP(listName);
        if (totalDP <= 0) return { learned: false, roll: null, needed: null };

        if (totalDP >= 5) {
            return { learned: true, roll: null, needed: 100, auto: true };
        }

        const needed = totalDP * 20;
        const roll = MERP.rollD100();
        return { learned: roll <= needed, roll, needed };
    }

    // ============================================================
    // GET WEAPON OB
    // ============================================================
    getWeaponOB(weaponName) {
        const weapon = MERP.weapons[weaponName];
        if (!weapon) return 0;

        // Find skill for this weapon category
        const catData = MERP.skillCategories[weapon.category];
        if (!catData) return 0;
        const skillName = catData.skills[0]; // Primary skill name
        const skill = this.skills[skillName];
        if (!skill) return 0;

        return skill.totalBonus;
    }

    // ============================================================
    // GET SPELL OB
    // ============================================================
    getSpellOB(attackTable) {
        // AT-7 (Directed Elemental/Bolt): uses Directed Spells skill
        if (attackTable === 'AT7') {
            const skill = this.skills["Directed Spells"];
            return skill ? skill.totalBonus : 0;
        }
        // AT-8 (Ball Elemental) and AT-9 (Base Spells/Force): uses Base Spell OB
        if (attackTable === 'AT8' || attackTable === 'AT9') {
            const skill = this.skills["Base Spell OB"];
            return skill ? skill.totalBonus : 0;
        }
        return 0;
    }

    // ============================================================
    // EXPORT/IMPORT
    // ============================================================
    toJSON() {
        return JSON.stringify({
            name: this.name, race: this.race, profession: this.profession,
            level: this.level, experiencePoints: this.experiencePoints,
            age: this.age, gender: this.gender, height: this.height, weight: this.weight,
            hair: this.hair, eyes: this.eyes, demeanor: this.demeanor,
            stats: this.stats, skills: this.skills,
            hitPoints: this.hitPoints, powerPoints: this.powerPoints,
            defensiveBonus: this.defensiveBonus,
            resistanceBonuses: this.resistanceBonuses,
            armor: this.armor, shield: this.shield,
            weapons: this.weapons, equipment: this.equipment, gold: this.gold,
            spellLists: this.spellLists, spellListProgress: this.spellListProgress,
            languages: this.languages,
            developmentPoints: this.developmentPoints,
            backgroundOptions: this.backgroundOptions,
            levelHistory: this.levelHistory,
            levelUpState: this.levelUpState
        });
    }

    static fromJSON(jsonStr) {
        const data = JSON.parse(jsonStr);
        const char = new MerpCharacter();
        Object.assign(char, data);
        char.levelUpState = data.levelUpState || null; // Preserve level-up state across saves
        if (!char.spellListProgress) char.spellListProgress = {}; // Backward compat
        if (!char.levelHistory) char.levelHistory = []; // Backward compat
        return char;
    }
}
