// MERP 2nd Edition - Game Data Module
// All tables encoded from ICE2000 Rulebook and ICE2004 Combat Screen

const MERP = {};

// ============================================================
// STAT BONUS TABLE (BT-1) - Maps stat value to bonus
// ============================================================
MERP.statBonus = function(val) {
    if (val >= 102) return 35;
    if (val >= 101) return 30;
    if (val === 100) return 25;
    if (val >= 98) return 20;
    if (val >= 96) return 15;
    if (val >= 94) return 12;
    if (val >= 91) return 10;
    if (val >= 86) return 7;
    if (val >= 81) return 5;
    if (val >= 76) return 5;
    if (val >= 71) return 5;
    if (val >= 66) return 5;
    if (val >= 61) return 0;
    if (val >= 56) return 0;
    if (val >= 51) return 0;
    if (val >= 46) return 0;
    if (val >= 41) return 0;
    if (val >= 36) return 0;
    if (val >= 31) return -5;
    if (val >= 26) return -5;
    if (val >= 21) return -5;
    if (val >= 16) return -10;
    if (val >= 11) return -10;
    if (val >= 6) return -15;
    if (val >= 4) return -20;
    if (val >= 2) return -25;
    return -25;
};

// More precise stat bonus from BT-1
MERP.statBonusTable = {
    // [min, max, bonus, powerPoints]
    ranges: [
        [102, 999, 35, 9], [101, 101, 30, 8], [100, 100, 25, 7],
        [98, 99, 20, 6], [96, 97, 15, 6], [94, 95, 12, 5],
        [91, 93, 10, 5], [86, 90, 7, 4], [81, 85, 5, 3],
        [76, 80, 5, 3], [71, 75, 5, 2], [66, 70, 5, 2],
        [61, 65, 0, 1], [56, 60, 0, 1], [51, 55, 0, 1],
        [46, 50, 0, 1], [41, 45, 0, 0], [36, 40, 0, 0],
        [31, 35, -5, 0], [26, 30, -5, 0], [21, 25, -5, 0],
        [16, 20, -10, 0], [11, 15, -10, 0], [6, 10, -15, 0],
        [4, 5, -20, 0], [2, 3, -25, 0], [1, 1, -25, 0]
    ],
    lookup: function(val) {
        for (const [min, max, bonus, pp] of this.ranges) {
            if (val >= min && val <= max) return { bonus, powerPoints: pp };
        }
        return { bonus: -25, powerPoints: 0 };
    }
};

// ============================================================
// SKILL RANK BONUS TABLE (BT-4)
// ============================================================
MERP.skillRankBonus = function(ranks) {
    if (ranks <= 0) return -25;
    if (ranks === 1) return 5;
    if (ranks === 2) return 10;
    if (ranks === 3) return 15;
    if (ranks === 4) return 20;
    if (ranks === 5) return 25;
    if (ranks === 6) return 30;
    if (ranks === 7) return 35;
    if (ranks === 8) return 40;
    if (ranks === 9) return 45;
    if (ranks === 10) return 50;
    // 11-20: +2 per rank above 10
    if (ranks <= 20) return 50 + (ranks - 10) * 2;
    // 21+: +1 per rank above 20
    return 70 + (ranks - 20);
};

// ============================================================
// STATS
// ============================================================
MERP.stats = ['ST', 'AG', 'CO', 'IG', 'IT', 'PR'];
MERP.statNames = {
    ST: 'Strength', AG: 'Agility', CO: 'Constitution',
    IG: 'Intelligence', IT: 'Intuition', PR: 'Presence'
};

// ============================================================
// RACES / CULTURES (BT-2, BT-3)
// ============================================================
MERP.races = {
    // Non-Mannish
    "Dwarf":        { type: "Non-Mannish", statMods: { ST: 2, AG: -2, CO: 5, IG: 0, IT: 0, PR: -5 }, rrMods: { essence: 5, channeling: 5, poison: 10, disease: 5 }, soulDeparture: 12, bgOptions: 5, adolRanks: "dwarf", languages: ["Khuzdul", "Westron"] },
    "Elf_Noldor":   { type: "Non-Mannish", statMods: { ST: 0, AG: 2, CO: 0, IG: 2, IT: 0, PR: 2 }, rrMods: { essence: 0, channeling: 0, poison: 10, disease: 10 }, soulDeparture: 18, bgOptions: 3, adolRanks: "noldor", label: "Noldor Elf", languages: ["Quenya", "Sindarin", "Westron"] },
    "Elf_Sinda":    { type: "Non-Mannish", statMods: { ST: 0, AG: 2, CO: 0, IG: 0, IT: 2, PR: 2 }, rrMods: { essence: 0, channeling: 0, poison: 10, disease: 10 }, soulDeparture: 18, bgOptions: 3, adolRanks: "sinda", label: "Sinda Elf", languages: ["Sindarin", "Westron"] },
    "Elf_Silvan":   { type: "Non-Mannish", statMods: { ST: 0, AG: 2, CO: 0, IG: 0, IT: 0, PR: 2 }, rrMods: { essence: 0, channeling: 0, poison: 5, disease: 5 }, soulDeparture: 15, bgOptions: 3, adolRanks: "silvan", label: "Silvan Elf", languages: ["Silvan", "Sindarin", "Westron"] },
    "Half-elf":     { type: "Non-Mannish", statMods: { ST: 0, AG: 0, CO: 0, IG: 0, IT: 2, PR: 0 }, rrMods: { essence: 0, channeling: 0, poison: 5, disease: 5 }, soulDeparture: 15, bgOptions: 4, adolRanks: "halfelf", languages: ["Sindarin", "Westron"] },
    "Hobbit":       { type: "Non-Mannish", statMods: { ST: -5, AG: 5, CO: 2, IG: 0, IT: 2, PR: 0 }, rrMods: { essence: 15, channeling: 15, poison: 10, disease: 5 }, soulDeparture: 12, bgOptions: 4, adolRanks: "hobbit", languages: ["Westron"] },
    "Umli":         { type: "Non-Mannish", statMods: { ST: 0, AG: 0, CO: 2, IG: 0, IT: 0, PR: -2 }, rrMods: { essence: 5, channeling: 5, poison: 5, disease: 5 }, soulDeparture: 12, bgOptions: 4, adolRanks: "umli", languages: ["Khuzdul", "Westron"] },
    // Mannish
    "Beorning":     { type: "Mannish", statMods: { ST: 2, AG: 0, CO: 2, IG: -2, IT: 0, PR: 0 }, rrMods: { essence: 0, channeling: 0, poison: 0, disease: 0 }, soulDeparture: 10, bgOptions: 5, adolRanks: "beorning", languages: ["Beorning", "Westron"] },
    "Black_Numenorean": { type: "Mannish", statMods: { ST: 0, AG: 0, CO: 0, IG: 2, IT: -2, PR: 2 }, rrMods: { essence: 0, channeling: 0, poison: 0, disease: 0 }, soulDeparture: 12, bgOptions: 4, adolRanks: "blacknumenorean", label: "Black Numenorean", languages: ["Adunaic", "Westron", "Black Speech"] },
    "Corsair":      { type: "Mannish", statMods: { ST: 0, AG: 2, CO: 0, IG: 0, IT: 0, PR: 0 }, rrMods: { essence: 0, channeling: 0, poison: 0, disease: 0 }, soulDeparture: 10, bgOptions: 5, adolRanks: "corsair", languages: ["Haradaic", "Westron", "Adunaic"] },
    "Dorwinrim":    { type: "Mannish", statMods: { ST: 0, AG: 0, CO: 0, IG: 0, IT: 0, PR: 2 }, rrMods: { essence: 0, channeling: 0, poison: 0, disease: 0 }, soulDeparture: 10, bgOptions: 5, adolRanks: "dorwinrim", languages: ["Dorwinrim", "Westron"] },
    "Dunadan":      { type: "Mannish", statMods: { ST: 0, AG: 0, CO: 2, IG: 0, IT: 2, PR: 0 }, rrMods: { essence: 0, channeling: 0, poison: 0, disease: 5 }, soulDeparture: 12, bgOptions: 4, adolRanks: "dunadan", label: "Dunadan", languages: ["Westron", "Sindarin"] },
    "Dunlending":   { type: "Mannish", statMods: { ST: 0, AG: 0, CO: 2, IG: 0, IT: 0, PR: 0 }, rrMods: { essence: 0, channeling: 0, poison: 0, disease: 0 }, soulDeparture: 10, bgOptions: 5, adolRanks: "dunlending", languages: ["Dunael", "Westron"] },
    "Easterling":   { type: "Mannish", statMods: { ST: 2, AG: 0, CO: 0, IG: 0, IT: 0, PR: 0 }, rrMods: { essence: 0, channeling: 0, poison: 0, disease: 0 }, soulDeparture: 10, bgOptions: 5, adolRanks: "easterling", languages: ["Easterling", "Westron"] },
    "Haradrim":     { type: "Mannish", statMods: { ST: 0, AG: 2, CO: 0, IG: 0, IT: 0, PR: 0 }, rrMods: { essence: 0, channeling: 0, poison: 0, disease: 0 }, soulDeparture: 10, bgOptions: 5, adolRanks: "haradrim", languages: ["Haradaic", "Westron"] },
    "Lossoth":      { type: "Mannish", statMods: { ST: 0, AG: 0, CO: 2, IG: 0, IT: 2, PR: -2 }, rrMods: { essence: 0, channeling: 0, poison: 0, disease: 0 }, soulDeparture: 10, bgOptions: 5, adolRanks: "lossoth", languages: ["Lossoth", "Westron"] },
    "Rohirrim":     { type: "Mannish", statMods: { ST: 2, AG: 0, CO: 0, IG: -2, IT: 0, PR: 2 }, rrMods: { essence: 0, channeling: 0, poison: 0, disease: 0 }, soulDeparture: 10, bgOptions: 5, adolRanks: "rohirrim", languages: ["Rohirric", "Westron"] },
    "Rural_Man":    { type: "Mannish", statMods: { ST: 0, AG: 0, CO: 0, IG: 0, IT: 0, PR: 0 }, rrMods: { essence: 0, channeling: 0, poison: 0, disease: 0 }, soulDeparture: 10, bgOptions: 6, adolRanks: "ruralman", label: "Rural Man", languages: ["Westron"] },
    "Urban_Man":    { type: "Mannish", statMods: { ST: 0, AG: 0, CO: 0, IG: 0, IT: 0, PR: 0 }, rrMods: { essence: 0, channeling: 0, poison: 0, disease: 0 }, soulDeparture: 10, bgOptions: 6, adolRanks: "urbanman", label: "Urban Man", languages: ["Westron"] },
    "Variag":       { type: "Mannish", statMods: { ST: 2, AG: 0, CO: 0, IG: 0, IT: -2, PR: 2 }, rrMods: { essence: 0, channeling: 0, poison: 0, disease: 0 }, soulDeparture: 10, bgOptions: 5, adolRanks: "variag", languages: ["Variag", "Westron"] },
    "Woodman":      { type: "Mannish", statMods: { ST: 0, AG: 0, CO: 2, IG: 0, IT: 0, PR: 0 }, rrMods: { essence: 0, channeling: 0, poison: 0, disease: 0 }, soulDeparture: 10, bgOptions: 5, adolRanks: "woodman", languages: ["Woodman", "Westron"] },
    "Wose":         { type: "Non-Mannish", statMods: { ST: 2, AG: 0, CO: 2, IG: -5, IT: 5, PR: -2 }, rrMods: { essence: 0, channeling: 5, poison: 5, disease: 5 }, soulDeparture: 10, bgOptions: 4, adolRanks: "wose", languages: ["Wose"] }
};

// ============================================================
// PROFESSIONS (BT-6)
// ============================================================
MERP.professions = {
    "Warrior":  { primeStat: "ST", spellUser: false, bonusPerLevel: { weaponOB: 5, nonWeaponOB: 2, bodyDev: 6, powerPoints: 0 } },
    "Scout":    { primeStat: "AG", spellUser: false, bonusPerLevel: { weaponOB: 3, nonWeaponOB: 3, bodyDev: 3, powerPoints: 0 } },
    "Mage":     { primeStat: "IG", spellUser: "essence", bonusPerLevel: { weaponOB: 1, nonWeaponOB: 2, bodyDev: 1, powerPoints: 4 } },
    "Animist":  { primeStat: "IT", spellUser: "channeling", bonusPerLevel: { weaponOB: 1, nonWeaponOB: 2, bodyDev: 2, powerPoints: 4 } },
    "Ranger":   { primeStat: "CO", spellUser: "channeling", bonusPerLevel: { weaponOB: 3, nonWeaponOB: 3, bodyDev: 3, powerPoints: 2 } },
    "Bard":     { primeStat: "PR", spellUser: "essence", bonusPerLevel: { weaponOB: 2, nonWeaponOB: 3, bodyDev: 2, powerPoints: 2 } }
};

// ============================================================
// DEVELOPMENT POINTS PER PROFESSION (CGT-4)
// Cost format: [first rank cost, additional rank cost]
// ============================================================
MERP.devPointCosts = {
    "Warrior": {
        movementArmor: [1, 2], weaponEdged: [1, 2], weaponConcussion: [2, 3],
        weapon2H: [2, 3], weaponThrown: [2, 3], weaponMissile: [2, 3],
        weaponPolearm: [2, 3], generalSkills: [1, 3], subterfuge: [3, 7],
        magical: [6, 6], perception: [2, 5], bodyDev: [2, 5]
    },
    "Scout": {
        movementArmor: [1, 3], weaponEdged: [2, 3], weaponConcussion: [3, 5],
        weapon2H: [4, 7], weaponThrown: [2, 3], weaponMissile: [2, 3],
        weaponPolearm: [4, 7], generalSkills: [1, 2], subterfuge: [1, 3],
        magical: [4, 8], perception: [1, 3], bodyDev: [3, 7]
    },
    "Mage": {
        movementArmor: [4, 8], weaponEdged: [4, 6], weaponConcussion: [4, 6],
        weapon2H: [6, 12], weaponThrown: [4, 6], weaponMissile: [5, 10],
        weaponPolearm: [6, 12], generalSkills: [2, 5], subterfuge: [3, 7],
        magical: [1, 2], perception: [2, 3], bodyDev: [5, 15]
    },
    "Animist": {
        movementArmor: [3, 6], weaponEdged: [4, 6], weaponConcussion: [3, 5],
        weapon2H: [5, 10], weaponThrown: [4, 6], weaponMissile: [5, 10],
        weaponPolearm: [5, 10], generalSkills: [1, 3], subterfuge: [3, 7],
        magical: [1, 3], perception: [1, 3], bodyDev: [4, 10]
    },
    "Ranger": {
        movementArmor: [1, 3], weaponEdged: [2, 3], weaponConcussion: [2, 4],
        weapon2H: [3, 5], weaponThrown: [2, 3], weaponMissile: [2, 4],
        weaponPolearm: [3, 5], generalSkills: [1, 2], subterfuge: [2, 5],
        magical: [3, 5], perception: [1, 3], bodyDev: [3, 7]
    },
    "Bard": {
        movementArmor: [2, 5], weaponEdged: [3, 5], weaponConcussion: [3, 5],
        weapon2H: [5, 10], weaponThrown: [3, 5], weaponMissile: [3, 5],
        weaponPolearm: [5, 10], generalSkills: [1, 2], subterfuge: [2, 5],
        magical: [2, 4], perception: [1, 2], bodyDev: [4, 10]
    }
};

// ============================================================
// SPELL LIST DEVELOPMENT POINTS PER LEVEL (CGT-4 "Spell Lists" row)
// These are SEPARATE from normal development points
// Each DP allocated to a spell list gives 20% chance of learning
// 5 DP = 100% = auto-learn
// ============================================================
MERP.spellListDPPerLevel = {
    "Warrior": 0, "Scout": 0, "Mage": 5,
    "Animist": 5, "Ranger": 1, "Bard": 2
};

// ============================================================
// SKILL CATEGORIES & INDIVIDUAL SKILLS
// ============================================================
MERP.skillCategories = {
    movementArmor: {
        label: "Movement & Maneuver",
        skills: ["No Armor", "Soft Leather", "Rigid Leather", "Chain", "Plate"],
        statBonus: "AG", // No Armor, Soft, Rigid use AG; Chain, Plate use ST
        getStatForSkill: function(skill) {
            return (skill === "Chain" || skill === "Plate") ? "ST" : "AG";
        }
    },
    weaponEdged: { label: "1-H Edged", skills: ["1-H Edged"], statBonus: "ST" },
    weaponConcussion: { label: "1-H Concussion", skills: ["1-H Concussion"], statBonus: "ST" },
    weapon2H: { label: "2-Handed", skills: ["2-Handed"], statBonus: "ST" },
    weaponThrown: { label: "Thrown", skills: ["Thrown"], statBonus: "AG" },
    weaponMissile: { label: "Missile", skills: ["Missile"], statBonus: "AG" },
    weaponPolearm: { label: "Pole Arms", skills: ["Pole Arms"], statBonus: "ST" },
    generalSkills: {
        label: "General",
        skills: ["Climb", "Ride", "Swim", "Track"],
        getStatForSkill: function(skill) {
            const map = { Climb: "AG", Ride: "IT", Swim: "AG", Track: "IG" };
            return map[skill] || "AG";
        }
    },
    subterfuge: {
        label: "Subterfuge",
        skills: ["Ambush", "Stalk/Hide", "Pick Lock", "Disarm Trap"],
        getStatForSkill: function(skill) {
            const map = { Ambush: null, "Stalk/Hide": "PR", "Pick Lock": "IG", "Disarm Trap": "IT" };
            return map[skill];
        }
    },
    magical: {
        label: "Magical",
        skills: ["Read Rune", "Use Item", "Directed Spells", "Base Spell OB"],
        getStatForSkill: function(skill) {
            // Base Spell OB stat depends on realm (handled dynamically in MerpCharacter.updateSkillBonuses)
            const map = { "Read Rune": "IG", "Use Item": "IT", "Directed Spells": "AG", "Base Spell OB": null };
            return map[skill];
        }
    },
    perception: { label: "Perception", skills: ["Perception"], statBonus: "IT" },
    bodyDev: { label: "Body Development", skills: ["Body Development"], statBonus: "CO" }
};

// ============================================================
// WEAPONS STATISTICS TABLE (CST-1)
// ============================================================
MERP.weapons = {
    // 1-Handed Edged
    "Broadsword":    { category: "weaponEdged", fumble: [1,3], primaryCrit: "Slash", secondaryCrit: null, baseRange: null, weight: 4, attackTable: "AT1", special: "" },
    "Dagger":        { category: "weaponEdged", fumble: [1,1], primaryCrit: "Puncture", secondaryCrit: "Crush", baseRange: 15, weight: 1, attackTable: "AT1", special: "-15 OB" },
    "Handaxe":       { category: "weaponEdged", fumble: [1,4], primaryCrit: "Slash", secondaryCrit: null, baseRange: 15, weight: 5, attackTable: "AT1", special: "+5 OB vs chain/plate" },
    "Scimitar":      { category: "weaponEdged", fumble: [1,4], primaryCrit: "Slash", secondaryCrit: null, baseRange: null, weight: 4, attackTable: "AT1", special: "-5 OB chain/plate, +5 OB other" },
    "Short Sword":   { category: "weaponEdged", fumble: [1,2], primaryCrit: "Slash", secondaryCrit: null, baseRange: 3, weight: 3, attackTable: "AT1", special: "-10 OB chain/plate, +10 OB other" },
    // 1-Handed Concussion
    "Club":          { category: "weaponConcussion", fumble: [1,4], primaryCrit: "Crush", secondaryCrit: "Slash", baseRange: 2, weight: 5, attackTable: "AT2", special: "-10 OB" },
    "Mace":          { category: "weaponConcussion", fumble: [1,2], primaryCrit: "Crush", secondaryCrit: null, baseRange: 5, weight: 5, attackTable: "AT2", special: "" },
    "Morning Star":  { category: "weaponConcussion", fumble: [1,8], primaryCrit: "Crush", secondaryCrit: "Puncture", baseRange: null, weight: 5, attackTable: "AT2", special: "+10 OB, B crit if fumbled" },
    "Net":           { category: "weaponConcussion", fumble: [1,6], primaryCrit: "Grapple", secondaryCrit: null, baseRange: 10, weight: 3, attackTable: "AT6", special: "+15 OB if fumbled, -10 OB chain/plate" },
    "War Hammer":    { category: "weaponConcussion", fumble: [1,4], primaryCrit: "Crush", secondaryCrit: null, baseRange: 10, weight: 5, attackTable: "AT2", special: "+5 OB" },
    "Whip":          { category: "weaponConcussion", fumble: [1,6], primaryCrit: "Grapple", secondaryCrit: "Slash", baseRange: null, weight: 3, attackTable: "AT6", special: "-10 OB, can use from 2nd line" },
    // 1-Handed Pole Arms
    "Javelin":       { category: "weaponPolearm", fumble: [1,4], primaryCrit: "Puncture", secondaryCrit: null, baseRange: 30, weight: 4, attackTable: "AT3", special: "-10 OB, can use from 2nd line" },
    "Spear":         { category: "weaponPolearm", fumble: [1,5], primaryCrit: "Puncture", secondaryCrit: "Slash", baseRange: 20, weight: 5, attackTable: "AT3", special: "-5 OB, can use from 2nd line" },
    // 2-Handed Pole Arms
    "Mounted Lance": { category: "weaponPolearm", fumble: [1,7], primaryCrit: "Puncture", secondaryCrit: "Unbalance", baseRange: null, weight: 10, attackTable: "AT3", special: "+15 OB, B crit if fumbled" },
    "Halberd":       { category: "weaponPolearm", fumble: [1,7], primaryCrit: "Slash", secondaryCrit: "Puncture", baseRange: null, weight: 7, attackTable: "AT3", special: "-5 OB, can use from 2nd line" },
    // 2-Handed Weapons
    "Battle-axe":    { category: "weapon2H", fumble: [1,5], primaryCrit: "Slash", secondaryCrit: "Crush", baseRange: null, weight: 7, attackTable: "AT3", special: "+5 OB chain/plate, -5 other" },
    "Flail":         { category: "weapon2H", fumble: [1,8], primaryCrit: "Crush", secondaryCrit: "Puncture", baseRange: null, weight: 6, attackTable: "AT3", special: "+10 OB, C crit if fumbled" },
    "Quarterstaff":  { category: "weapon2H", fumble: [1,3], primaryCrit: "Crush", secondaryCrit: null, baseRange: null, weight: 4, attackTable: "AT3", special: "-10 OB" },
    "2-Handed Sword":{ category: "weapon2H", fumble: [1,5], primaryCrit: "Slash", secondaryCrit: "Crush", baseRange: null, weight: 8, attackTable: "AT3", special: "" },
    // Missile Weapons
    "Bola":          { category: "weaponMissile", fumble: [1,7], primaryCrit: "Grapple", secondaryCrit: "Crush", baseRange: null, weight: 3, attackTable: "AT4", special: "-5 OB, B crit if fumbled" },
    "Composite Bow": { category: "weaponMissile", fumble: [1,4], primaryCrit: "Puncture", secondaryCrit: null, baseRange: 75, weight: 3, attackTable: "AT4", special: "Load(1), or Reload(0) at -25 to OB" },
    "Crossbow":      { category: "weaponMissile", fumble: [1,5], primaryCrit: "Puncture", secondaryCrit: null, baseRange: 90, weight: 8, attackTable: "AT4", special: "Load(2), +20 OB at up to 50'" },
    "Long Bow":      { category: "weaponMissile", fumble: [1,5], primaryCrit: "Puncture", secondaryCrit: null, baseRange: 100, weight: 3, attackTable: "AT4", special: "Load(1), or Reload(0) at -35 to OB" },
    "Short Bow":     { category: "weaponMissile", fumble: [1,4], primaryCrit: "Puncture", secondaryCrit: null, baseRange: 60, weight: 2, attackTable: "AT4", special: "Load(1), or Reload(0) at -10 to OB" },
    "Sling":         { category: "weaponMissile", fumble: [1,6], primaryCrit: "Crush", secondaryCrit: "Grapple", baseRange: 50, weight: 0.5, attackTable: "AT4", special: "Load(1), can use with a shield" }
};

// ============================================================
// EXPERIENCE TABLE (ET-5)
// ============================================================
MERP.experienceTable = {
    1: 10000, 2: 20000, 3: 30000, 4: 40000, 5: 50000,
    6: 70000, 7: 90000, 8: 110000, 9: 130000, 10: 150000
    // Each level above 10 requires an additional 30000
};

MERP.expForLevel = function(level) {
    if (level <= 0) return 0;
    if (level <= 10) return this.experienceTable[level];
    return 150000 + (level - 10) * 30000;
};

// ============================================================
// ARMOR TYPE PENALTIES (for Movement & Maneuver)
// ============================================================
MERP.armorPenalties = {
    "No Armor": 0,
    "Soft Leather": -15,
    "Rigid Leather": -30,
    "Chain": -45,
    "Plate": -60
};

// ============================================================
// ARMOR TYPES for attack table columns
// ============================================================
MERP.armorTypes = ["Plate", "Chain", "Rigid Leather", "Soft Leather", "No Armor"];
MERP.armorCols = { "Plate": 0, "Chain": 1, "Rigid Leather": 2, "Soft Leather": 3, "No Armor": 4 };
