// MERP 2nd Edition - Spell Lists & NPC/Creature Templates
// Spell data from ICE2000 Appendix A-4, Creature data from ST-2

// ============================================================
// COMBAT MODIFIERS FOR SPELLS
// ============================================================
MERP.combatMods = MERP.combatMods || {};
MERP.combatMods.flank = MERP.combatMods.flank || 15;
MERP.combatMods.rear = MERP.combatMods.rear || 20;
MERP.combatMods.surprised = MERP.combatMods.surprised || 20;
MERP.combatMods.stunnedOrDown = MERP.combatMods.stunnedOrDown || 20;
MERP.combatMods.drawingWeapon = MERP.combatMods.drawingWeapon || -30;
MERP.combatMods.halfHitsTaken = MERP.combatMods.halfHitsTaken || -20;
MERP.combatMods.perTenFeetMoved = MERP.combatMods.perTenFeetMoved || -5;

// ============================================================
// SPELL PREPARATION MODIFIERS
// ============================================================
MERP.spellPrepMods = {
    0: -30,   // No preparation (snap cast)
    1: -15,   // 1 round preparation
    2: 0,     // 2 rounds (standard)
    3: 10,    // 3 rounds
    4: 20     // 4+ rounds
};

// ============================================================
// SPELL CLASSES
// E = Elemental, BE = Ball Elemental, DE = Directed Elemental
// F = Force, P = Passive, U = Utility, I = Informational
// ============================================================
// Attack spells use:
//   DE (Directed Elemental / Bolt): Directed Spells skill bonus + AT-7
//   BE (Ball Elemental):           Base Spell OB + AT-8
//   F (Force), P (Passive base):   Base Spell OB + AT-9 -> RR
//   E (Elemental area):            Base Spell OB + AT-8

// ============================================================
// SPELL STATISTICS TABLE (CST-3) - Bolt & Ball Spell Info
// ============================================================
MERP.spellStats = {
    "Shock Bolt":    { range: 100, critType: "Electricity", secondaryCrit: null },
    "Water Bolt":    { range: 100, critType: "Impact", secondaryCrit: null },
    "Ice Bolt":      { range: 100, critType: "Impact", secondaryCrit: "Cold" },
    "Fire Bolt":     { range: 100, critType: "Heat", secondaryCrit: null },
    "Lightning Bolt":{ range: 300, critType: "Electricity", secondaryCrit: "Impact" },
    "Cold Ball":     { range: 100, critType: "Cold", secondaryCrit: null },
    "Fire Ball":     { range: 100, critType: "Heat", secondaryCrit: null }
};

// ============================================================
// COMPLETE SPELL LISTS BY PROFESSION
// Each spell: { level, name, class, area, duration, range, attackTable, critType, isAttack }
// Only combat-relevant spells flagged with isAttack=true
// ============================================================

MERP.spellListData = {
    // ================================================================
    // MAGE SPELL LISTS (Essence)
    // ================================================================
    "Fire Law": {
        profession: "Mage", realm: "Essence", type: "base",
        spells: [
            { level: 1, name: "Boil Liquid", class: "F", area: "1 pint", duration: "P", range: "10'", isAttack: false },
            { level: 2, name: "Shock Bolt I", class: "DE", area: "1 target", duration: "-", range: "100'", isAttack: true, attackTable: "AT7", critType: "Electricity" },
            { level: 3, name: "Fire Hands", class: "E", area: "touch", duration: "1 rnd/lvl", range: "self", isAttack: false },
            { level: 4, name: "Sudden Light", class: "F", area: "10'R", duration: "-", range: "100'", isAttack: false },
            { level: 5, name: "Resist Heat", class: "U", area: "self", duration: "10 min/lvl", range: "self", isAttack: false },
            { level: 6, name: "Fire Bolt", class: "DE", area: "1 target", duration: "-", range: "100'", isAttack: true, attackTable: "AT7", critType: "Heat" },
            { level: 7, name: "Circle of Flame", class: "E", area: "5'R", duration: "C", range: "10'", isAttack: false },
            { level: 8, name: "Fire Ball", class: "BE", area: "5'R", duration: "-", range: "100'", isAttack: true, attackTable: "AT8", critType: "Heat" },
            { level: 9, name: "Resist Heat True", class: "U", area: "self", duration: "10 min/lvl", range: "self", isAttack: false },
            { level: 10, name: "Lightning Bolt", class: "DE", area: "1 target", duration: "-", range: "300'", isAttack: true, attackTable: "AT7", critType: "Electricity", secondaryCrit: "Impact" }
        ]
    },
    "Ice Law": {
        profession: "Mage", realm: "Essence", type: "base",
        spells: [
            { level: 1, name: "Cool", class: "F", area: "varies", duration: "P", range: "10'", isAttack: false },
            { level: 2, name: "Frost Cover", class: "E", area: "10'R", duration: "C", range: "100'", isAttack: false },
            { level: 3, name: "Ice Armor", class: "U", area: "self", duration: "1 min/lvl", range: "self", isAttack: false },
            { level: 4, name: "Ice Slick", class: "F", area: "10'R", duration: "1 rnd/lvl", range: "100'", isAttack: false },
            { level: 5, name: "Resist Cold", class: "U", area: "self", duration: "10 min/lvl", range: "self", isAttack: false },
            { level: 6, name: "Ice Bolt", class: "DE", area: "1 target", duration: "-", range: "100'", isAttack: true, attackTable: "AT7", critType: "Impact", secondaryCrit: "Cold" },
            { level: 7, name: "Cold Ball", class: "BE", area: "5'R", duration: "-", range: "100'", isAttack: true, attackTable: "AT8", critType: "Cold" },
            { level: 8, name: "Shock Bolt III", class: "DE", area: "1 target", duration: "-", range: "100'", isAttack: true, attackTable: "AT7", critType: "Electricity" },
            { level: 9, name: "Resist Cold True", class: "U", area: "self", duration: "10 min/lvl", range: "self", isAttack: false },
            { level: 10, name: "Ice Wall", class: "E", area: "10'x10'x1'", duration: "P", range: "100'", isAttack: false }
        ]
    },
    "Earth Law": {
        profession: "Mage", realm: "Essence", type: "base",
        spells: [
            { level: 1, name: "Tremor", class: "F", area: "5'R", duration: "-", range: "100'", isAttack: false },
            { level: 2, name: "Hurl Rock", class: "DE", area: "1 target", duration: "-", range: "100'", isAttack: true, attackTable: "AT7", critType: "Impact" },
            { level: 3, name: "Stone Skin", class: "U", area: "self", duration: "1 min/lvl", range: "self", isAttack: false },
            { level: 4, name: "Earth Wall", class: "E", area: "10'x10'x1'", duration: "C", range: "50'", isAttack: false },
            { level: 5, name: "Earth Arms", class: "F", area: "1 target", duration: "1 rnd/lvl", range: "50'", isAttack: false },
            { level: 6, name: "Rock Bolt", class: "DE", area: "1 target", duration: "-", range: "100'", isAttack: true, attackTable: "AT7", critType: "Impact" },
            { level: 7, name: "Mud Wall", class: "E", area: "10'x10'x2'", duration: "C", range: "50'", isAttack: false },
            { level: 8, name: "Earth Bolt", class: "DE", area: "1 target", duration: "-", range: "100'", isAttack: true, attackTable: "AT7", critType: "Impact" },
            { level: 9, name: "Rock Wall True", class: "E", area: "20'x10'x2'", duration: "P", range: "50'", isAttack: false },
            { level: 10, name: "Earthquake", class: "F", area: "20'R", duration: "1 rnd/lvl", range: "100'", isAttack: false }
        ]
    },
    "Light Law": {
        profession: "Mage", realm: "Essence", type: "base",
        spells: [
            { level: 1, name: "Light I", class: "E", area: "10'R", duration: "10 min/lvl", range: "touch", isAttack: false },
            { level: 2, name: "Darkness I", class: "F", area: "10'R", duration: "10 min/lvl", range: "touch", isAttack: false },
            { level: 3, name: "Blur", class: "U", area: "self", duration: "1 min/lvl", range: "self", isAttack: false },
            { level: 4, name: "Light II", class: "E", area: "20'R", duration: "10 min/lvl", range: "touch", isAttack: false },
            { level: 5, name: "Darkness II", class: "F", area: "20'R", duration: "10 min/lvl", range: "touch", isAttack: false },
            { level: 6, name: "Sudden Light Flash", class: "F", area: "10'R", duration: "-", range: "100'", isAttack: false },
            { level: 7, name: "Light III", class: "E", area: "30'R", duration: "10 min/lvl", range: "touch", isAttack: false },
            { level: 8, name: "Darkness III", class: "F", area: "30'R", duration: "10 min/lvl", range: "touch", isAttack: false },
            { level: 9, name: "Utterbright", class: "E", area: "50'R", duration: "1 min/lvl", range: "touch", isAttack: false },
            { level: 10, name: "Utterlight", class: "E", area: "100'R", duration: "1 min/lvl", range: "touch", isAttack: false }
        ]
    },
    "Wind Law": {
        profession: "Mage", realm: "Essence", type: "base",
        spells: [
            { level: 1, name: "Breeze Call", class: "E", area: "20' cone", duration: "1 rnd/lvl(C)", range: "self", isAttack: false },
            { level: 2, name: "Airwall", class: "E", area: "10'x10'x3'", duration: "C or 1 rnd/lvl", range: "100'", isAttack: false },
            { level: 3, name: "Condensation", class: "F", area: "varies", duration: "varies(C)", range: "touch", isAttack: false },
            { level: 4, name: "Stun Cloud I", class: "E", area: "5'R", duration: "6 rnd", range: "10'", isAttack: true, attackTable: "AT9", critType: "Electricity" },
            { level: 5, name: "Airstop I", class: "F", area: "10'R", duration: "C", range: "100'", isAttack: false },
            { level: 6, name: "Stun Cloud II", class: "E", area: "10'R", duration: "6 rnd", range: "20'", isAttack: true, attackTable: "AT9", critType: "Electricity" },
            { level: 7, name: "Vacuum", class: "E", area: "5'R", duration: "-", range: "100'", isAttack: true, attackTable: "AT8", critType: "Impact" },
            { level: 8, name: "Airstop II", class: "F", area: "20'R", duration: "-", range: "100'", isAttack: false },
            { level: 9, name: "Stun Cloud III", class: "E", area: "20'R", duration: "6 rnd", range: "40'", isAttack: true, attackTable: "AT9", critType: "Electricity" },
            { level: 10, name: "Death Cloud", class: "E", area: "5'R", duration: "10 rnd", range: "10'", isAttack: true, attackTable: "AT9", critType: "Electricity" }
        ]
    },
    "Water Law": {
        profession: "Mage", realm: "Essence", type: "base",
        spells: [
            { level: 1, name: "Condensation", class: "F", area: "-", duration: "P", range: "touch", isAttack: false },
            { level: 2, name: "Fog Call", class: "E", area: "10'R/lvl", duration: "P", range: "10'/lvl", isAttack: false },
            { level: 3, name: "Waterwall", class: "E", area: "10'x10'x1'", duration: "C or 1 rnd/lvl", range: "100'", isAttack: false },
            { level: 4, name: "Water Bolt I", class: "DE", area: "1 target", duration: "-", range: "100'", isAttack: true, attackTable: "AT7", critType: "Impact" },
            { level: 5, name: "Unfog", class: "F", area: "10'R", duration: "P", range: "100'", isAttack: false },
            { level: 6, name: "Calm Water", class: "F", area: "100'R", duration: "C", range: "100'", isAttack: false },
            { level: 7, name: "Waterwall True", class: "E", area: "10'x10'x1'", duration: "1 min/lvl", range: "100'", isAttack: false },
            { level: 8, name: "Clean Water", class: "F", area: "1000 cu'/lvl", duration: "P", range: "100'", isAttack: false },
            { level: 9, name: "Water Bolt III", class: "DE", area: "1 target", duration: "-", range: "300'", isAttack: true, attackTable: "AT7", critType: "Impact" },
            { level: 10, name: "Call Rain", class: "F", area: "100'R/lvl", duration: "10 min/lvl", range: "100'/lvl", isAttack: false }
        ]
    },

    // ================================================================
    // OPEN ESSENCE SPELL LISTS (Mage, Bard)
    // ================================================================
    "Spirit Mastery": {
        profession: "open_essence", realm: "Essence", type: "open",
        spells: [
            { level: 1, name: "Calm I", class: "F", area: "1 target", duration: "1 min/lvl", range: "100'", isAttack: true, attackTable: "AT9", critType: null },
            { level: 2, name: "Calm II", class: "F", area: "2 targets", duration: "1 min/lvl", range: "100'", isAttack: true, attackTable: "AT9", critType: null },
            { level: 3, name: "Hold Kind", class: "F", area: "1 target", duration: "C", range: "100'", isAttack: true, attackTable: "AT9", critType: null },
            { level: 4, name: "Long Calm", class: "F", area: "1 target", duration: "1 min/lvl", range: "300'", isAttack: true, attackTable: "AT9", critType: null },
            { level: 5, name: "Stunning", class: "F", area: "1 target", duration: "varies", range: "50'", isAttack: true, attackTable: "AT9", critType: null },
            { level: 6, name: "Calm III", class: "F", area: "3 targets", duration: "1 min/lvl", range: "100'", isAttack: true, attackTable: "AT9", critType: null },
            { level: 7, name: "Calm IV", class: "F", area: "4 targets", duration: "1 min/lvl", range: "100'", isAttack: true, attackTable: "AT9", critType: null },
            { level: 8, name: "Golden Slumbers", class: "F", area: "1 target", duration: "varies", range: "50'", isAttack: true, attackTable: "AT9", critType: null },
            { level: 9, name: "Calm V", class: "F", area: "5 targets", duration: "1 min/lvl", range: "100'", isAttack: true, attackTable: "AT9", critType: null },
            { level: 10, name: "Blinding", class: "F", area: "1 target", duration: "varies", range: "50'", isAttack: true, attackTable: "AT9", critType: null }
        ]
    },
    "Illusions": {
        profession: "open_essence", realm: "Essence", type: "open",
        spells: [
            { level: 1, name: "Minor Illusion", class: "P", area: "5'R", duration: "C", range: "100'", isAttack: false },
            { level: 2, name: "Illusion I", class: "P", area: "10'R", duration: "C", range: "100'", isAttack: false },
            { level: 3, name: "Minor Phantasm", class: "P", area: "5'R", duration: "C", range: "100'", isAttack: false },
            { level: 4, name: "Illusion II", class: "P", area: "10'x10'", duration: "C", range: "100'", isAttack: false },
            { level: 5, name: "Phantasm I", class: "P", area: "10'R", duration: "C", range: "100'", isAttack: false },
            { level: 6, name: "Illusion III", class: "P", area: "20'R", duration: "C", range: "100'", isAttack: false },
            { level: 7, name: "Phantasm II", class: "P", area: "20'R", duration: "C", range: "100'", isAttack: false },
            { level: 8, name: "Illusion IV", class: "P", area: "30'R", duration: "C", range: "100'", isAttack: false },
            { level: 9, name: "Phantasm III", class: "P", area: "30'R", duration: "C", range: "100'", isAttack: false },
            { level: 10, name: "Illusion True", class: "P", area: "50'R", duration: "C", range: "100'", isAttack: false }
        ]
    },
    "Essence Hand": {
        profession: "open_essence", realm: "Essence", type: "open",
        spells: [
            { level: 1, name: "Essence Hand", class: "F", area: "5 lbs", duration: "C", range: "100'", isAttack: false },
            { level: 2, name: "Shield", class: "U", area: "self", duration: "1 rnd/lvl", range: "self", isAttack: false },
            { level: 3, name: "Essence Fist", class: "F", area: "1 target", duration: "-", range: "100'", isAttack: true, attackTable: "AT9", critType: "Crush" },
            { level: 4, name: "Essence Hand II", class: "F", area: "25 lbs", duration: "C", range: "100'", isAttack: false },
            { level: 5, name: "Shield II", class: "U", area: "self", duration: "1 min/lvl", range: "self", isAttack: false },
            { level: 6, name: "Essence Fist II", class: "F", area: "1 target", duration: "-", range: "100'", isAttack: true, attackTable: "AT9", critType: "Crush" },
            { level: 7, name: "Essence Hand III", class: "F", area: "100 lbs", duration: "C", range: "100'", isAttack: false },
            { level: 8, name: "Shield III", class: "U", area: "self", duration: "10 min/lvl", range: "self", isAttack: false },
            { level: 9, name: "Essence Fist III", class: "F", area: "1 target", duration: "-", range: "100'", isAttack: true, attackTable: "AT9", critType: "Crush" },
            { level: 10, name: "Essence Hand True", class: "F", area: "500 lbs", duration: "C", range: "100'", isAttack: false }
        ]
    },
    "Unbarring Ways": {
        profession: "open_essence", realm: "Essence", type: "open",
        spells: [
            { level: 1, name: "Detect Lock", class: "I", area: "1 lock", duration: "-", range: "touch", isAttack: false },
            { level: 2, name: "Open I", class: "F", area: "1 lock", duration: "-", range: "10'", isAttack: false },
            { level: 3, name: "Detect Trap", class: "I", area: "5'R", duration: "-", range: "10'", isAttack: false },
            { level: 4, name: "Open II", class: "F", area: "1 lock", duration: "-", range: "10'", isAttack: false },
            { level: 5, name: "Disarm Trap", class: "F", area: "1 trap", duration: "-", range: "10'", isAttack: false },
            { level: 6, name: "Open III", class: "F", area: "1 lock", duration: "-", range: "50'", isAttack: false },
            { level: 7, name: "Close I", class: "F", area: "1 portal", duration: "C", range: "50'", isAttack: false },
            { level: 8, name: "Open IV", class: "F", area: "1 barrier", duration: "-", range: "50'", isAttack: false },
            { level: 9, name: "Close II", class: "F", area: "1 portal", duration: "1 hr/lvl", range: "50'", isAttack: false },
            { level: 10, name: "Open True", class: "F", area: "1 barrier", duration: "-", range: "100'", isAttack: false }
        ]
    },
    "Spell Ways": {
        profession: "open_essence", realm: "Essence", type: "open",
        spells: [
            { level: 1, name: "Detect Essence", class: "I", area: "5'R", duration: "-", range: "50'", isAttack: false },
            { level: 2, name: "Dispel Essence I", class: "F", area: "1 spell", duration: "-", range: "50'", isAttack: false },
            { level: 3, name: "Spell Store I", class: "U", area: "1 spell", duration: "varies", range: "self", isAttack: false },
            { level: 4, name: "Dispel Essence II", class: "F", area: "1 spell", duration: "-", range: "100'", isAttack: false },
            { level: 5, name: "Cancel Essence I", class: "F", area: "1 spell", duration: "-", range: "50'", isAttack: false },
            { level: 6, name: "Spell Store II", class: "U", area: "2 spells", duration: "varies", range: "self", isAttack: false },
            { level: 7, name: "Dispel Essence III", class: "F", area: "10'R", duration: "-", range: "100'", isAttack: false },
            { level: 8, name: "Cancel Essence II", class: "F", area: "1 spell", duration: "-", range: "100'", isAttack: false },
            { level: 9, name: "Spell Store III", class: "U", area: "3 spells", duration: "varies", range: "self", isAttack: false },
            { level: 10, name: "Cancel Essence True", class: "F", area: "10'R", duration: "-", range: "100'", isAttack: false }
        ]
    },

    // ================================================================
    // OPEN CHANNELING SPELL LISTS (Animist, Ranger)
    // ================================================================
    "Sound/Light Ways": {
        profession: "open_channeling", realm: "Channeling", type: "open",
        spells: [
            { level: 1, name: "Projected Light", class: "E", area: "50' beam", duration: "10 min/lvl", range: "self", isAttack: false },
            { level: 2, name: "Speech I", class: "U", area: "1 target", duration: "C", range: "10'", isAttack: false },
            { level: 3, name: "Light I", class: "E", area: "10'R", duration: "10 min/lvl", range: "touch", isAttack: false },
            { level: 4, name: "Quiet", class: "E", area: "1'R", duration: "1 min/lvl", range: "100'", isAttack: false },
            { level: 5, name: "Sudden Light", class: "F", area: "10'R", duration: "-", range: "100'", isAttack: false },
            { level: 6, name: "Speech II", class: "U", area: "1 target", duration: "C", range: "10'", isAttack: false },
            { level: 7, name: "Shock Bolt I", class: "DE", area: "1 target", duration: "-", range: "100'", isAttack: true, attackTable: "AT7", critType: "Electricity" },
            { level: 8, name: "Silence", class: "E", area: "10'R", duration: "1 min/lvl", range: "100'", isAttack: false },
            { level: 9, name: "Utterlight", class: "E", area: "10'R", duration: "1 min/lvl", range: "touch", isAttack: false },
            { level: 10, name: "Waiting Light", class: "E", area: "10'R", duration: "varies", range: "touch", isAttack: false }
        ]
    },
    "Calm Spirits": {
        profession: "open_channeling", realm: "Channeling", type: "open",
        spells: [
            { level: 1, name: "Calm I", class: "F", area: "1 target", duration: "1 min/lvl", range: "100'", isAttack: true, attackTable: "AT9", critType: null },
            { level: 2, name: "Calm II", class: "F", area: "2 targets", duration: "1 min/lvl", range: "100'", isAttack: true, attackTable: "AT9", critType: null },
            { level: 3, name: "Hold Kind", class: "F", area: "1 target", duration: "C", range: "100'", isAttack: true, attackTable: "AT9", critType: null },
            { level: 4, name: "Long Calm", class: "F", area: "1 target", duration: "1 min/lvl", range: "300'", isAttack: true, attackTable: "AT9", critType: null },
            { level: 5, name: "Stunning", class: "F", area: "1 target", duration: "varies", range: "50'", isAttack: true, attackTable: "AT9", critType: null },
            { level: 6, name: "Calm III", class: "F", area: "3 targets", duration: "1 min/lvl", range: "100'", isAttack: true, attackTable: "AT9", critType: null },
            { level: 7, name: "Calm IV", class: "F", area: "4 targets", duration: "1 min/lvl", range: "100'", isAttack: true, attackTable: "AT9", critType: null },
            { level: 8, name: "Golden Slumbers", class: "F", area: "1 target", duration: "varies", range: "50'", isAttack: true, attackTable: "AT9", critType: null },
            { level: 9, name: "Calm V", class: "F", area: "5 targets", duration: "1 min/lvl", range: "100'", isAttack: true, attackTable: "AT9", critType: null },
            { level: 10, name: "Blinding", class: "F", area: "1 target", duration: "varies", range: "50'", isAttack: true, attackTable: "AT9", critType: null }
        ]
    },
    "Protections": {
        profession: "open_channeling", realm: "Channeling", type: "open",
        spells: [
            { level: 1, name: "Protection I", class: "U", area: "1 target", duration: "1 min/lvl", range: "10'", isAttack: false },
            { level: 2, name: "Area Protection I", class: "U", area: "10'R", duration: "1 min/lvl(C)", range: "10'", isAttack: false },
            { level: 3, name: "Neutralize Curse I", class: "F", area: "1 curse", duration: "1 min/lvl", range: "touch", isAttack: false },
            { level: 4, name: "Protection II", class: "U", area: "1 target", duration: "1 min/lvl", range: "10'", isAttack: false },
            { level: 5, name: "Area Protection II", class: "U", area: "10'R", duration: "1 min/lvl(C)", range: "10'", isAttack: false },
            { level: 6, name: "Remove Curse", class: "F", area: "1 curse", duration: "P", range: "touch", isAttack: false },
            { level: 7, name: "Neutralize Curse II", class: "F", area: "1 curse", duration: "1 hr/lvl", range: "10'", isAttack: false },
            { level: 8, name: "Cancel Spell", class: "F", area: "1 spell", duration: "P", range: "10'", isAttack: false },
            { level: 9, name: "Protection III", class: "U", area: "1 target", duration: "1 min/lvl", range: "10'", isAttack: false },
            { level: 10, name: "Area Protection III", class: "U", area: "10'R", duration: "1 min/lvl(C)", range: "10'", isAttack: false }
        ]
    },
    "Surface Ways": {
        profession: "open_channeling", realm: "Channeling", type: "open",
        spells: [
            { level: 1, name: "Heal 10", class: "U", area: "1 target", duration: "P", range: "touch", isAttack: false },
            { level: 2, name: "Frost/Burn Relief I", class: "U", area: "1 burn area", duration: "P", range: "touch", isAttack: false },
            { level: 3, name: "Stun Relief I", class: "U", area: "1 target", duration: "P", range: "touch", isAttack: false },
            { level: 4, name: "Regeneration I", class: "U", area: "1 target", duration: "C", range: "touch", isAttack: false },
            { level: 5, name: "Frost/Burn Relief II", class: "U", area: "varies", duration: "P", range: "touch", isAttack: false },
            { level: 6, name: "Awakening", class: "U", area: "1 target", duration: "P", range: "touch", isAttack: false },
            { level: 7, name: "Heal 50", class: "U", area: "1 target", duration: "P", range: "touch", isAttack: false },
            { level: 8, name: "Frost/Burn Relief III", class: "U", area: "varies", duration: "P", range: "touch", isAttack: false },
            { level: 9, name: "Stun Relief III", class: "U", area: "1 target", duration: "P", range: "touch", isAttack: false },
            { level: 10, name: "Regeneration III", class: "U", area: "1 target", duration: "C", range: "touch", isAttack: false }
        ]
    },
    "Detection Mastery": {
        profession: "open_channeling", realm: "Channeling", type: "open",
        spells: [
            { level: 1, name: "Detect Channeling", class: "P", area: "5'R", duration: "1 min/lvl(C)", range: "50'", isAttack: false },
            { level: 2, name: "Detect Essence", class: "P", area: "5'R", duration: "1 min/lvl(C)", range: "50'", isAttack: false },
            { level: 3, name: "Detect Evil", class: "P", area: "5'R", duration: "1 min/lvl(C)", range: "50'", isAttack: false },
            { level: 4, name: "Detect Curse", class: "P", area: "5'R", duration: "1 min/lvl(C)", range: "50'", isAttack: false },
            { level: 5, name: "Location I", class: "P", area: "1 target", duration: "1 min/lvl(C)", range: "100'", isAttack: false },
            { level: 6, name: "Detect Traps", class: "P", area: "5'R", duration: "1 min/lvl(C)", range: "50'", isAttack: false },
            { level: 7, name: "Location III", class: "P", area: "1 target", duration: "1 min/lvl(C)", range: "300'", isAttack: false },
            { level: 8, name: "Detect Invisible", class: "P", area: "5'R", duration: "1 min/lvl(C)", range: "50'", isAttack: false },
            { level: 9, name: "Location V", class: "P", area: "1 target", duration: "1 min/lvl(C)", range: "500'", isAttack: false },
            { level: 10, name: "Curse Tales", class: "I", area: "1 curse", duration: "-", range: "10'", isAttack: false }
        ]
    },
    "Nature's Lore": {
        profession: "open_channeling", realm: "Channeling", type: "open",
        spells: [
            { level: 1, name: "Trap Detection", class: "P", area: "5'R", duration: "1 min/lvl(C)", range: "10'", isAttack: false },
            { level: 2, name: "Nature's Awareness I", class: "I", area: "100'R", duration: "C", range: "self", isAttack: false },
            { level: 3, name: "Storm Prediction", class: "I", area: "1 mi/lvl R", duration: "-", range: "self", isAttack: false },
            { level: 4, name: "Weather Prediction", class: "I", area: "1 mi/lvl R", duration: "-", range: "self", isAttack: false },
            { level: 5, name: "Nature's Awareness III", class: "I", area: "300'R", duration: "C", range: "self", isAttack: false },
            { level: 6, name: "Breeze Call", class: "E", area: "20' cone", duration: "1 rnd/lvl", range: "self", isAttack: false },
            { level: 7, name: "Waiting Awareness", class: "I", area: "10'R", duration: "1 hr/lvl", range: "self", isAttack: false },
            { level: 8, name: "Fog Call", class: "F", area: "10'/lvl R", duration: "P", range: "10'/lvl", isAttack: false },
            { level: 9, name: "Nature's Awareness V", class: "I", area: "500'R", duration: "C", range: "self", isAttack: false },
            { level: 10, name: "Weather Prediction True", class: "I", area: "1 mi/lvl R", duration: "-", range: "self", isAttack: false }
        ]
    },

    // ================================================================
    // ANIMIST SPELL LISTS (Channeling)
    // ================================================================
    "Direct Channeling": {
        profession: "Animist", realm: "Channeling", type: "base",
        spells: [
            { level: 1, name: "Preservation I", class: "U", area: "1 body", duration: "1 hr/lvl", range: "10'", isAttack: false },
            { level: 2, name: "Intuitions I", class: "I", area: "self", duration: "-", range: "self", isAttack: false },
            { level: 3, name: "Dream I", class: "I", area: "self", duration: "-", range: "self", isAttack: false },
            { level: 4, name: "Lifekeeping I", class: "U", area: "1 body", duration: "1 hr/lvl", range: "10'", isAttack: false },
            { level: 5, name: "Intuitions III", class: "I", area: "self", duration: "-", range: "self", isAttack: false },
            { level: 6, name: "Death's Tale", class: "I", area: "1 body", duration: "-", range: "10'", isAttack: false },
            { level: 7, name: "Preservation II", class: "U", area: "1 body", duration: "1 day/lvl", range: "10'", isAttack: false },
            { level: 8, name: "Intuitions V", class: "I", area: "self", duration: "-", range: "self", isAttack: false },
            { level: 9, name: "Dreams III", class: "I", area: "self", duration: "-", range: "self", isAttack: false },
            { level: 10, name: "Lifekeeping II", class: "U", area: "1 body", duration: "1 day/lvl", range: "10'", isAttack: false }
        ]
    },
    "Bone/Muscle Ways": {
        profession: "Animist", realm: "Channeling", type: "base",
        spells: [
            { level: 1, name: "Sprain Repair", class: "U", area: "1 sprain", duration: "P", range: "touch", isAttack: false },
            { level: 2, name: "Minor Fracture Repair", class: "U", area: "1 break", duration: "P", range: "touch", isAttack: false },
            { level: 3, name: "Muscle Repair", class: "U", area: "1 muscle", duration: "P", range: "touch", isAttack: false },
            { level: 4, name: "Cartilage Repair", class: "U", area: "1 joint", duration: "P", range: "touch", isAttack: false },
            { level: 5, name: "Tendon Repair", class: "U", area: "1 tendon", duration: "P", range: "touch", isAttack: false },
            { level: 6, name: "Major Fracture Repair", class: "U", area: "1 break", duration: "P", range: "touch", isAttack: false },
            { level: 7, name: "Joining", class: "U", area: "1 limb", duration: "P", range: "touch", isAttack: false },
            { level: 8, name: "Jaw Repair", class: "U", area: "1 jaw", duration: "P", range: "touch", isAttack: false },
            { level: 9, name: "Skull Repair", class: "U", area: "1 skull", duration: "P", range: "touch", isAttack: false },
            { level: 10, name: "Joint Repair", class: "U", area: "1 joint", duration: "P", range: "touch", isAttack: false }
        ]
    },
    "Blood Ways": {
        profession: "Animist", realm: "Channeling", type: "base",
        spells: [
            { level: 1, name: "Clotting I", class: "U", area: "1 target", duration: "P", range: "touch", isAttack: false },
            { level: 2, name: "Cut Repair I", class: "U", area: "1 target", duration: "P", range: "touch", isAttack: false },
            { level: 3, name: "Minor Vessel Repair", class: "U", area: "1 target", duration: "P", range: "touch", isAttack: false },
            { level: 4, name: "Clotting V", class: "U", area: "1 target", duration: "P", range: "touch", isAttack: false },
            { level: 5, name: "Cut Repair III", class: "U", area: "1 target", duration: "P", range: "touch", isAttack: false },
            { level: 6, name: "Major Vessel Repair", class: "U", area: "1 wound", duration: "P", range: "touch", isAttack: false },
            { level: 7, name: "Joining", class: "U", area: "1 limb", duration: "P", range: "touch", isAttack: false },
            { level: 8, name: "Blood Transfusion", class: "U", area: "1 target", duration: "P", range: "touch", isAttack: false },
            { level: 9, name: "Mass Clotting", class: "U", area: "1 target", duration: "P", range: "touch", isAttack: false },
            { level: 10, name: "Mass Cut Repair", class: "U", area: "1 target", duration: "P", range: "touch", isAttack: false }
        ]
    },
    "Organ Ways": {
        profession: "Animist", realm: "Channeling", type: "base",
        spells: [
            { level: 1, name: "Nasal Repair", class: "U", area: "1 nose", duration: "P", range: "touch", isAttack: false },
            { level: 2, name: "Minor Nerve Repair", class: "U", area: "1 area", duration: "P", range: "touch", isAttack: false },
            { level: 3, name: "Minor Ear Repair", class: "U", area: "1 ear", duration: "P", range: "touch", isAttack: false },
            { level: 4, name: "Minor Eye Repair", class: "U", area: "1 eye", duration: "P", range: "touch", isAttack: false },
            { level: 5, name: "Major Nerve Repair", class: "U", area: "1 area", duration: "P", range: "touch", isAttack: false },
            { level: 6, name: "Major Ear Repair", class: "U", area: "1 ear", duration: "P", range: "touch", isAttack: false },
            { level: 7, name: "Joining", class: "U", area: "1 limb", duration: "P", range: "touch", isAttack: false },
            { level: 8, name: "Major Eye Repair", class: "U", area: "1 eye", duration: "P", range: "touch", isAttack: false },
            { level: 9, name: "Nerve Repair True", class: "U", area: "1 area", duration: "P", range: "touch", isAttack: false },
            { level: 10, name: "Organ Repair", class: "U", area: "1 organ", duration: "P", range: "touch", isAttack: false }
        ]
    },
    "Animal Mastery": {
        profession: "Animist", realm: "Channeling", type: "base",
        spells: [
            { level: 1, name: "Animal Sleep", class: "F", area: "1 animal", duration: "1 min/lvl", range: "100'", isAttack: true, attackTable: "AT9", critType: null },
            { level: 2, name: "Cloaking", class: "E", area: "self", duration: "1 min/lvl", range: "self", isAttack: false },
            { level: 3, name: "Summons I", class: "F", area: "-", duration: "1 min(C)", range: "100'", isAttack: false },
            { level: 4, name: "Animal Tongues", class: "I", area: "self", duration: "1 min/lvl", range: "self", isAttack: false },
            { level: 5, name: "Animal Mastery", class: "F", area: "1 animal", duration: "C", range: "100'", isAttack: true, attackTable: "AT9", critType: null },
            { level: 6, name: "Summons III", class: "F", area: "-", duration: "varies(C)", range: "100'", isAttack: false },
            { level: 7, name: "Animal Location", class: "I", area: "1 mi. R", duration: "-", range: "1 mile", isAttack: false },
            { level: 8, name: "Befriending", class: "F", area: "50'R", duration: "C", range: "self", isAttack: false },
            { level: 9, name: "Animal Empathy", class: "I", area: "1 animal", duration: "C", range: "100'", isAttack: false },
            { level: 10, name: "Summons V", class: "F", area: "-", duration: "varies(C)", range: "100'", isAttack: false }
        ]
    },
    "Plant Mastery": {
        profession: "Animist", realm: "Channeling", type: "base",
        spells: [
            { level: 1, name: "Plant Lore", class: "I", area: "1 plant", duration: "-", range: "touch", isAttack: false },
            { level: 2, name: "Plant Tongues", class: "I", area: "self", duration: "1 min/lvl", range: "self", isAttack: false },
            { level: 3, name: "Instant Herbal Cures", class: "U", area: "1 herb", duration: "-", range: "touch", isAttack: false },
            { level: 4, name: "Herb Mastery", class: "U", area: "1 herb", duration: "P", range: "touch", isAttack: false },
            { level: 5, name: "Plant Location", class: "I", area: "1 mi R", duration: "-", range: "1 mile", isAttack: false },
            { level: 6, name: "Herb Cleansing", class: "U", area: "1 herb", duration: "P", range: "10'", isAttack: false },
            { level: 7, name: "Speed Growth", class: "U", area: "10'R", duration: "1 day", range: "10'", isAttack: false },
            { level: 8, name: "Herb Production", class: "U", area: "1 herb", duration: "P", range: "touch", isAttack: false },
            { level: 9, name: "Plant Growth", class: "U", area: "1 plant", duration: "P", range: "touch", isAttack: false },
            { level: 10, name: "Plant Control", class: "F", area: "1 plant", duration: "1 min/lvl", range: "100'", isAttack: false }
        ]
    },

    // ================================================================
    // RANGER SPELL LISTS (Channeling)
    // ================================================================
    "Path Mastery": {
        profession: "Ranger", realm: "Channeling", type: "base",
        spells: [
            { level: 1, name: "Pathlore", class: "I", area: "10'R", duration: "-", range: "self", isAttack: false },
            { level: 2, name: "Trap Detection", class: "P", area: "5'R", duration: "1 min/lvl(C)", range: "10'", isAttack: false },
            { level: 3, name: "Tracking", class: "U", area: "self", duration: "C", range: "self", isAttack: false },
            { level: 4, name: "Path Tale", class: "I", area: "self", duration: "-", range: "self", isAttack: false },
            { level: 5, name: "Pathfinding I", class: "I", area: "1 mi R", duration: "C", range: "1 mile", isAttack: false },
            { level: 6, name: "Tracks Lore", class: "I", area: "-", duration: "-", range: "touch", isAttack: false },
            { level: 7, name: "Detect Ambush", class: "P", area: "50'R", duration: "10 min/lvl", range: "self", isAttack: false },
            { level: 8, name: "Passing Lore", class: "I", area: "-", duration: "-", range: "touch", isAttack: false },
            { level: 9, name: "Pathfinding V", class: "I", area: "5 mi R", duration: "C", range: "5 miles", isAttack: false },
            { level: 10, name: "Animal Tongues", class: "I", area: "self", duration: "1 min/lvl", range: "self", isAttack: false }
        ]
    },
    "Moving Ways": {
        profession: "Ranger", realm: "Channeling", type: "base",
        spells: [
            { level: 1, name: "Stonerunning", class: "U", area: "self", duration: "1 min/lvl", range: "self", isAttack: false },
            { level: 2, name: "Limbwalking", class: "U", area: "self", duration: "1 min/lvl", range: "self", isAttack: false },
            { level: 3, name: "Swimming", class: "U", area: "self", duration: "5 min/lvl", range: "self", isAttack: false },
            { level: 4, name: "Sandrunning", class: "U", area: "self", duration: "1 min/lvl", range: "self", isAttack: false },
            { level: 5, name: "Waterwalking", class: "U", area: "self", duration: "1 min/lvl", range: "self", isAttack: false },
            { level: 6, name: "Limbrunning", class: "U", area: "self", duration: "1 min/lvl", range: "self", isAttack: false },
            { level: 7, name: "Traceless Passing", class: "U", area: "self", duration: "C", range: "self", isAttack: false },
            { level: 8, name: "Track Hiding", class: "U", area: "-", duration: "C", range: "50'", isAttack: false },
            { level: 9, name: "Waterrunning", class: "U", area: "self", duration: "1 min/lvl", range: "self", isAttack: false },
            { level: 10, name: "Swimming True", class: "U", area: "self", duration: "5 min/lvl", range: "self", isAttack: false }
        ]
    },
    "Nature's Guises": {
        profession: "Ranger", realm: "Channeling", type: "base",
        spells: [
            { level: 1, name: "Hues", class: "E", area: "self", duration: "1 min/lvl", range: "self", isAttack: false },
            { level: 2, name: "Shade", class: "E", area: "100'R", duration: "10 min/lvl", range: "touch", isAttack: false },
            { level: 3, name: "Freeze", class: "E", area: "1 cu'/rnd", duration: "C", range: "10'", isAttack: false },
            { level: 4, name: "Silent Moves", class: "E", area: "self", duration: "1 min/lvl", range: "self", isAttack: false },
            { level: 5, name: "Self Cloaking", class: "E", area: "self", duration: "C", range: "self", isAttack: false },
            { level: 6, name: "Light", class: "E", area: "10'R", duration: "10 min/lvl", range: "touch", isAttack: false },
            { level: 7, name: "Darkness", class: "E", area: "10'R", duration: "10 min/lvl", range: "touch", isAttack: false },
            { level: 8, name: "Shadow", class: "F", area: "self", duration: "1 hr/lvl", range: "self", isAttack: false },
            { level: 9, name: "Plant Facade", class: "E", area: "self", duration: "1 min/lvl", range: "self", isAttack: false },
            { level: 10, name: "Blank Thoughts", class: "U", area: "self", duration: "C", range: "self", isAttack: false }
        ]
    },
    "Nature's Ways": {
        profession: "Ranger", realm: "Channeling", type: "base",
        spells: [
            { level: 1, name: "Water Finding", class: "I", area: "1 mile R", duration: "-", range: "self", isAttack: false },
            { level: 2, name: "Fire Starting", class: "F", area: "1'R", duration: "P", range: "touch", isAttack: false },
            { level: 3, name: "Heat Resistance", class: "U", area: "self", duration: "1 min/lvl", range: "self", isAttack: false },
            { level: 4, name: "Cold Resistance", class: "U", area: "self", duration: "1 min/lvl", range: "self", isAttack: false },
            { level: 5, name: "Food Finding", class: "I", area: "1 mile R", duration: "-", range: "self", isAttack: false },
            { level: 6, name: "Sterilization", class: "E", area: "1 cu'/lvl", duration: "-", range: "touch", isAttack: false },
            { level: 7, name: "Shelter Finding", class: "I", area: "1 mile R", duration: "-", range: "self", isAttack: false },
            { level: 8, name: "Lesser Traps", class: "U", area: "varies", duration: "P", range: "touch", isAttack: false },
            { level: 9, name: "Weather Prediction", class: "I", area: "1 mile R", duration: "-", range: "self", isAttack: false },
            { level: 10, name: "Nature's Awareness", class: "I", area: "100'R", duration: "C", range: "self", isAttack: false }
        ]
    },

    // ================================================================
    // BARD SPELL LISTS (Essence)
    // ================================================================
    "Lore": {
        profession: "Bard", realm: "Essence", type: "base",
        spells: [
            { level: 1, name: "Study I", class: "U", area: "self", duration: "C", range: "self", isAttack: false },
            { level: 2, name: "Learn Language II", class: "U", area: "self", duration: "C", range: "self", isAttack: false },
            { level: 3, name: "Language Lore", class: "I", area: "1 text", duration: "-", range: "touch", isAttack: false },
            { level: 4, name: "Mind's Lore I", class: "I", area: "1 target", duration: "1 rnd", range: "50'", isAttack: false },
            { level: 5, name: "Study II", class: "U", area: "self", duration: "C", range: "self", isAttack: false },
            { level: 6, name: "Interpreting Ear", class: "P", area: "1 speaker", duration: "C", range: "self", isAttack: false },
            { level: 7, name: "Learn Language III", class: "U", area: "self", duration: "C", range: "self", isAttack: false },
            { level: 8, name: "Mind's Lore III", class: "I", area: "1 target", duration: "1 rnd", range: "50'", isAttack: false },
            { level: 9, name: "Study III", class: "U", area: "self", duration: "C", range: "self", isAttack: false },
            { level: 10, name: "Passage Origin", class: "I", area: "self", duration: "C", range: "self", isAttack: false }
        ]
    },
    "Controlling Songs": {
        profession: "Bard", realm: "Essence", type: "base",
        spells: [
            { level: 1, name: "Calm Song", class: "F", area: "1 target", duration: "C", range: "50'", isAttack: true, attackTable: "AT9", critType: null },
            { level: 2, name: "Holding Song", class: "F", area: "1 target", duration: "C", range: "50'", isAttack: true, attackTable: "AT9", critType: null },
            { level: 3, name: "Stun Song", class: "F", area: "1 target", duration: "C", range: "50'", isAttack: true, attackTable: "AT9", critType: null },
            { level: 4, name: "Silent Song", class: "F", area: "1 target", duration: "C", range: "50'", isAttack: true, attackTable: "AT9", critType: null },
            { level: 5, name: "Sleep Song", class: "F", area: "1 target", duration: "C", range: "50'", isAttack: true, attackTable: "AT9", critType: null },
            { level: 6, name: "Charm Song", class: "F", area: "1 target", duration: "C", range: "50'", isAttack: true, attackTable: "AT9", critType: null },
            { level: 7, name: "Fear's Song", class: "F", area: "1 target", duration: "C", range: "50'", isAttack: true, attackTable: "AT9", critType: null },
            { level: 8, name: "Calm Song True", class: "F", area: "1 target", duration: "C + varies", range: "50'", isAttack: true, attackTable: "AT9", critType: null },
            { level: 9, name: "Stun Song True", class: "F", area: "1 target", duration: "C + varies", range: "50'", isAttack: true, attackTable: "AT9", critType: null },
            { level: 10, name: "Forgetting Song", class: "F", area: "1 target", duration: "P", range: "50'", isAttack: true, attackTable: "AT9", critType: null }
        ]
    },
    "Sound Control": {
        profession: "Bard", realm: "Essence", type: "base",
        spells: [
            { level: 1, name: "Long Whisper", class: "E", area: "1 point", duration: "C", range: "50'/lvl", isAttack: false },
            { level: 2, name: "Silence I", class: "E", area: "10'R", duration: "1 min/lvl", range: "self", isAttack: false },
            { level: 3, name: "Song Sounding II", class: "E", area: "1 song", duration: "as song", range: "2x song's", isAttack: false },
            { level: 4, name: "Song II", class: "E", area: "2 targets", duration: "as song", range: "as song", isAttack: false },
            { level: 5, name: "Sonic Law I", class: "E", area: "10'R", duration: "C", range: "self", isAttack: false },
            { level: 6, name: "Great Song", class: "E", area: "10'R", duration: "as song", range: "as song", isAttack: false },
            { level: 7, name: "Silence V", class: "E", area: "50'R", duration: "1 min/lvl", range: "self", isAttack: false },
            { level: 8, name: "Song Sounding III", class: "E", area: "1 song", duration: "as song", range: "3x song's", isAttack: false },
            { level: 9, name: "Song III", class: "E", area: "3 targets", duration: "as song", range: "as song", isAttack: false },
            { level: 10, name: "Sonic Law X", class: "E", area: "100'R", duration: "C", range: "self", isAttack: false }
        ]
    },
    "Item Lore": {
        profession: "Bard", realm: "Essence", type: "base",
        spells: [
            { level: 1, name: "Jewel/Metal Assessment", class: "I", area: "1 object", duration: "-", range: "touch", isAttack: false },
            { level: 2, name: "Item Assessment", class: "I", area: "1 object", duration: "-", range: "touch", isAttack: false },
            { level: 3, name: "Detect Power", class: "I", area: "1 object", duration: "-", range: "touch", isAttack: false },
            { level: 4, name: "Item Analysis I", class: "I", area: "1 object", duration: "-", range: "touch", isAttack: false },
            { level: 5, name: "Assessment True", class: "I", area: "1 object", duration: "-", range: "touch", isAttack: false },
            { level: 6, name: "Significance", class: "I", area: "1 object", duration: "-", range: "touch", isAttack: false },
            { level: 7, name: "Detect Curse", class: "I", area: "1 object", duration: "-", range: "touch", isAttack: false },
            { level: 8, name: "Origins", class: "I", area: "1 object", duration: "-", range: "touch", isAttack: false },
            { level: 9, name: "Item Analysis II", class: "I", area: "1 object", duration: "-", range: "touch", isAttack: false },
            { level: 10, name: "History", class: "I", area: "1 object", duration: "-", range: "touch", isAttack: false }
        ]
    },

    // ================================================================
    // MAGE "LIVING CHANGE" and "LOFTY BRIDGE" (Mage base lists from p198-199)
    // ================================================================
    "Living Change": {
        profession: "Mage", realm: "Essence", type: "base",
        spells: [
            { level: 1, name: "Run", class: "U", area: "1 target", duration: "10 min/lvl", range: "10'", isAttack: false },
            { level: 2, name: "Speed I", class: "U", area: "1 target", duration: "1 rnd", range: "10'", isAttack: false },
            { level: 3, name: "Self Size Changing", class: "U", area: "self", duration: "1 min/lvl", range: "self", isAttack: false },
            { level: 4, name: "Sprint", class: "U", area: "1 target", duration: "10 min/lvl", range: "10'", isAttack: false },
            { level: 5, name: "Change of Kind", class: "F", area: "1 target", duration: "10 min/lvl", range: "10'", isAttack: false },
            { level: 6, name: "Haste I", class: "U", area: "1 target", duration: "1 rnd", range: "10'", isAttack: false },
            { level: 7, name: "Speed III", class: "U", area: "varies", duration: "varies", range: "10'", isAttack: false },
            { level: 8, name: "Fast Sprint", class: "U", area: "1 target", duration: "10 min/lvl", range: "10'", isAttack: false },
            { level: 9, name: "Size Changing", class: "U", area: "1 target", duration: "10 min/lvl", range: "10'", isAttack: false },
            { level: 10, name: "Haste III", class: "U", area: "varies", duration: "varies", range: "10'", isAttack: false }
        ]
    },
    "Lofty Bridge": {
        profession: "Mage", realm: "Essence", type: "base",
        spells: [
            { level: 1, name: "Leaping", class: "U", area: "1 target", duration: "1 rnd", range: "100'", isAttack: false },
            { level: 2, name: "Landing", class: "U", area: "1 target", duration: "until lands", range: "100'", isAttack: false },
            { level: 3, name: "Leaving I", class: "U", area: "1 target", duration: "-", range: "10'", isAttack: false },
            { level: 4, name: "Levitation", class: "U", area: "1 target", duration: "1 min/lvl", range: "10'", isAttack: false },
            { level: 5, name: "Fly I", class: "U", area: "1 target", duration: "1 min/lvl", range: "10'", isAttack: false },
            { level: 6, name: "Portal", class: "F", area: "3'x6'x3'", duration: "1 rnd/lvl", range: "touch", isAttack: false },
            { level: 7, name: "Fly II", class: "U", area: "1 target", duration: "1 min/lvl", range: "10'", isAttack: false },
            { level: 8, name: "Long Door", class: "F", area: "1 target", duration: "-", range: "10'", isAttack: false },
            { level: 9, name: "Leaving III", class: "U", area: "1 target", duration: "-", range: "10'", isAttack: false },
            { level: 10, name: "Teleport", class: "U", area: "1 target", duration: "-", range: "10'", isAttack: false }
        ]
    }
};

// ============================================================
// HELPER: Get all spell lists available to a profession
// ============================================================
MERP.getSpellListsForProfession = function(profession) {
    const results = {};
    for (const [listName, listData] of Object.entries(MERP.spellListData)) {
        if (listData.profession === profession ||
            (profession === "Mage" && listData.profession === "open_essence") ||
            (profession === "Bard" && listData.profession === "open_essence") ||
            (profession === "Animist" && listData.profession === "open_channeling") ||
            (profession === "Ranger" && listData.profession === "open_channeling")) {
            results[listName] = listData;
        }
    }
    return results;
};

// ============================================================
// HELPER: Get all attack spells for a profession
// ============================================================
MERP.getAttackSpells = function(profession) {
    const lists = MERP.getSpellListsForProfession(profession);
    const spells = [];
    for (const [listName, listData] of Object.entries(lists)) {
        for (const spell of listData.spells) {
            if (spell.isAttack) {
                spells.push({
                    ...spell,
                    listName,
                    fullName: `${spell.name} (${listName} L${spell.level})`
                });
            }
        }
    }
    // Sort by level
    spells.sort((a, b) => a.level - b.level);
    return spells;
};

// ============================================================
// NPC / CREATURE TEMPLATES (from ICE2012 Creatures of Middle-earth)
// ============================================================
MERP.npcTemplates = {
    // ============================================================
    // ORCS & EVIL HUMANOIDS
    // ============================================================
    "Orc, Weak":          { level: 1, hits: 35, armor: "No Armor", db: 25, ob: 35, attackType: "Weapon", critType: "Regular", size: "Medium", attackDesc: "35We" },
    "Orc, Medium":        { level: 3, hits: 60, armor: "Rigid Leather", db: 30, ob: 60, attackType: "Weapon", critType: "Regular", size: "Medium", attackDesc: "60We" },
    "Orc, Strong":        { level: 5, hits: 85, armor: "Chain", db: 30, ob: 75, attackType: "Weapon", critType: "Regular", size: "Medium", attackDesc: "75We" },
    "Uruk-hai":           { level: 7, hits: 100, armor: "Chain", db: 30, ob: 85, attackType: "Weapon", critType: "Regular", size: "Medium", attackDesc: "85We" },
    "Olog-hai":           { level: 10, hits: 150, armor: "Plate", db: 45, ob: 160, attackType: "Weapon", critType: "Large", size: "Large", attackDesc: "160We" },
    "Half-orc":           { level: 4, hits: 70, armor: "Rigid Leather", db: 25, ob: 60, attackType: "Weapon", critType: "Regular", size: "Medium", attackDesc: "60Bi" },
    "Half-troll":         { level: 7, hits: 120, armor: "Chain", db: 30, ob: 90, attackType: "Weapon", critType: "Large", size: "Large", attackDesc: "90Gr" },

    // ============================================================
    // GENERIC NPC ARCHETYPES
    // ============================================================
    "Guard (Town)":       { level: 2, hits: 50, armor: "Chain", db: 15, ob: 40, attackType: "Weapon", critType: "Regular", size: "Medium", attackDesc: "40 Broadsword" },
    "Guard (Elite)":      { level: 5, hits: 80, armor: "Chain", db: 25, ob: 70, attackType: "Weapon", critType: "Regular", size: "Medium", attackDesc: "70 Broadsword" },
    "Bandit":             { level: 3, hits: 55, armor: "Soft Leather", db: 20, ob: 50, attackType: "Weapon", critType: "Regular", size: "Medium", attackDesc: "50 Short Sword" },
    "Bandit Leader":      { level: 6, hits: 90, armor: "Rigid Leather", db: 30, ob: 75, attackType: "Weapon", critType: "Regular", size: "Medium", attackDesc: "75 Broadsword" },
    "Thief":              { level: 4, hits: 50, armor: "Soft Leather", db: 30, ob: 45, attackType: "Weapon", critType: "Regular", size: "Medium", attackDesc: "45 Dagger" },
    "Peasant":            { level: 1, hits: 25, armor: "No Armor", db: 10, ob: 15, attackType: "Weapon", critType: "Regular", size: "Medium", attackDesc: "15 Club" },
    "Soldier (Gondor)":   { level: 4, hits: 70, armor: "Chain", db: 25, ob: 60, attackType: "Weapon", critType: "Regular", size: "Medium", attackDesc: "60 Broadsword" },
    "Knight (Gondor)":    { level: 8, hits: 110, armor: "Plate", db: 35, ob: 95, attackType: "Weapon", critType: "Regular", size: "Medium", attackDesc: "95 Broadsword" },
    "Rider of Rohan":     { level: 5, hits: 80, armor: "Chain", db: 25, ob: 70, attackType: "Weapon", critType: "Regular", size: "Medium", attackDesc: "70 Broadsword (mounted)" },
    "Dark Sorcerer (L5)": { level: 5, hits: 40, armor: "No Armor", db: 30, ob: 50, attackType: "Spell", critType: "Regular", size: "Medium", attackDesc: "50 Base Spell" },
    "Dark Sorcerer (L10)":{ level: 10, hits: 60, armor: "No Armor", db: 40, ob: 85, attackType: "Spell", critType: "Regular", size: "Medium", attackDesc: "85 Base Spell" },
    "Easterling Warrior":  { level: 4, hits: 65, armor: "Rigid Leather", db: 20, ob: 55, attackType: "Weapon", critType: "Regular", size: "Medium", attackDesc: "55 Scimitar" },
    "Haradrim Archer":    { level: 3, hits: 50, armor: "Soft Leather", db: 20, ob: 50, attackType: "Missile", critType: "Regular", size: "Medium", attackDesc: "50 Composite Bow" },
    "Dunlending Raider":  { level: 3, hits: 55, armor: "Soft Leather", db: 15, ob: 45, attackType: "Weapon", critType: "Regular", size: "Medium", attackDesc: "45 Handaxe" },
    "Corsair Sailor":     { level: 3, hits: 50, armor: "Soft Leather", db: 20, ob: 50, attackType: "Weapon", critType: "Regular", size: "Medium", attackDesc: "50 Scimitar" },
    "Nazgul":             { level: 20, hits: 200, armor: "Chain", db: 75, ob: 175, attackType: "Weapon/Spell", critType: "Huge", size: "Medium", attackDesc: "175We*" },

    // ============================================================
    // 8.1 MASTER ANIMAL TABLE - BATS AND BIRDS
    // ============================================================
    "Barrow Owl": { level: 1, hits: 20, armor: "No Armor", db: 30, ob: 35, attackType: "Claw", critType: "Regular", size: "Small", attackDesc: "35SCl" },
    "Bitterns": { level: 1, hits: 15, armor: "No Armor", db: 20, ob: 20, attackType: "Bash", critType: "Regular", size: "Medium", attackDesc: "20MBa" },
    "Black Swans": { level: 3, hits: 35, armor: "No Armor", db: 50, ob: 25, attackType: "Bash", critType: "Regular", size: "Medium", attackDesc: "25SSPi" },
    "Black Wings": { level: 1, hits: 8, armor: "No Armor", db: 50, ob: 30, attackType: "Claw", critType: "Regular", size: "Small", attackDesc: "30SCl" },
    "Cavern Birds": { level: 2, hits: 11, armor: "No Armor", db: 60, ob: 40, attackType: "Claw", critType: "Regular", size: "Small", attackDesc: "40MCl" },
    "Cliff Buzzards": { level: 1, hits: 30, armor: "No Armor", db: 50, ob: 30, attackType: "Claw", critType: "Regular", size: "Small", attackDesc: "30SPi" },
    "Crebain": { level: 2, hits: 15, armor: "No Armor", db: 65, ob: 25, attackType: "Claw", critType: "Regular", size: "Small", attackDesc: "25SSPi" },
    "Echo Hawks": { level: 1, hits: 27, armor: "No Armor", db: 50, ob: 50, attackType: "Claw", critType: "Regular", size: "Small", attackDesc: "50MCl" },
    "Great Eagles": { level: 15, hits: 300, armor: "No Armor", db: 60, ob: 95, attackType: "Claw", critType: "Huge", size: "Huge", attackDesc: "95HCl" },
    "Great Falcons (of Ardor)": { level: 10, hits: 150, armor: "Rigid Leather", db: 50, ob: 90, attackType: "Bite", critType: "Large", size: "Large", attackDesc: "90LBi" },
    "Great Falcons (of Mirkwood)": { level: 5, hits: 100, armor: "Soft Leather", db: 60, ob: 75, attackType: "Claw", critType: "Large", size: "Large", attackDesc: "75LCl" },
    "Gokotós": { level: 1, hits: 40, armor: "No Armor", db: 20, ob: 35, attackType: "Bash", critType: "Regular", size: "Medium", attackDesc: "35SPi" },
    "Courcrows": { level: 1, hits: 20, armor: "No Armor", db: 55, ob: 10, attackType: "Bite", critType: "Regular", size: "Small", attackDesc: "10SPi" },
    "Grass Greases": { level: 0, hits: 8, armor: "No Armor", db: 70, ob: 10, attackType: "Bash", critType: "Regular", size: "Small", attackDesc: "10TMBi" },
    "Great Bats": { level: 5, hits: 60, armor: "No Armor", db: 60, ob: 75, attackType: "Bite", critType: "Regular", size: "Medium", attackDesc: "75MBi" },
    "Green-winged Bats": { level: 2, hits: 15, armor: "No Armor", db: 40, ob: 30, attackType: "Bite", critType: "Regular", size: "Small", attackDesc: "30SBi" },
    "Humming Bats": { level: 9, hits: 15, armor: "No Armor", db: 55, ob: 50, attackType: "Bite", critType: "Regular", size: "Small", attackDesc: "50SSBi" },
    "Hunting Bats": { level: 2, hits: 120, armor: "No Armor", db: 30, ob: 80, attackType: "Bash", critType: "Regular", size: "Large", attackDesc: "80LPi" },
    "Jackdaws": { level: 1, hits: 120, armor: "No Armor", db: 30, ob: 20, attackType: "Bite", critType: "Regular", size: "Small", attackDesc: "20TPi" },
    "Kingfishers": { level: 1, hits: 8, armor: "No Armor", db: 60, ob: 20, attackType: "Bite", critType: "Regular", size: "Small", attackDesc: "20TPi" },
    "Kiriniki": { level: 0, hits: 5, armor: "No Armor", db: 55, ob: 5, attackType: "Bite", critType: "Regular", size: "Small", attackDesc: "5TPi" },
    "Orao": { level: 6, hits: 120, armor: "No Armor", db: 30, ob: 81, attackType: "Claw", critType: "Regular", size: "Large", attackDesc: "81MCl" },
    "Red Swans": { level: 1, hits: 35, armor: "No Armor", db: 20, ob: 40, attackType: "Bash", critType: "Regular", size: "Medium", attackDesc: "40MBa" },
    "Pond Bats": { level: 0, hits: 5, armor: "No Armor", db: 60, ob: 25, attackType: "Bite", critType: "Regular", size: "Small", attackDesc: "25TBi" },
    "Ravens": { level: 0, hits: 20, armor: "No Armor", db: 50, ob: 50, attackType: "Claw", critType: "Regular", size: "Medium", attackDesc: "50SCl" },
    "Red Eagles": { level: 4, hits: 75, armor: "No Armor", db: 40, ob: 70, attackType: "Claw", critType: "Regular", size: "Large", attackDesc: "70LCl" },
    "Sea Eagles": { level: 6, hits: 65, armor: "No Armor", db: 45, ob: 65, attackType: "Claw", critType: "Regular", size: "Large", attackDesc: "65MCl" },
    "Short-eared Owls": { level: 4, hits: 20, armor: "No Armor", db: 50, ob: 50, attackType: "Claw", critType: "Regular", size: "Small", attackDesc: "50SCl" },
    "Thrushes": { level: 0, hits: 6, armor: "No Armor", db: 60, ob: 15, attackType: "Bite", critType: "Regular", size: "Small", attackDesc: "15TPi" },
    "Vault Shrike": { level: 1, hits: 5, armor: "No Armor", db: 50, ob: 30, attackType: "Bash", critType: "Regular", size: "Small", attackDesc: "30TBi" },
    "Vereut Eagles": { level: 1, hits: 30, armor: "No Armor", db: 35, ob: 45, attackType: "Claw", critType: "Regular", size: "Small", attackDesc: "45MCl" },

    // ============================================================
    // 8.1 - WATER BEASTS
    // ============================================================
    "Carnantor": { level: 10, hits: 275, armor: "Rigid Leather", db: 40, ob: 95, attackType: "Bite", critType: "Large", size: "Huge", attackDesc: "95LBi" },
    "Cherethrýnd": { level: 12, hits: 550, armor: "Rigid Leather", db: 40, ob: 80, attackType: "Bash", critType: "Huge", size: "Huge", attackDesc: "80HBa" },
    "Eris Squids": { level: 1, hits: 20, armor: "No Armor", db: 50, ob: 40, attackType: "Grapple", critType: "Regular", size: "Small", attackDesc: "40SGr" },
    "Lamprey": { level: 1, hits: 15, armor: "No Armor", db: 20, ob: 30, attackType: "Grapple", critType: "Regular", size: "Small", attackDesc: "30TGr" },
    "Leeches": { level: 0, hits: 4, armor: "No Armor", db: 5, ob: 0, attackType: "Special", critType: "Regular", size: "Small", attackDesc: "special" },
    "Merchanthrais": { level: 1, hits: 65, armor: "No Armor", db: 35, ob: 60, attackType: "Crush", critType: "Regular", size: "Large", attackDesc: "60HCr" },
    "Mulkánar": { level: 6, hits: 225, armor: "Soft Leather", db: 20, ob: 30, attackType: "Hoof", critType: "Regular", size: "Large", attackDesc: "30HLBi" },
    "Nimacaryth": { level: 5, hits: 180, armor: "Rigid Leather", db: 30, ob: 45, attackType: "Bite", critType: "Regular", size: "Large", attackDesc: "45MBi" },
    "Pike": { level: 2, hits: 75, armor: "No Armor", db: 35, ob: 30, attackType: "Bite", critType: "Regular", size: "Medium", attackDesc: "30LBi" },
    "Suminrein": { level: 7, hits: 210, armor: "No Armor", db: 40, ob: 75, attackType: "Bite", critType: "Large", size: "Large", attackDesc: "75MBi" },
    "Snapper": { level: 5, hits: 140, armor: "Soft Leather", db: 10, ob: 70, attackType: "Bite", critType: "Regular", size: "Medium", attackDesc: "70MBa" },
    "Ulmodil": { level: 8, hits: 110, armor: "No Armor", db: 50, ob: 70, attackType: "Bite", critType: "Regular", size: "Medium", attackDesc: "70MBa" },
    "Vacuum Clams, Small": { level: 0, hits: 5, armor: "Plate", db: 0, ob: 0, attackType: "Special", critType: "Regular", size: "Small", attackDesc: "0TCr" },
    "Vacuum Clams, Large": { level: 3, hits: 160, armor: "Soft Leather", db: 30, ob: 60, attackType: "Crush", critType: "Regular", size: "Medium", attackDesc: "60MBa" },
    "Webs": { level: 7, hits: 260, armor: "Soft Leather", db: 15, ob: 90, attackType: "Grapple", critType: "Regular", size: "Large", attackDesc: "90LBa" },

    // ============================================================
    // 8.1 - REPTILES AND AMPHIBIANS (RAVATSAR)
    // ============================================================
    "Andokulóni": { level: 3, hits: 55, armor: "Soft Leather", db: 30, ob: 30, attackType: "Bite", critType: "Regular", size: "Small", attackDesc: "30SBa" },
    "Angusaiwéli": { level: 2, hits: 25, armor: "Soft Leather", db: 50, ob: 30, attackType: "Bite", critType: "Regular", size: "Small", attackDesc: "30SBi" },
    "Blue Terrapins": { level: 1, hits: 15, armor: "Rigid Leather", db: 30, ob: 6, attackType: "Bite", critType: "Regular", size: "Medium", attackDesc: "6SMBi" },
    "Coireals": { level: 2, hits: 30, armor: "No Armor", db: 40, ob: 55, attackType: "Bite", critType: "Regular", size: "Small", attackDesc: "55SBi" },
    "Egil's Vipers": { level: 8, hits: 100, armor: "No Armor", db: 60, ob: 75, attackType: "Bite", critType: "Regular", size: "Medium", attackDesc: "75MBi" },
    "Green Asps": { level: 0, hits: 5, armor: "No Armor", db: 40, ob: 0, attackType: "Bite", critType: "Regular", size: "Small", attackDesc: "0TBi" },
    "Grey Flyers": { level: 3, hits: 20, armor: "No Armor", db: 30, ob: 35, attackType: "Claw", critType: "Regular", size: "Small", attackDesc: "35SCl" },
    "Land Tortoises": { level: 4, hits: 75, armor: "Rigid Leather", db: 20, ob: 0, attackType: "Bash", critType: "Regular", size: "Medium", attackDesc: "0" },
    "Marsh Adders": { level: 8, hits: 20, armor: "No Armor", db: 60, ob: 50, attackType: "Bite", critType: "Regular", size: "Small", attackDesc: "50TSt" },
    "Marsh Crocodiles (in water)": { level: 3, hits: 120, armor: "No Armor", db: 10, ob: 80, attackType: "Bite", critType: "Regular", size: "Large", attackDesc: "80LBi" },
    "Marsh Crocodiles (on land)": { level: 1, hits: 120, armor: "No Armor", db: 0, ob: 40, attackType: "Bite", critType: "Regular", size: "Large", attackDesc: "40MBi" },
    "Necharim": { level: 1, hits: 30, armor: "No Armor", db: 60, ob: 40, attackType: "Sting", critType: "Regular", size: "Small", attackDesc: "40SSt" },
    "Nethairin Erdyr": { level: 1, hits: 20, armor: "No Armor", db: 50, ob: 30, attackType: "Sting", critType: "Regular", size: "Small", attackDesc: "30SSt" },
    "Nebraich": { level: 1, hits: 75, armor: "No Armor", db: 40, ob: 35, attackType: "Sting", critType: "Regular", size: "Small", attackDesc: "35SSt" },
    "Amabúch": { level: 4, hits: 25, armor: "No Armor", db: 45, ob: 65, attackType: "Claw", critType: "Regular", size: "Medium", attackDesc: "65MCl" },
    "Otrovastin": { level: 1, hits: 30, armor: "No Armor", db: 50, ob: 35, attackType: "Bite", critType: "Regular", size: "Small", attackDesc: "35SCl" },
    "Pedalvi": { level: 4, hits: 120, armor: "Rigid Leather", db: 25, ob: 80, attackType: "Bite", critType: "Regular", size: "Large", attackDesc: "80MCr" },
    "Rock Vipers": { level: 1, hits: 15, armor: "No Armor", db: 20, ob: 20, attackType: "Bite", critType: "Regular", size: "Small", attackDesc: "20SSt" },
    "Sea Crocodiles": { level: 6, hits: 245, armor: "Rigid Leather", db: 50, ob: 100, attackType: "Bite", critType: "Large", size: "Large", attackDesc: "100LBi" },
    "Shaking Asps": { level: 2, hits: 15, armor: "No Armor", db: 30, ob: 25, attackType: "Bite", critType: "Regular", size: "Small", attackDesc: "25SSt" },
    "Slow-fangs": { level: 10, hits: 120, armor: "No Armor", db: 30, ob: 0, attackType: "Bite", critType: "Regular", size: "Small", attackDesc: "0TBi" },
    "Truusv": { level: 1, hits: 10, armor: "No Armor", db: 30, ob: 0, attackType: "Bite", critType: "Regular", size: "Small", attackDesc: "0TBi" },
    "Umskinvi": { level: 1, hits: 8, armor: "No Armor", db: 30, ob: 30, attackType: "Bite", critType: "Regular", size: "Small", attackDesc: "30SCl" },
    "Zamakaivi": { level: 1, hits: 30, armor: "No Armor", db: 30, ob: 40, attackType: "Claw", critType: "Regular", size: "Medium", attackDesc: "40MCr" },
    "Zurkuvi": { level: 1, hits: 25, armor: "No Armor", db: 40, ob: 30, attackType: "Claw", critType: "Regular", size: "Small", attackDesc: "30SCl" },

    // ============================================================
    // 8.1 - INSECTS (POTILI)
    // ============================================================
    "Cliff Hornets": { level: 1, hits: 1, armor: "No Armor", db: 40, ob: 5, attackType: "Sting", critType: "Regular", size: "Small", attackDesc: "5SSt" },
    "Gélyngyl": { level: 5, hits: 45, armor: "Soft Leather", db: 30, ob: 45, attackType: "Sting", critType: "Regular", size: "Small", attackDesc: "45SPi" },
    "Ground Bees": { level: 0, hits: 1, armor: "No Armor", db: 40, ob: 0, attackType: "Sting", critType: "Regular", size: "Small", attackDesc: "0TSt" },
    "Mabelmaikli": { level: 4, hits: 155, armor: "Rigid Leather", db: 25, ob: 80, attackType: "Crush", critType: "Regular", size: "Large", attackDesc: "80MPi" },
    "Neckerbrekers": { level: 0, hits: 1, armor: "No Armor", db: 45, ob: 10, attackType: "Bite", critType: "Regular", size: "Small", attackDesc: "10TBi" },
    "Morgur Flies": { level: 0, hits: 2, armor: "No Armor", db: 35, ob: 15, attackType: "Bite", critType: "Regular", size: "Small", attackDesc: "15TBi" },
    "Ulcercain": { level: 0, hits: 3, armor: "No Armor", db: 45, ob: 25, attackType: "Sting", critType: "Regular", size: "Small", attackDesc: "25TPi" },

    // ============================================================
    // 8.1 - LEAF-EATERS (LASSAMADIN)
    // ============================================================
    "Aurych": { level: 2, hits: 95, armor: "No Armor", db: 30, ob: 35, attackType: "Bash", critType: "Regular", size: "Medium", attackDesc: "35MHo" },
    "Caru": { level: 2, hits: 140, armor: "No Armor", db: 20, ob: 50, attackType: "Hoof", critType: "Regular", size: "Medium", attackDesc: "50MHo" },
    "Colramix": { level: 1, hits: 70, armor: "No Armor", db: 40, ob: 20, attackType: "Bash", critType: "Regular", size: "Medium", attackDesc: "20MHo" },
    "Gasrad": { level: 0, hits: 10, armor: "No Armor", db: 10, ob: 5, attackType: "Bash", critType: "Regular", size: "Small", attackDesc: "5SBi" },
    "Burael Deer": { level: 1, hits: 50, armor: "No Armor", db: 45, ob: 20, attackType: "Hoof", critType: "Regular", size: "Small", attackDesc: "20SHo" },
    "Fimirnorë": { level: 2, hits: 70, armor: "No Armor", db: 35, ob: 15, attackType: "Bash", critType: "Regular", size: "Small", attackDesc: "15SSCl" },
    "Goral": { level: 1, hits: 55, armor: "No Armor", db: 40, ob: 50, attackType: "Bash", critType: "Regular", size: "Medium", attackDesc: "50MBa" },
    "Kine of Araw": { level: 5, hits: 135, armor: "No Armor", db: 30, ob: 100, attackType: "Hoof", critType: "Regular", size: "Large", attackDesc: "100LHo" },
    "Losrandir": { level: 2, hits: 90, armor: "No Armor", db: 20, ob: 40, attackType: "Hoof", critType: "Regular", size: "Large", attackDesc: "40MHo" },
    "Nimfiara": { level: 4, hits: 110, armor: "No Armor", db: 25, ob: 55, attackType: "Hoof", critType: "Regular", size: "Large", attackDesc: "55MHo" },
    "Ruinossi": { level: 3, hits: 65, armor: "No Armor", db: 30, ob: 60, attackType: "Bash", critType: "Regular", size: "Medium", attackDesc: "60MBa" },
    "Szetanyi": { level: 2, hits: 50, armor: "No Armor", db: 40, ob: 40, attackType: "Bite", critType: "Regular", size: "Medium", attackDesc: "40SBa" },
    "Wild Goats": { level: 3, hits: 60, armor: "No Armor", db: 25, ob: 40, attackType: "Bash", critType: "Regular", size: "Medium", attackDesc: "40MBa" },

    // ============================================================
    // 8.1 - RIDING AND DRAFT ANIMALS
    // ============================================================
    "Andamundar": { level: 7, hits: 210, armor: "Soft Leather", db: 30, ob: 110, attackType: "Crush", critType: "Large", size: "Huge", attackDesc: "110LCr" },
    "Devevi, runners": { level: 4, hits: 350, armor: "Rigid Leather", db: 30, ob: 85, attackType: "Hoof", critType: "Large", size: "Huge", attackDesc: "85HBa" },
    "Devevi, workers": { level: 3, hits: 130, armor: "No Armor", db: 10, ob: 30, attackType: "Bash", critType: "Regular", size: "Large", attackDesc: "30MBa" },
    "Elven Horses": { level: 10, hits: 100, armor: "No Armor", db: 60, ob: 40, attackType: "Hoof", critType: "Regular", size: "Large", attackDesc: "40MCr" },
    "Horses of Mordor": { level: 9, hits: 100, armor: "No Armor", db: 25, ob: 85, attackType: "Hoof", critType: "Regular", size: "Large", attackDesc: "85HBa" },
    "Losandamundar": { level: 7, hits: 170, armor: "Soft Leather", db: 25, ob: 30, attackType: "Bash", critType: "Regular", size: "Large", attackDesc: "30MBa" },
    "Marsh Ponies": { level: 2, hits: 100, armor: "No Armor", db: 20, ob: 30, attackType: "Hoof", critType: "Regular", size: "Medium", attackDesc: "30MLTs" },
    "Mearas": { level: 8, hits: 170, armor: "No Armor", db: 50, ob: 100, attackType: "Hoof", critType: "Regular", size: "Large", attackDesc: "100MCr" },
    "Mumakil": { level: 7, hits: 400, armor: "Rigid Leather", db: 25, ob: 95, attackType: "Crush", critType: "Large", size: "Huge", attackDesc: "95HBa" },
    "Wild Horses": { level: 6, hits: 120, armor: "No Armor", db: 40, ob: 40, attackType: "Hoof", critType: "Regular", size: "Large", attackDesc: "40MCr" },
    "Zurukuvi": { level: 3, hits: 135, armor: "No Armor", db: 45, ob: 75, attackType: "Crush", critType: "Regular", size: "Large", attackDesc: "75MCr" },

    // ============================================================
    // 8.1 - PREDATORS (MEAT-EATERS / APSANNAKIN)
    // ============================================================
    "Black Bears": { level: 5, hits: 150, armor: "Soft Leather", db: 20, ob: 65, attackType: "Claw", critType: "Large", size: "Large", attackDesc: "65LGr" },
    "Black Minks": { level: 1, hits: 50, armor: "Soft Leather", db: 30, ob: 50, attackType: "Bite", critType: "Regular", size: "Medium", attackDesc: "50MBi" },
    "Blue Bears": { level: 10, hits: 200, armor: "Soft Leather", db: 40, ob: 80, attackType: "Claw", critType: "Large", size: "Large", attackDesc: "80LCl" },
    "Blue Otters": { level: 1, hits: 80, armor: "No Armor", db: 25, ob: 40, attackType: "Claw", critType: "Regular", size: "Medium", attackDesc: "40SGr" },
    "Cave Bears": { level: 12, hits: 300, armor: "Soft Leather", db: 40, ob: 95, attackType: "Claw", critType: "Large", size: "Huge", attackDesc: "95HCl" },
    "Chetmig": { level: 5, hits: 150, armor: "Soft Leather", db: 20, ob: 75, attackType: "Bite", critType: "Regular", size: "Large", attackDesc: "75LCl" },
    "Cliff Lions": { level: 5, hits: 140, armor: "Soft Leather", db: 20, ob: 85, attackType: "Bite", critType: "Regular", size: "Large", attackDesc: "85LBi" },
    "Death Shrews": { level: 4, hits: 2, armor: "Rigid Leather", db: 70, ob: 85, attackType: "Bite", critType: "Regular", size: "Small", attackDesc: "85TBi" },
    "Dire Wolves, Adult": { level: 4, hits: 80, armor: "Soft Leather", db: 45, ob: 75, attackType: "Bite", critType: "Regular", size: "Large", attackDesc: "75LBa" },
    "Dire Wolves, Young": { level: 2, hits: 40, armor: "No Armor", db: 35, ob: 60, attackType: "Bite", critType: "Regular", size: "Medium", attackDesc: "60LBi" },
    "Dunmen's Dogs": { level: 1, hits: 30, armor: "No Armor", db: 40, ob: 45, attackType: "Bite", critType: "Regular", size: "Small", attackDesc: "45SBi" },
    "Fishing Cats": { level: 1, hits: 50, armor: "No Armor", db: 50, ob: 30, attackType: "Claw", critType: "Regular", size: "Small", attackDesc: "30MCl" },
    "Gich": { level: 2, hits: 45, armor: "No Armor", db: 50, ob: 40, attackType: "Bite", critType: "Regular", size: "Small", attackDesc: "40MBi" },
    "Giant Martens": { level: 4, hits: 75, armor: "No Armor", db: 50, ob: 60, attackType: "Bite", critType: "Regular", size: "Medium", attackDesc: "60MBi" },
    "Glutani": { level: 2, hits: 50, armor: "No Armor", db: 50, ob: 40, attackType: "Claw", critType: "Regular", size: "Medium", attackDesc: "40MCl" },
    "Grass Cats": { level: 1, hits: 100, armor: "No Armor", db: 50, ob: 40, attackType: "Claw", critType: "Regular", size: "Small", attackDesc: "40MCl" },
    "Grey Wolves": { level: 4, hits: 110, armor: "No Armor", db: 30, ob: 35, attackType: "Bite", critType: "Regular", size: "Medium", attackDesc: "35LBi" },
    "Highland Lynxes": { level: 2, hits: 70, armor: "No Armor", db: 35, ob: 45, attackType: "Claw", critType: "Regular", size: "Small", attackDesc: "45MCl" },
    "Hounds": { level: 3, hits: 45, armor: "No Armor", db: 55, ob: 45, attackType: "Bite", critType: "Regular", size: "Small", attackDesc: "45MBi" },
    "Madratines": { level: 2, hits: 70, armor: "No Armor", db: 65, ob: 63, attackType: "Bite", critType: "Regular", size: "Small", attackDesc: "63SBi" },
    "Marsh Mastiffs": { level: 2, hits: 45, armor: "No Armor", db: 60, ob: 30, attackType: "Bite", critType: "Regular", size: "Small", attackDesc: "30SCl" },
    "Merise Tyka": { level: 3, hits: 60, armor: "Soft Leather", db: 40, ob: 50, attackType: "Bite", critType: "Regular", size: "Medium", attackDesc: "50MBi" },
    "North Bears": { level: 7, hits: 240, armor: "Soft Leather", db: 45, ob: 45, attackType: "Bash", critType: "Regular", size: "Large", attackDesc: "45MBa" },
    "Red Foxes": { level: 1, hits: 45, armor: "No Armor", db: 50, ob: 45, attackType: "Bite", critType: "Regular", size: "Small", attackDesc: "45SBa" },
    "Red Wolves": { level: 2, hits: 130, armor: "Soft Leather", db: 45, ob: 70, attackType: "Bite", critType: "Regular", size: "Large", attackDesc: "70LBi" },
    "Sheep-Hounds": { level: 1, hits: 140, armor: "Soft Leather", db: 55, ob: 80, attackType: "Bite", critType: "Regular", size: "Large", attackDesc: "80MBi" },
    "Sloth Bears": { level: 5, hits: 325, armor: "Soft Leather", db: 10, ob: 100, attackType: "Bite", critType: "Large", size: "Large", attackDesc: "100HBi" },
    "Spotted Lions": { level: 7, hits: 140, armor: "Soft Leather", db: 35, ob: 85, attackType: "Claw", critType: "Regular", size: "Large", attackDesc: "85LCl" },
    "Unceavi": { level: 3, hits: 90, armor: "No Armor", db: 35, ob: 80, attackType: "Claw", critType: "Regular", size: "Medium", attackDesc: "80LCl" },
    "Vuk": { level: 3, hits: 110, armor: "No Armor", db: 40, ob: 70, attackType: "Bite", critType: "Regular", size: "Medium", attackDesc: "70MBi" },
    "Yukarlak": { level: 1, hits: 170, armor: "Soft Leather", db: 50, ob: 85, attackType: "Bite", critType: "Regular", size: "Large", attackDesc: "85LBi" },
    "War-wolves": { level: 7, hits: 170, armor: "Soft Leather", db: 50, ob: 83, attackType: "Bite", critType: "Regular", size: "Large", attackDesc: "83LBi" },
    "White Foxes": { level: 1, hits: 40, armor: "No Armor", db: 70, ob: 35, attackType: "Bite", critType: "Regular", size: "Small", attackDesc: "35SBi" },
    "White Wolves": { level: 8, hits: 140, armor: "No Armor", db: 70, ob: 50, attackType: "Bite", critType: "Regular", size: "Medium", attackDesc: "50MBi" },

    // ============================================================
    // 8.1 - OTHER DANGEROUS ANIMALS
    // ============================================================
    "Boars": { level: 1, hits: 120, armor: "No Armor", db: 40, ob: 30, attackType: "Bash", critType: "Regular", size: "Medium", attackDesc: "30SBi" },
    "Fen Boars": { level: 1, hits: 100, armor: "No Armor", db: 30, ob: 40, attackType: "Bash", critType: "Regular", size: "Medium", attackDesc: "40MHo" },
    "Grey Apes": { level: 1, hits: 100, armor: "No Armor", db: 30, ob: 30, attackType: "Bash", critType: "Regular", size: "Medium", attackDesc: "30SBi" },
    "Majmun": { level: 1, hits: 25, armor: "No Armor", db: 40, ob: 95, attackType: "Crush", critType: "Huge", size: "Huge", attackDesc: "95HCr" },
    "Slirdu": { level: 7, hits: 240, armor: "No Armor", db: 30, ob: 90, attackType: "Bite", critType: "Regular", size: "Large", attackDesc: "90MBa" },
    "Uvag-Aak": { level: 6, hits: 140, armor: "No Armor", db: 20, ob: 50, attackType: "Crush", critType: "Regular", size: "Large", attackDesc: "50MBa" },

    // ============================================================
    // 8.2 MASTER MONSTER TABLE - DEMONIC WATER MONSTERS
    // ============================================================
    "Demon-whales": { level: 25, hits: 500, armor: "Soft Leather", db: 25, ob: 120, attackType: "Bash", critType: "Huge", size: "Huge", attackDesc: "120HBa" },
    "Fell Turtles": { level: 15, hits: 250, armor: "Plate", db: 35, ob: 120, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "120HBi" },
    "Ninivet": { level: 9, hits: 130, armor: "Soft Leather", db: 10, ob: 70, attackType: "Bite", critType: "Large", size: "Large", attackDesc: "70LBa" },
    "Red Jaws": { level: 4, hits: 90, armor: "Soft Leather", db: 35, ob: 90, attackType: "Bite", critType: "Regular", size: "Medium", attackDesc: "90Bi" },
    "Vodyanoi": { level: 1, hits: 55, armor: "Soft Leather", db: 40, ob: 60, attackType: "Crush", critType: "Regular", size: "Large", attackDesc: "60HBa" },
    "Watcher in the Water": { level: 35, hits: 400, armor: "Rigid Leather", db: 40, ob: 150, attackType: "Grapple", critType: "Huge", size: "Huge", attackDesc: "150HGr" },

    // ============================================================
    // 8.2 - EVIL HUORNS AND TREES
    // ============================================================
    "Evil Huorns": { level: 30, hits: 400, armor: "Plate", db: 0, ob: 80, attackType: "Crush", critType: "Huge", size: "Huge", attackDesc: "80HBa" },
    "Evil Trees": { level: 3, hits: 50, armor: "Rigid Leather", db: 10, ob: 20, attackType: "Crush", critType: "Regular", size: "Large", attackDesc: "20SGr" },

    // ============================================================
    // 8.2 - DEMONS
    // ============================================================
    "Balrogs": { level: 50, hits: 400, armor: "Plate", db: 90, ob: 275, attackType: "Weapon", critType: "Huge", size: "Huge", attackDesc: "275Wkstl" },
    "Black Demons": { level: 30, hits: 175, armor: "Rigid Leather", db: 50, ob: 120, attackType: "Claw", critType: "Huge", size: "Large", attackDesc: "120HCl" },
    "Lassaraukar, Lesser": { level: 15, hits: 225, armor: "Rigid Leather", db: 50, ob: 150, attackType: "Crush", critType: "Large", size: "Large", attackDesc: "150dkr" },
    "Lassaraukar, Greater": { level: 25, hits: 210, armor: "No Armor", db: 80, ob: 100, attackType: "Crush", critType: "Large", size: "Large", attackDesc: "100LCr" },
    "Vampires of Morgoth": { level: 25, hits: 400, armor: "Soft Leather", db: 50, ob: 27, attackType: "Special", critType: "Huge", size: "Huge", attackDesc: "special" },

    // ============================================================
    // 8.2 - DRAGONS
    // ============================================================
    "Cave Drakes": { level: 13, hits: 250, armor: "Plate", db: 40, ob: 90, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "90HBi" },
    "Cave Worms": { level: 10, hits: 160, armor: "Rigid Leather", db: 20, ob: 90, attackType: "Bite", critType: "Large", size: "Large", attackDesc: "90LBi" },
    "Cold-drakes": { level: 30, hits: 500, armor: "Plate", db: 50, ob: 120, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "120HBi" },
    "Ice-drakes": { level: 30, hits: 450, armor: "Plate", db: 50, ob: 110, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "110HBi" },
    "Land Drakes": { level: 18, hits: 350, armor: "Plate", db: 40, ob: 100, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "100HBi" },
    "Winged Cold-drakes": { level: 30, hits: 450, armor: "Chain", db: 60, ob: 100, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "100HBi" },
    "Fire-drakes": { level: 35, hits: 200, armor: "Plate", db: 50, ob: 60, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "60HBi" },
    "Marsh-drakes": { level: 15, hits: 240, armor: "Rigid Leather", db: 40, ob: 150, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "150HBa" },
    "Rain-drakes": { level: 12, hits: 200, armor: "Rigid Leather", db: 40, ob: 100, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "100HBi" },
    "Water-drakes": { level: 18, hits: 150, armor: "Plate", db: 25, ob: 100, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "100HBi" },
    "Sand Drakes": { level: 8, hits: 350, armor: "No Armor", db: 50, ob: 110, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "110HBi" },
    "Were-worms": { level: 8, hits: 350, armor: "Rigid Leather", db: 55, ob: 120, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "120LBi" },

    // ============================================================
    // 8.2 - FLYING MONSTERS
    // ============================================================
    "Flying Crebain": { level: 3, hits: 25, armor: "No Armor", db: 50, ob: 20, attackType: "Claw", critType: "Regular", size: "Small", attackDesc: "20SPi" },
    "Fell Beasts": { level: 20, hits: 240, armor: "Rigid Leather", db: 50, ob: 90, attackType: "Claw", critType: "Large", size: "Huge", attackDesc: "90LCr" },

    // ============================================================
    // 8.2 - GIANT RACES
    // ============================================================
    "Giants": { level: 25, hits: 250, armor: "Rigid Leather", db: 30, ob: 95, attackType: "Weapon", critType: "Large", size: "Large", attackDesc: "95We" },
    "Trolls, Cave": { level: 12, hits: 250, armor: "Rigid Leather", db: 25, ob: 110, attackType: "Weapon", critType: "Large", size: "Large", attackDesc: "110We" },
    "Trolls, Forest": { level: 6, hits: 150, armor: "Rigid Leather", db: 15, ob: 95, attackType: "Crush", critType: "Large", size: "Large", attackDesc: "95LCl" },
    "Trolls, Hill": { level: 10, hits: 175, armor: "Rigid Leather", db: 20, ob: 70, attackType: "Crush", critType: "Large", size: "Large", attackDesc: "70LCl" },
    "Trolls, Mountain": { level: 11, hits: 240, armor: "Rigid Leather", db: 40, ob: 120, attackType: "Bash", critType: "Large", size: "Large", attackDesc: "120We" },
    "Trolls, Snow": { level: 13, hits: 180, armor: "Rigid Leather", db: 30, ob: 105, attackType: "Crush", critType: "Large", size: "Large", attackDesc: "105HCl" },
    "Trolls, Stone": { level: 7, hits: 230, armor: "Rigid Leather", db: 15, ob: 80, attackType: "Bash", critType: "Large", size: "Large", attackDesc: "80LBa" },
    "Trolls, Black (Olog)": { level: 9, hits: 250, armor: "Rigid Leather", db: 50, ob: 120, attackType: "Weapon", critType: "Large", size: "Large", attackDesc: "120We" },

    // ============================================================
    // 8.2 - PUKEL-CREATURES
    // ============================================================
    "Colbran": { level: 18, hits: 200, armor: "Chain", db: 70, ob: 150, attackType: "Bash", critType: "Large", size: "Large", attackDesc: "150LBa" },
    "Hurndaen": { level: 15, hits: 200, armor: "Plate", db: 30, ob: 100, attackType: "Crush", critType: "Large", size: "Large", attackDesc: "100LGr" },
    "Hurnkennec": { level: 10, hits: 130, armor: "Plate", db: 40, ob: 80, attackType: "Crush", critType: "Large", size: "Large", attackDesc: "80MPr" },
    "Mendaen": { level: 8, hits: 150, armor: "Chain", db: 20, ob: 60, attackType: "Crush", critType: "Large", size: "Large", attackDesc: "60LCr" },
    "Mensharag": { level: 5, hits: 80, armor: "Plate", db: 25, ob: 90, attackType: "Bash", critType: "Regular", size: "Medium", attackDesc: "90We" },
    "Púkel-men": { level: 1, hits: 150, armor: "Chain", db: 40, ob: 60, attackType: "Bash", critType: "Regular", size: "Large", attackDesc: "60MBa" },
    "Silent Watchers": { level: 15, hits: 150, armor: "Plate", db: 25, ob: 0, attackType: "Special", critType: "Large", size: "Large", attackDesc: "special" },

    // ============================================================
    // 8.2 - GIANT SPIDERS AND INSECTS
    // ============================================================
    "Giant Spiders, Lesser": { level: 8, hits: 160, armor: "Soft Leather", db: 40, ob: 70, attackType: "Sting", critType: "Regular", size: "Large", attackDesc: "70LPi" },
    "Giant Spiders, Greater": { level: 3, hits: 35, armor: "Rigid Leather", db: 50, ob: 120, attackType: "Sting", critType: "Large", size: "Large", attackDesc: "120MPr" },
    "Hummerhorns": { level: 1, hits: 55, armor: "No Armor", db: 50, ob: 40, attackType: "Bash", critType: "Regular", size: "Medium", attackDesc: "40MBr" },
    "King Spiders": { level: 12, hits: 165, armor: "Chain", db: 75, ob: 30, attackType: "Bite", critType: "Large", size: "Large", attackDesc: "30We" },

    // ============================================================
    // 8.2 - UNDEAD BEINGS
    // ============================================================
    "Barrow Wights": { level: 15, hits: 165, armor: "No Armor", db: 75, ob: 90, attackType: "Weapon", critType: "Regular", size: "Medium", attackDesc: "90We" },
    "Corpse Candles": { level: 7, hits: 100, armor: "No Armor", db: 30, ob: 60, attackType: "Special", critType: "Regular", size: "Medium", attackDesc: "60MBa" },
    "Corpse Lanterns": { level: 1, hits: 135, armor: "No Armor", db: 40, ob: 110, attackType: "Special", critType: "Regular", size: "Medium", attackDesc: "110We" },
    "Ghosts, Lesser": { level: 1, hits: 100, armor: "No Armor", db: 30, ob: 25, attackType: "Special", critType: "Regular", size: "Medium", attackDesc: "25SBa" },
    "Ghosts, Greater": { level: 10, hits: 165, armor: "Soft Leather", db: 10, ob: 60, attackType: "Special", critType: "Regular", size: "Medium", attackDesc: "special" },
    "Ghouls, Lesser": { level: 1, hits: 75, armor: "No Armor", db: 10, ob: 40, attackType: "Bite", critType: "Regular", size: "Medium", attackDesc: "40SBa" },
    "Ghouls, Greater": { level: 2, hits: 55, armor: "No Armor", db: 0, ob: 45, attackType: "Claw", critType: "Regular", size: "Medium", attackDesc: "45We" },
    "Lesinavi": { level: 4, hits: 100, armor: "No Armor", db: 10, ob: 40, attackType: "Special", critType: "Regular", size: "Medium", attackDesc: "40MBa" },
    "Mewlips": { level: 2, hits: 135, armor: "No Armor", db: 0, ob: 50, attackType: "Weapon", critType: "Regular", size: "Medium", attackDesc: "50We" },
    "Sand Devils": { level: 15, hits: 150, armor: "Soft Leather", db: 100, ob: 40, attackType: "Special", critType: "Regular", size: "Medium", attackDesc: "special" },
    "Skeletons, Minor": { level: 1, hits: 75, armor: "No Armor", db: 10, ob: 80, attackType: "Weapon", critType: "Regular", size: "Medium", attackDesc: "80 Shock Bolt" },
    "Skeletons, Lesser": { level: 3, hits: 25, armor: "No Armor", db: 0, ob: 95, attackType: "Weapon", critType: "Regular", size: "Medium", attackDesc: "95We" },
    "Skeletons, Greater": { level: 5, hits: 50, armor: "No Armor", db: 10, ob: 70, attackType: "Weapon", critType: "Regular", size: "Medium", attackDesc: "70LBa" },
    "Skeletons, Lord": { level: 8, hits: 30, armor: "No Armor", db: 70, ob: 75, attackType: "Weapon", critType: "Regular", size: "Medium", attackDesc: "75LBi" },
    "Specters, Lesser": { level: 5, hits: 150, armor: "No Armor", db: 100, ob: 70, attackType: "Special", critType: "Regular", size: "Medium", attackDesc: "70Spcl" },
    "Specters, Greater": { level: 10, hits: 200, armor: "No Armor", db: 75, ob: 80, attackType: "Special", critType: "Regular", size: "Medium", attackDesc: "80 Shock Bolt" },
    "Swamp Stars": { level: 9, hits: 30, armor: "No Armor", db: 45, ob: 75, attackType: "Special", critType: "Regular", size: "Medium", attackDesc: "75MCl" },
    "Ta-Fa-Lisch": { level: 7, hits: 180, armor: "Soft Leather", db: 60, ob: 120, attackType: "Bite", critType: "Large", size: "Large", attackDesc: "120LBi" },
    "Wargs": { level: 8, hits: 250, armor: "No Armor", db: 55, ob: 130, attackType: "Bite", critType: "Regular", size: "Large", attackDesc: "130LBi" },
    "Werewolves": { level: 12, hits: 350, armor: "No Armor", db: 85, ob: 95, attackType: "Claw", critType: "Regular", size: "Large", attackDesc: "95HCl" },

    // ============================================================
    // 8.3 SPECIFIC CREATURE TABLE - GREAT EAGLES & FALCONS & RAVENS
    // ============================================================
    "Thorondor": { level: 60, hits: 550, armor: "Rigid Leather", db: 100, ob: 300, attackType: "Claw", critType: "Huge", size: "Huge", attackDesc: "300HCl" },
    "Gwaihir": { level: 45, hits: 350, armor: "Rigid Leather", db: 80, ob: 150, attackType: "Claw", critType: "Huge", size: "Huge", attackDesc: "150HCl" },
    "Landroval": { level: 39, hits: 300, armor: "Rigid Leather", db: 90, ob: 150, attackType: "Claw", critType: "Huge", size: "Huge", attackDesc: "150HCl" },
    "Sulroch": { level: 15, hits: 150, armor: "Soft Leather", db: 90, ob: 110, attackType: "Claw", critType: "Huge", size: "Large", attackDesc: "110LCl" },
    "Elroa": { level: 20, hits: 180, armor: "Soft Leather", db: 75, ob: 130, attackType: "Claw", critType: "Huge", size: "Huge", attackDesc: "130LCl" },
    "Gilsul": { level: 18, hits: 170, armor: "Soft Leather", db: 75, ob: 120, attackType: "Claw", critType: "Huge", size: "Large", attackDesc: "120LCl" },
    "Roac": { level: 6, hits: 30, armor: "No Armor", db: 40, ob: 55, attackType: "Claw", critType: "Regular", size: "Small", attackDesc: "55SCl" },
    "The Old Thrush": { level: 3, hits: 15, armor: "No Armor", db: 50, ob: 25, attackType: "Bash", critType: "Regular", size: "Small", attackDesc: "25TPi" },

    // ============================================================
    // 8.3 - HORSES
    // ============================================================
    "Nahar": { level: 45, hits: 400, armor: "Soft Leather", db: 120, ob: 200, attackType: "Hoof", critType: "Large", size: "Large", attackDesc: "200LCr" },
    "Nimros": { level: 15, hits: 300, armor: "Soft Leather", db: 80, ob: 100, attackType: "Hoof", critType: "Large", size: "Large", attackDesc: "100MCr" },
    "Rochallor": { level: 25, hits: 210, armor: "Soft Leather", db: 100, ob: 160, attackType: "Hoof", critType: "Large", size: "Large", attackDesc: "160LCr" },
    "Mordor Horse": { level: 9, hits: 170, armor: "Soft Leather", db: 50, ob: 110, attackType: "Hoof", critType: "Large", size: "Large", attackDesc: "110LCr" },
    "Felaróf": { level: 15, hits: 250, armor: "Soft Leather", db: 70, ob: 150, attackType: "Hoof", critType: "Large", size: "Large", attackDesc: "150LCr" },
    "Shadowfax": { level: 12, hits: 210, armor: "Soft Leather", db: 60, ob: 120, attackType: "Hoof", critType: "Large", size: "Large", attackDesc: "120MCr" },
    "Snowmane": { level: 10, hits: 170, armor: "Soft Leather", db: 50, ob: 110, attackType: "Hoof", critType: "Large", size: "Large", attackDesc: "110MCr" },

    // ============================================================
    // 8.3 - HOUNDS, BOARS & TREES
    // ============================================================
    "Huan": { level: 18, hits: 350, armor: "Soft Leather", db: 120, ob: 220, attackType: "Bite", critType: "Huge", size: "Large", attackDesc: "220LBi" },
    "Evechar Boar": { level: 7, hits: 190, armor: "Soft Leather", db: 0, ob: 110, attackType: "Crush", critType: "Large", size: "Large", attackDesc: "110MCr" },
    "Old Man Willow": { level: 25, hits: 450, armor: "Plate", db: 0, ob: 75, attackType: "Crush", critType: "Huge", size: "Huge", attackDesc: "75HCr" },
    "Sleeping Klow": { level: 50, hits: 600, armor: "Plate", db: 125, ob: 60, attackType: "Crush", critType: "Huge", size: "Huge", attackDesc: "60HGr" },

    // ============================================================
    // 8.3 - DEMONS
    // ============================================================
    "Gothmog": { level: 100, hits: 666, armor: "Plate", db: 115, ob: 450, attackType: "Weapon", critType: "Huge", size: "Huge", attackDesc: "450We" },
    "Durin's Bane": { level: 66, hits: 420, armor: "Plate", db: 90, ob: 275, attackType: "Weapon", critType: "Huge", size: "Huge", attackDesc: "275We" },
    "Lungorthin": { level: 90, hits: 566, armor: "Plate", db: 100, ob: 415, attackType: "Weapon", critType: "Huge", size: "Huge", attackDesc: "415We" },
    "Sjpardach": { level: 17, hits: 170, armor: "No Armor", db: 40, ob: 100, attackType: "Special", critType: "Huge", size: "Large", attackDesc: "100special" },
    "Demons of Agbrand, Leahy": { level: 14, hits: 150, armor: "Rigid Leather", db: 40, ob: 150, attackType: "Crush", critType: "Large", size: "Large", attackDesc: "150LCl" },
    "Demons of Agbrand, Mourfuin": { level: 10, hits: 300, armor: "Rigid Leather", db: 80, ob: 250, attackType: "Crush", critType: "Large", size: "Large", attackDesc: "250whl" },
    "Demons of Agbrand, Bazard": { level: 20, hits: 250, armor: "Rigid Leather", db: 40, ob: 30, attackType: "Crush", critType: "Large", size: "Large", attackDesc: "30HCl" },
    "Wind of Taurung, Aur": { level: 6, hits: 60, armor: "Soft Leather", db: 20, ob: 70, attackType: "Special", critType: "Regular", size: "Large", attackDesc: "70Spcl" },
    "Wind of Taurung, Kax": { level: 12, hits: 100, armor: "Soft Leather", db: 30, ob: 100, attackType: "Special", critType: "Regular", size: "Large", attackDesc: "100Spcl" },
    "Wind of Taurung, Eus": { level: 18, hits: 130, armor: "Soft Leather", db: 40, ob: 120, attackType: "Special", critType: "Regular", size: "Large", attackDesc: "120Spcl" },
    "Wind of Taurung, Gan": { level: 24, hits: 160, armor: "Soft Leather", db: 50, ob: 130, attackType: "Special", critType: "Regular", size: "Large", attackDesc: "130Spcl" },
    "Wind of Taurung, Ior": { level: 30, hits: 201, armor: "Soft Leather", db: 70, ob: 180, attackType: "Special", critType: "Regular", size: "Large", attackDesc: "180Spcl" },
    "Wind of Taurung, Kel": { level: 36, hits: 240, armor: "Soft Leather", db: 80, ob: 200, attackType: "Special", critType: "Regular", size: "Large", attackDesc: "200Spcl" },

    // ============================================================
    // 8.3 - NAMED DRAGONS
    // ============================================================
    "Agburanar": { level: 31, hits: 463, armor: "Plate", db: 50, ob: 120, attackType: "Claw", critType: "Huge", size: "Huge", attackDesc: "120HCl" },
    "Ando-anca": { level: 49, hits: 400, armor: "Plate", db: 40, ob: 150, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "150HBi" },
    "Culgor": { level: 30, hits: 401, armor: "Chain", db: 60, ob: 120, attackType: "Claw", critType: "Huge", size: "Huge", attackDesc: "120HCl" },
    "Emburghidspo": { level: 30, hits: 300, armor: "Rigid Leather", db: 40, ob: 110, attackType: "Claw", critType: "Huge", size: "Huge", attackDesc: "110HGr" },
    "Goestir": { level: 40, hits: 475, armor: "Plate", db: 45, ob: 130, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "130HBi" },
    "Huanrith": { level: 33, hits: 456, armor: "Plate", db: 55, ob: 115, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "115HBi" },
    "Hyarlóca": { level: 28, hits: 329, armor: "Plate", db: 60, ob: 90, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "90HBi" },
    "Kipaar": { level: 29, hits: 365, armor: "Rigid Leather", db: 65, ob: 95, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "95HBi" },
    "Lamirtanc": { level: 43, hits: 510, armor: "Plate", db: 55, ob: 145, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "145HBi" },
    "Lastalaika": { level: 37, hits: 487, armor: "Plate", db: 45, ob: 135, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "135HBi" },
    "Merkampa": { level: 47, hits: 533, armor: "Plate", db: 60, ob: 135, attackType: "Claw", critType: "Huge", size: "Huge", attackDesc: "135HCl" },
    "Niocepa": { level: 30, hits: 360, armor: "Plate", db: 70, ob: 120, attackType: "Grapple", critType: "Huge", size: "Huge", attackDesc: "120LGr" },
    "Scatha": { level: 52, hits: 555, armor: "Plate", db: 65, ob: 150, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "150HBi" },
    "Lomaw": { level: 35, hits: 467, armor: "Plate", db: 50, ob: 120, attackType: "Claw", critType: "Huge", size: "Huge", attackDesc: "120HCl" },
    "Nimanaur": { level: 32, hits: 451, armor: "Plate", db: 60, ob: 120, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "120HBi" },
    "Bairanax": { level: 34, hits: 447, armor: "Chain", db: 60, ob: 100, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "100HBi" },
    "Daoloman": { level: 33, hits: 428, armor: "Chain", db: 70, ob: 125, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "125HBi" },
    "Dyaca": { level: 35, hits: 422, armor: "Chain", db: 70, ob: 130, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "130HBi" },
    "Khuzadrepa": { level: 37, hits: 460, armor: "Chain", db: 60, ob: 130, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "130HBi" },
    "Ancalagon": { level: 100, hits: 1238, armor: "Plate", db: 275, ob: 450, attackType: "Claw", critType: "Huge", size: "Huge", attackDesc: "450HBi" },
    "Angurth": { level: 55, hits: 590, armor: "Plate", db: 60, ob: 285, attackType: "Claw", critType: "Huge", size: "Huge", attackDesc: "285HCl" },
    "Glaurung": { level: 85, hits: 600, armor: "Plate", db: 110, ob: 355, attackType: "Claw", critType: "Huge", size: "Huge", attackDesc: "355HBi" },
    "Iargan": { level: 34, hits: 471, armor: "Plate", db: 60, ob: 160, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "160HBi" },
    "Leucaruth": { level: 55, hits: 500, armor: "Plate", db: 60, ob: 100, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "100HBi" },
    "Ruingurth": { level: 66, hits: 646, armor: "Plate", db: 30, ob: 100, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "100HBi" },
    "Smaug": { level: 46, hits: 523, armor: "Chain", db: 75, ob: 125, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "125HBi" },
    "Throkmaw": { level: 30, hits: 439, armor: "Plate", db: 65, ob: 105, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "105HBi" },
    "Uthuial": { level: 75, hits: 500, armor: "Plate", db: 55, ob: 125, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "125HBi" },
    "Itangast": { level: 36, hits: 495, armor: "Plate", db: 30, ob: 125, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "125HBi" },

    // ============================================================
    // 8.3 - NAMED FLYING MONSTERS & GIANT SPIDERS
    // ============================================================
    "Ungoliant": { level: 450, hits: 275, armor: "Plate", db: 275, ob: 450, attackType: "Special", critType: "Huge", size: "Huge", attackDesc: "450HBi" },
    "Thuringwethil": { level: 500, hits: 325, armor: "Plate", db: 90, ob: 520, attackType: "Special", critType: "Huge", size: "Huge", attackDesc: "520HBi" },
    "Fell Beast (named)": { level: 35, hits: 200, armor: "Rigid Leather", db: 50, ob: 95, attackType: "Claw", critType: "Large", size: "Huge", attackDesc: "95HCl" },
    "Daelosha": { level: 25, hits: 285, armor: "Rigid Leather", db: 60, ob: 80, attackType: "Sting", critType: "Large", size: "Huge", attackDesc: "80HCl" },
    "Erna Sarah": { level: 20, hits: 375, armor: "No Armor", db: 70, ob: 80, attackType: "Sting", critType: "Large", size: "Huge", attackDesc: "80 Shock Bolt" },
    "Shelob": { level: 50, hits: 500, armor: "No Armor", db: 80, ob: 95, attackType: "Sting", critType: "Large", size: "Huge", attackDesc: "95HCl" },

    // ============================================================
    // 8.3 - NAMED WEREWOLVES & UNDEAD BEINGS
    // ============================================================
    "Caran-Carach": { level: 16, hits: 200, armor: "Rigid Leather", db: 50, ob: 130, attackType: "Bite", critType: "Regular", size: "Large", attackDesc: "130LBi" },
    "Carcharoth": { level: 18, hits: 310, armor: "Rigid Leather", db: 80, ob: 200, attackType: "Bite", critType: "Regular", size: "Large", attackDesc: "200LBi" },
    "Drauguin": { level: 20, hits: 366, armor: "Rigid Leather", db: 90, ob: 210, attackType: "Bite", critType: "Regular", size: "Large", attackDesc: "210LBi" }
};

// ============================================================
// NPC CATEGORIES for dropdown grouping
// ============================================================
MERP.npcCategories = {
    "Bats & Birds": ["Great Eagles", "Great Falcons (of Ardor)", "Great Falcons (of Mirkwood)", "Great Bats", "Hunting Bats", "Crebain", "Red Eagles", "Sea Eagles", "Vereut Eagles", "Orao", "Barrow Owl", "Echo Hawks"],
    "Water Beasts": ["Carnantor", "Cherethrýnd", "Eris Squids", "Merchanthrais", "Mulkánar", "Pike", "Suminrein", "Webs", "Snapper", "Lamprey"],
    "Reptiles & Amphibians": ["Egil's Vipers", "Marsh Crocodiles (in water)", "Marsh Crocodiles (on land)", "Sea Crocodiles", "Rock Vipers", "Shaking Asps", "Slow-fangs", "Coireals", "Grey Flyers", "Angusaiwéli", "Blue Terrapins", "Marsh Adders", "Amabúch", "Pedalvi"],
    "Insects": ["Cliff Hornets", "Gélyngyl", "Mabelmaikli", "Neckerbrekers", "Ulcercain"],
    "Leaf-eaters": ["Kine of Araw", "Mumakil", "Nimfiara", "Caru", "Losrandir", "Wild Goats", "Aurych"],
    "Riding & Draft Animals": ["Andamundar", "Devevi, runners", "Devevi, workers", "Elven Horses", "Horses of Mordor", "Losandamundar", "Marsh Ponies", "Mearas", "Wild Horses", "Zurukuvi"],
    "Predators": ["Cave Bears", "Blue Bears", "Black Bears", "North Bears", "Sloth Bears", "Spotted Lions", "Cliff Lions", "Dire Wolves, Adult", "Dire Wolves, Young", "Grey Wolves", "Red Wolves", "White Wolves", "War-wolves", "Sheep-Hounds", "Hounds", "Dunmen's Dogs", "Grass Cats", "Highland Lynxes", "Giant Martens", "Merise Tyka", "Red Foxes", "White Foxes", "Vuk", "Yukarlak", "Chetmig", "Black Minks", "Blue Otters", "Death Shrews", "Marsh Mastiffs"],
    "Other Dangerous Animals": ["Boars", "Fen Boars", "Grey Apes", "Majmun", "Slirdu", "Uvag-Aak"],
    "Demonic Water Monsters": ["Demon-whales", "Fell Turtles", "Ninivet", "Red Jaws", "Vodyanoi", "Watcher in the Water"],
    "Evil Huorns & Trees": ["Evil Huorns", "Evil Trees"],
    "Demons": ["Balrogs", "Black Demons", "Lassaraukar, Lesser", "Lassaraukar, Greater", "Vampires of Morgoth"],
    "Dragons & Drakes": ["Cave Drakes", "Cave Worms", "Cold-drakes", "Ice-drakes", "Land Drakes", "Winged Cold-drakes", "Fire-drakes", "Marsh-drakes", "Rain-drakes", "Water-drakes", "Sand Drakes", "Were-worms"],
    "Flying Monsters": ["Flying Crebain", "Fell Beasts"],
    "Giants & Trolls": ["Giants", "Trolls, Cave", "Trolls, Forest", "Trolls, Hill", "Trolls, Mountain", "Trolls, Snow", "Trolls, Stone", "Trolls, Black (Olog)"],
    "Púkel-Creatures": ["Colbran", "Hurndaen", "Hurnkennec", "Mendaen", "Mensharag", "Púkel-men", "Silent Watchers"],
    "Giant Spiders & Insects": ["Giant Spiders, Lesser", "Giant Spiders, Greater", "Hummerhorns", "King Spiders"],
    "Undead": ["Barrow Wights", "Corpse Candles", "Corpse Lanterns", "Ghosts, Lesser", "Ghosts, Greater", "Ghouls, Lesser", "Ghouls, Greater", "Lesinavi", "Mewlips", "Sand Devils", "Skeletons, Minor", "Skeletons, Lesser", "Skeletons, Greater", "Skeletons, Lord", "Specters, Lesser", "Specters, Greater", "Swamp Stars", "Ta-Fa-Lisch", "Wargs", "Werewolves"],
    "Named Eagles & Birds": ["Thorondor", "Gwaihir", "Landroval", "Sulroch", "Elroa", "Gilsul", "Roac", "The Old Thrush"],
    "Named Horses": ["Nahar", "Nimros", "Rochallor", "Mordor Horse", "Felaróf", "Shadowfax", "Snowmane"],
    "Named Hounds, Boars & Trees": ["Huan", "Evechar Boar", "Old Man Willow", "Sleeping Klow"],
    "Named Demons": ["Gothmog", "Durin's Bane", "Lungorthin", "Sjpardach", "Demons of Agbrand, Leahy", "Demons of Agbrand, Mourfuin", "Demons of Agbrand, Bazard", "Wind of Taurung, Aur", "Wind of Taurung, Kax", "Wind of Taurung, Eus", "Wind of Taurung, Gan", "Wind of Taurung, Ior", "Wind of Taurung, Kel"],
    "Named Dragons": ["Agburanar", "Ando-anca", "Culgor", "Emburghidspo", "Goestir", "Huanrith", "Hyarlóca", "Kipaar", "Lamirtanc", "Lastalaika", "Merkampa", "Niocepa", "Scatha", "Lomaw", "Nimanaur", "Bairanax", "Daoloman", "Dyaca", "Khuzadrepa", "Ancalagon", "Angurth", "Glaurung", "Iargan", "Leucaruth", "Ruingurth", "Smaug", "Throkmaw", "Uthuial", "Itangast"],
    "Named Monsters": ["Ungoliant", "Thuringwethil", "Fell Beast (named)", "Daelosha", "Erna Sarah", "Shelob", "Caran-Carach", "Carcharoth", "Drauguin"],
    "Orcs & Evil Humanoids": ["Orc, Weak", "Orc, Medium", "Orc, Strong", "Uruk-hai", "Olog-hai", "Half-orc", "Half-troll"],
    "Generic NPCs": ["Guard (Town)", "Guard (Elite)", "Bandit", "Bandit Leader", "Thief", "Peasant", "Soldier (Gondor)", "Knight (Gondor)", "Rider of Rohan", "Easterling Warrior", "Haradrim Archer", "Dunlending Raider", "Corsair Sailor"],
    "Evil Spell Users": ["Dark Sorcerer (L5)", "Dark Sorcerer (L10)", "Nazgul"]
};
