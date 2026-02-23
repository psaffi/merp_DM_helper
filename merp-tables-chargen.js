// MERP 2nd Edition - Character Generation Tables
// Adolescence Skill Ranks (CGT-5) and Background Options

// ============================================================
// ADOLESCENCE SKILL RANKS BY RACE (CGT-5)
// Format: { skillCategory: ranks, ... }
// ============================================================
MERP.adolescenceRanks = {
    "Dwarf": {
        "No Armor": 1, "Soft Leather": 1, "Rigid Leather": 1, "Chain": 1, "Plate": 0,
        "1-H Edged": 1, "1-H Concussion": 2, "2-Handed": 1, "Thrown": 1, "Missile": 0, "Pole Arms": 1,
        "Climb": 3, "Ride": 0, "Swim": 0, "Track": 1,
        "Ambush": 0, "Stalk/Hide": 1, "Pick Lock": 1, "Disarm Trap": 2,
        "Read Rune": 0, "Use Item": 0, "Directed Spells": 0, "Base Spell OB": 0,
        "Perception": 2, "Body Development": 0
    },
    "Elf_Noldor": {
        "No Armor": 2, "Soft Leather": 2, "Rigid Leather": 1, "Chain": 1, "Plate": 0,
        "1-H Edged": 3, "1-H Concussion": 0, "2-Handed": 1, "Thrown": 1, "Missile": 2, "Pole Arms": 1,
        "Climb": 1, "Ride": 2, "Swim": 1, "Track": 1,
        "Ambush": 0, "Stalk/Hide": 2, "Pick Lock": 0, "Disarm Trap": 0,
        "Read Rune": 2, "Use Item": 1, "Directed Spells": 1, "Base Spell OB": 0,
        "Perception": 3, "Body Development": 0
    },
    "Elf_Sinda": {
        "No Armor": 2, "Soft Leather": 2, "Rigid Leather": 1, "Chain": 0, "Plate": 0,
        "1-H Edged": 2, "1-H Concussion": 0, "2-Handed": 0, "Thrown": 1, "Missile": 2, "Pole Arms": 1,
        "Climb": 2, "Ride": 1, "Swim": 2, "Track": 2,
        "Ambush": 1, "Stalk/Hide": 3, "Pick Lock": 0, "Disarm Trap": 0,
        "Read Rune": 1, "Use Item": 1, "Directed Spells": 0, "Base Spell OB": 0,
        "Perception": 3, "Body Development": 0
    },
    "Elf_Silvan": {
        "No Armor": 2, "Soft Leather": 2, "Rigid Leather": 0, "Chain": 0, "Plate": 0,
        "1-H Edged": 1, "1-H Concussion": 0, "2-Handed": 0, "Thrown": 1, "Missile": 3, "Pole Arms": 1,
        "Climb": 3, "Ride": 0, "Swim": 2, "Track": 2,
        "Ambush": 1, "Stalk/Hide": 3, "Pick Lock": 0, "Disarm Trap": 0,
        "Read Rune": 0, "Use Item": 1, "Directed Spells": 0, "Base Spell OB": 0,
        "Perception": 3, "Body Development": 0
    },
    "Half-elf": {
        "No Armor": 2, "Soft Leather": 1, "Rigid Leather": 1, "Chain": 0, "Plate": 0,
        "1-H Edged": 2, "1-H Concussion": 0, "2-Handed": 0, "Thrown": 1, "Missile": 1, "Pole Arms": 0,
        "Climb": 2, "Ride": 1, "Swim": 2, "Track": 1,
        "Ambush": 0, "Stalk/Hide": 2, "Pick Lock": 0, "Disarm Trap": 0,
        "Read Rune": 1, "Use Item": 1, "Directed Spells": 0, "Base Spell OB": 0,
        "Perception": 2, "Body Development": 0
    },
    "Hobbit": {
        "No Armor": 3, "Soft Leather": 2, "Rigid Leather": 0, "Chain": 0, "Plate": 0,
        "1-H Edged": 1, "1-H Concussion": 0, "2-Handed": 0, "Thrown": 3, "Missile": 2, "Pole Arms": 0,
        "Climb": 2, "Ride": 0, "Swim": 1, "Track": 0,
        "Ambush": 0, "Stalk/Hide": 4, "Pick Lock": 1, "Disarm Trap": 0,
        "Read Rune": 0, "Use Item": 0, "Directed Spells": 0, "Base Spell OB": 0,
        "Perception": 3, "Body Development": 0
    },
    "Umli": {
        "No Armor": 1, "Soft Leather": 1, "Rigid Leather": 1, "Chain": 0, "Plate": 0,
        "1-H Edged": 1, "1-H Concussion": 1, "2-Handed": 0, "Thrown": 1, "Missile": 0, "Pole Arms": 1,
        "Climb": 2, "Ride": 0, "Swim": 0, "Track": 1,
        "Ambush": 0, "Stalk/Hide": 1, "Pick Lock": 1, "Disarm Trap": 1,
        "Read Rune": 0, "Use Item": 0, "Directed Spells": 0, "Base Spell OB": 0,
        "Perception": 2, "Body Development": 0
    },
    "Beorning": {
        "No Armor": 2, "Soft Leather": 1, "Rigid Leather": 0, "Chain": 0, "Plate": 0,
        "1-H Edged": 1, "1-H Concussion": 1, "2-Handed": 2, "Thrown": 1, "Missile": 1, "Pole Arms": 0,
        "Climb": 2, "Ride": 1, "Swim": 2, "Track": 2,
        "Ambush": 0, "Stalk/Hide": 2, "Pick Lock": 0, "Disarm Trap": 0,
        "Read Rune": 0, "Use Item": 0, "Directed Spells": 0, "Base Spell OB": 0,
        "Perception": 2, "Body Development": 0
    },
    "Black_Numenorean": {
        "No Armor": 1, "Soft Leather": 1, "Rigid Leather": 1, "Chain": 1, "Plate": 0,
        "1-H Edged": 2, "1-H Concussion": 1, "2-Handed": 1, "Thrown": 1, "Missile": 1, "Pole Arms": 1,
        "Climb": 1, "Ride": 2, "Swim": 1, "Track": 0,
        "Ambush": 0, "Stalk/Hide": 1, "Pick Lock": 0, "Disarm Trap": 0,
        "Read Rune": 1, "Use Item": 1, "Directed Spells": 0, "Base Spell OB": 0,
        "Perception": 2, "Body Development": 0
    },
    "Corsair": {
        "No Armor": 2, "Soft Leather": 1, "Rigid Leather": 0, "Chain": 0, "Plate": 0,
        "1-H Edged": 2, "1-H Concussion": 0, "2-Handed": 0, "Thrown": 1, "Missile": 1, "Pole Arms": 0,
        "Climb": 3, "Ride": 0, "Swim": 3, "Track": 0,
        "Ambush": 1, "Stalk/Hide": 2, "Pick Lock": 1, "Disarm Trap": 0,
        "Read Rune": 0, "Use Item": 0, "Directed Spells": 0, "Base Spell OB": 0,
        "Perception": 2, "Body Development": 0
    },
    "Dorwinrim": {
        "No Armor": 1, "Soft Leather": 1, "Rigid Leather": 0, "Chain": 0, "Plate": 0,
        "1-H Edged": 1, "1-H Concussion": 0, "2-Handed": 0, "Thrown": 1, "Missile": 1, "Pole Arms": 0,
        "Climb": 1, "Ride": 2, "Swim": 1, "Track": 1,
        "Ambush": 0, "Stalk/Hide": 1, "Pick Lock": 0, "Disarm Trap": 0,
        "Read Rune": 0, "Use Item": 0, "Directed Spells": 0, "Base Spell OB": 0,
        "Perception": 2, "Body Development": 0
    },
    "Dunadan": {
        "No Armor": 1, "Soft Leather": 1, "Rigid Leather": 1, "Chain": 1, "Plate": 0,
        "1-H Edged": 2, "1-H Concussion": 0, "2-Handed": 1, "Thrown": 1, "Missile": 1, "Pole Arms": 1,
        "Climb": 1, "Ride": 2, "Swim": 1, "Track": 1,
        "Ambush": 0, "Stalk/Hide": 1, "Pick Lock": 0, "Disarm Trap": 0,
        "Read Rune": 1, "Use Item": 1, "Directed Spells": 0, "Base Spell OB": 0,
        "Perception": 2, "Body Development": 0
    },
    "Dunlending": {
        "No Armor": 2, "Soft Leather": 1, "Rigid Leather": 0, "Chain": 0, "Plate": 0,
        "1-H Edged": 1, "1-H Concussion": 1, "2-Handed": 1, "Thrown": 1, "Missile": 1, "Pole Arms": 1,
        "Climb": 2, "Ride": 1, "Swim": 1, "Track": 1,
        "Ambush": 0, "Stalk/Hide": 1, "Pick Lock": 0, "Disarm Trap": 0,
        "Read Rune": 0, "Use Item": 0, "Directed Spells": 0, "Base Spell OB": 0,
        "Perception": 1, "Body Development": 0
    },
    "Easterling": {
        "No Armor": 1, "Soft Leather": 1, "Rigid Leather": 1, "Chain": 0, "Plate": 0,
        "1-H Edged": 2, "1-H Concussion": 1, "2-Handed": 0, "Thrown": 1, "Missile": 1, "Pole Arms": 1,
        "Climb": 1, "Ride": 2, "Swim": 0, "Track": 1,
        "Ambush": 0, "Stalk/Hide": 1, "Pick Lock": 0, "Disarm Trap": 0,
        "Read Rune": 0, "Use Item": 0, "Directed Spells": 0, "Base Spell OB": 0,
        "Perception": 2, "Body Development": 0
    },
    "Haradrim": {
        "No Armor": 2, "Soft Leather": 1, "Rigid Leather": 0, "Chain": 0, "Plate": 0,
        "1-H Edged": 2, "1-H Concussion": 0, "2-Handed": 0, "Thrown": 1, "Missile": 2, "Pole Arms": 0,
        "Climb": 1, "Ride": 2, "Swim": 1, "Track": 1,
        "Ambush": 1, "Stalk/Hide": 1, "Pick Lock": 0, "Disarm Trap": 0,
        "Read Rune": 0, "Use Item": 0, "Directed Spells": 0, "Base Spell OB": 0,
        "Perception": 2, "Body Development": 0
    },
    "Lossoth": {
        "No Armor": 2, "Soft Leather": 2, "Rigid Leather": 0, "Chain": 0, "Plate": 0,
        "1-H Edged": 0, "1-H Concussion": 1, "2-Handed": 0, "Thrown": 2, "Missile": 1, "Pole Arms": 1,
        "Climb": 2, "Ride": 0, "Swim": 2, "Track": 3,
        "Ambush": 0, "Stalk/Hide": 2, "Pick Lock": 0, "Disarm Trap": 0,
        "Read Rune": 0, "Use Item": 0, "Directed Spells": 0, "Base Spell OB": 0,
        "Perception": 2, "Body Development": 0
    },
    "Rohirrim": {
        "No Armor": 1, "Soft Leather": 1, "Rigid Leather": 1, "Chain": 0, "Plate": 0,
        "1-H Edged": 2, "1-H Concussion": 0, "2-Handed": 1, "Thrown": 1, "Missile": 1, "Pole Arms": 1,
        "Climb": 0, "Ride": 3, "Swim": 1, "Track": 1,
        "Ambush": 0, "Stalk/Hide": 1, "Pick Lock": 0, "Disarm Trap": 0,
        "Read Rune": 0, "Use Item": 0, "Directed Spells": 0, "Base Spell OB": 0,
        "Perception": 2, "Body Development": 0
    },
    "Rural_Man": {
        "No Armor": 2, "Soft Leather": 1, "Rigid Leather": 0, "Chain": 0, "Plate": 0,
        "1-H Edged": 1, "1-H Concussion": 1, "2-Handed": 0, "Thrown": 1, "Missile": 1, "Pole Arms": 0,
        "Climb": 2, "Ride": 1, "Swim": 2, "Track": 1,
        "Ambush": 0, "Stalk/Hide": 1, "Pick Lock": 0, "Disarm Trap": 0,
        "Read Rune": 0, "Use Item": 0, "Directed Spells": 0, "Base Spell OB": 0,
        "Perception": 2, "Body Development": 0
    },
    "Urban_Man": {
        "No Armor": 1, "Soft Leather": 1, "Rigid Leather": 0, "Chain": 0, "Plate": 0,
        "1-H Edged": 1, "1-H Concussion": 0, "2-Handed": 0, "Thrown": 1, "Missile": 0, "Pole Arms": 0,
        "Climb": 1, "Ride": 1, "Swim": 1, "Track": 0,
        "Ambush": 0, "Stalk/Hide": 1, "Pick Lock": 1, "Disarm Trap": 0,
        "Read Rune": 1, "Use Item": 0, "Directed Spells": 0, "Base Spell OB": 0,
        "Perception": 2, "Body Development": 0
    },
    "Variag": {
        "No Armor": 1, "Soft Leather": 1, "Rigid Leather": 1, "Chain": 0, "Plate": 0,
        "1-H Edged": 2, "1-H Concussion": 1, "2-Handed": 0, "Thrown": 1, "Missile": 1, "Pole Arms": 0,
        "Climb": 1, "Ride": 2, "Swim": 0, "Track": 1,
        "Ambush": 1, "Stalk/Hide": 1, "Pick Lock": 0, "Disarm Trap": 0,
        "Read Rune": 0, "Use Item": 0, "Directed Spells": 0, "Base Spell OB": 0,
        "Perception": 2, "Body Development": 0
    },
    "Woodman": {
        "No Armor": 2, "Soft Leather": 1, "Rigid Leather": 0, "Chain": 0, "Plate": 0,
        "1-H Edged": 1, "1-H Concussion": 0, "2-Handed": 1, "Thrown": 1, "Missile": 2, "Pole Arms": 0,
        "Climb": 2, "Ride": 0, "Swim": 1, "Track": 2,
        "Ambush": 0, "Stalk/Hide": 2, "Pick Lock": 0, "Disarm Trap": 0,
        "Read Rune": 0, "Use Item": 0, "Directed Spells": 0, "Base Spell OB": 0,
        "Perception": 2, "Body Development": 0
    },
    "Wose": {
        "No Armor": 3, "Soft Leather": 1, "Rigid Leather": 0, "Chain": 0, "Plate": 0,
        "1-H Edged": 0, "1-H Concussion": 2, "2-Handed": 0, "Thrown": 2, "Missile": 1, "Pole Arms": 0,
        "Climb": 3, "Ride": 0, "Swim": 1, "Track": 3,
        "Ambush": 1, "Stalk/Hide": 3, "Pick Lock": 0, "Disarm Trap": 0,
        "Read Rune": 0, "Use Item": 0, "Directed Spells": 0, "Base Spell OB": 0,
        "Perception": 3, "Body Development": 0
    }
};

// ============================================================
// BACKGROUND OPTIONS (Section 23)
// Each option is something the character gets during background
// The number of background options depends on race
// ============================================================
MERP.backgroundOptions = [
    { id: "extra_money", label: "Extra Money (+10 gold)", effect: { gold: 10 } },
    { id: "special_item", label: "Special Item (GM determined)", effect: { specialItem: true } },
    { id: "extra_spell_list", label: "Extra Spell List (spell users only)", effect: { spellList: 1 } },
    { id: "extra_lang", label: "Extra Language (Rank 3)", effect: { language: 3 } },
    { id: "stat_bonus", label: "+1 to one stat temporary bonus", effect: { tempStatBonus: 1 } },
    { id: "weapon_skill_rank", label: "+1 Weapon Skill Rank", effect: { weaponRank: 1 } },
    { id: "general_skill_rank", label: "+1 General/Subterfuge Skill Rank", effect: { generalRank: 1 } },
    { id: "body_dev_roll", label: "Extra Body Development roll", effect: { bodyDevRoll: 1 } }
];

// ============================================================
// BODY DEVELOPMENT TABLE
// Roll d10, add CO stat bonus
// ============================================================
MERP.bodyDevHitsPerRank = function(roll, coBonus) {
    // Base: 1d10, minimum of 1
    const total = roll + coBonus;
    return Math.max(1, total);
};

// Starting equipment by profession (simplified)
MERP.startingEquipment = {
    "Warrior": { weapon: "Broadsword", armor: "Chain", shield: true, gold: 10 },
    "Scout": { weapon: "Short Sword", armor: "Soft Leather", shield: false, gold: 15 },
    "Mage": { weapon: "Quarterstaff", armor: "No Armor", shield: false, gold: 20 },
    "Animist": { weapon: "Mace", armor: "Soft Leather", shield: false, gold: 15 },
    "Ranger": { weapon: "Broadsword", armor: "Rigid Leather", shield: false, gold: 10 },
    "Bard": { weapon: "Short Sword", armor: "Soft Leather", shield: false, gold: 20 }
};

// ============================================================
// MANEUVER TABLES (MT-1, MT-2)
// ============================================================
MERP.maneuverDifficulty = {
    "Routine": 30, "Easy": 20, "Light": 10, "Medium": 0,
    "Hard": -10, "Very Hard": -20, "Extremely Hard": -30,
    "Sheer Folly": -50, "Absurd": -70
};

// Moving Maneuver (MT-1) result ranges
// Roll + mods -> result
MERP.movingManeuverResult = function(total) {
    if (total <= 5) return { success: false, fumble: true, text: "Spectacular failure. Roll on FT-4 at +50." };
    if (total <= 25) return { success: false, fumble: true, text: "Failure. Roll on FT-4 at +20." };
    if (total <= 50) return { success: false, fumble: false, text: "Failure. Lose rest of round." };
    if (total <= 75) return { success: false, fumble: false, text: "Partial failure. 50% of maneuver accomplished." };
    if (total <= 100) return { success: true, fumble: false, text: "Near success. 80% of maneuver accomplished." };
    if (total <= 175) return { success: true, fumble: false, text: "Success. Maneuver accomplished." };
    return { success: true, fumble: false, text: "Absolute success. Maneuver accomplished perfectly." };
};

// Static Maneuver (MT-2) result
MERP.staticManeuverResult = function(total) {
    if (total <= 5) return { success: false, text: "Absolute failure. Disastrous result." };
    if (total <= 25) return { success: false, text: "Failure." };
    if (total <= 75) return { success: false, text: "Near failure. Close but no cigar." };
    if (total <= 100) return { success: false, text: "Partial success. 50% accomplished." };
    if (total <= 175) return { success: true, text: "Success." };
    return { success: true, text: "Absolute success." };
};

// ============================================================
// RESISTANCE ROLL TABLE (RRT)
// ============================================================
MERP.resistanceRollTable = [
    // [targetLevel, attackLevel1, attackLevel2, ... attackLevel15]
    [0,  55, 60, 65, 70, 75, 78, 81, 84, 87, 90, 92, 94, 96, 98, 100],
    [1,  50, 55, 60, 65, 70, 73, 76, 79, 82, 85, 87, 89, 91, 93, 95],
    [2,  45, 50, 55, 60, 65, 68, 71, 74, 77, 80, 82, 84, 86, 88, 90],
    [3,  40, 45, 50, 55, 60, 63, 66, 69, 72, 75, 77, 79, 81, 83, 85],
    [4,  35, 40, 45, 50, 55, 58, 61, 64, 67, 70, 72, 74, 76, 78, 80],
    [5,  30, 35, 40, 45, 50, 53, 56, 59, 62, 65, 67, 69, 71, 73, 75],
    [6,  27, 32, 37, 42, 47, 50, 53, 56, 59, 62, 64, 66, 68, 70, 72],
    [7,  24, 29, 34, 39, 44, 47, 50, 53, 56, 59, 61, 63, 65, 67, 69],
    [8,  21, 26, 31, 36, 41, 44, 47, 50, 53, 56, 58, 60, 62, 64, 66],
    [9,  18, 23, 28, 33, 38, 41, 44, 47, 50, 53, 55, 57, 59, 61, 63],
    [10, 15, 20, 25, 30, 35, 38, 41, 44, 47, 50, 52, 54, 56, 58, 60],
    [11, 13, 18, 23, 28, 33, 36, 39, 42, 45, 48, 50, 52, 54, 56, 58],
    [12, 11, 16, 21, 26, 31, 34, 37, 40, 43, 46, 48, 50, 52, 54, 56],
    [13,  9, 14, 19, 24, 29, 32, 35, 38, 41, 44, 46, 48, 50, 52, 54],
    [14,  7, 12, 17, 22, 27, 30, 33, 36, 39, 42, 44, 46, 48, 50, 52],
    [15,  5, 10, 15, 20, 25, 28, 31, 34, 37, 40, 42, 44, 46, 48, 50]
];

MERP.lookupResistanceRoll = function(targetLevel, attackLevel) {
    // Clamp levels
    let tl = Math.min(Math.max(targetLevel, 0), 15);
    let al = Math.min(Math.max(attackLevel, 1), 15);

    // For levels above 15: each level over 15, attack level raises result by 1, target level lowers by 1
    let mod = 0;
    if (targetLevel > 15) mod -= (targetLevel - 15);
    if (attackLevel > 15) mod += (attackLevel - 15);

    const row = MERP.resistanceRollTable[tl];
    const needed = row[al] + mod;
    return needed; // Target must roll >= this to resist
};

// ============================================================
// SPELL LISTS (simplified)
// Each profession gets specific spell lists
// ============================================================
MERP.spellLists = {
    "Mage": {
        base: ["Spirit Mastery", "Essence Hand", "Unbarring Ways", "Spell Ways", "Elemental Ways"],
        open: ["Light Law", "Sound/Light Ways", "Essence's Perceptions"],
        closed: ["Living Change", "Invisible Ways"]
    },
    "Animist": {
        base: ["Direct Channeling", "Protections", "Bone/Muscle Ways", "Nature's Ways", "Calm Spirits"],
        open: ["Surface Ways", "Nature's Guises"],
        closed: ["Purifications", "Weather Ways"]
    },
    "Ranger": {
        base: ["Nature's Ways", "Moving Ways"],
        open: ["Surface Ways", "Nature's Guises"],
        closed: ["Purifications"]
    },
    "Bard": {
        base: ["Sound Control", "Essence Hand", "Illusions"],
        open: ["Light Law", "Sound/Light Ways"],
        closed: ["Invisible Ways"]
    }
};

// ============================================================
// DEVELOPMENT POINTS PER LEVEL
// Base: 5 per profession + prime stat bonus
// ============================================================
MERP.developmentPointsPerLevel = function(profession, primeStatBonus) {
    return Math.max(5, 5 + primeStatBonus);
};
