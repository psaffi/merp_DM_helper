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
// NPC / CREATURE TEMPLATES (from ST-2)
// ============================================================
MERP.npcTemplates = {
    // ============================================================
    // COMMON NPCs (humanoid)
    // ============================================================
    "Orc, Weak":          { level: 1, hits: 35, armor: "No Armor", db: 25, ob: 35, attackType: "Weapon", critType: "Regular", size: "Medium", attackDesc: "35We" },
    "Orc, Medium":        { level: 3, hits: 60, armor: "Rigid Leather", db: 30, ob: 60, attackType: "Weapon", critType: "Regular", size: "Medium", attackDesc: "60We" },
    "Orc, Strong":        { level: 5, hits: 85, armor: "Chain", db: 30, ob: 75, attackType: "Weapon", critType: "Regular", size: "Medium", attackDesc: "75We" },
    "Uruk-hai":           { level: 7, hits: 100, armor: "Chain", db: 30, ob: 85, attackType: "Weapon", critType: "Regular", size: "Medium", attackDesc: "85We" },
    "Olog-hai":           { level: 10, hits: 150, armor: "Plate", db: 45, ob: 160, attackType: "Weapon", critType: "Large", size: "Large", attackDesc: "160We" },
    "Half-orc":           { level: 4, hits: 70, armor: "Rigid Leather", db: 25, ob: 60, attackType: "Weapon", critType: "Regular", size: "Medium", attackDesc: "60Bi" },
    "Half-troll":         { level: 7, hits: 120, armor: "Chain", db: 30, ob: 90, attackType: "Weapon", critType: "Large", size: "Large", attackDesc: "90Gr" },

    // ============================================================
    // SPECIAL TOLKIEN MONSTERS
    // ============================================================
    "Troll":              { level: 12, hits: 180, armor: "Rigid Leather", db: 35, ob: 150, attackType: "Crush", critType: "Large", size: "Huge", attackDesc: "150Cl" },
    "Wild Troll":         { level: 10, hits: 140, armor: "Soft Leather", db: 30, ob: 120, attackType: "Crush", critType: "Large", size: "Large", attackDesc: "120Cl" },
    "Warg":               { level: 8, hits: 150, armor: "No Armor", db: 55, ob: 90, attackType: "Bite", critType: "Regular", size: "Large", attackDesc: "90Bi" },
    "Fell Beast":         { level: 20, hits: 210, armor: "Chain", db: 35, ob: 95, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "95Bi*" },
    "Nazgul":             { level: 20, hits: 200, armor: "Chain", db: 75, ob: 175, attackType: "Weapon/Spell", critType: "Huge", size: "Medium", attackDesc: "175We*" },
    "Balrog":             { level: 60, hits: 400, armor: "Plate", db: 60, ob: 240, attackType: "Weapon/Spell", critType: "Huge", size: "Huge", attackDesc: "240We*" },
    "Dragon":             { level: 25, hits: 260, armor: "Plate", db: 40, ob: 175, attackType: "Bite/Claw", critType: "Huge", size: "Huge", attackDesc: "175Bi*" },
    "Giant":              { level: 20, hits: 350, armor: "Rigid Leather", db: 30, ob: 140, attackType: "Crush", critType: "Huge", size: "Huge", attackDesc: "140Ra*" },
    "Huorn":              { level: 20, hits: 350, armor: "Chain", db: 20, ob: 75, attackType: "Crush", critType: "Large", size: "Huge", attackDesc: "75Pi" },
    "Ent (Onodrim)":      { level: 35, hits: 400, armor: "Plate", db: 30, ob: 170, attackType: "Crush", critType: "Huge", size: "Huge", attackDesc: "170Fa*" },
    "Mumakil":            { level: 7, hits: 300, armor: "Rigid Leather", db: 25, ob: 85, attackType: "Crush", critType: "Large", size: "Huge", attackDesc: "85Ra" },
    "Kraken, Small":      { level: 15, hits: 150, armor: "No Armor", db: 50, ob: 75, attackType: "Grapple", critType: "Medium", size: "Medium", attackDesc: "75Gr*" },
    "Kraken, Large":      { level: 35, hits: 400, armor: "Rigid Leather", db: 40, ob: 150, attackType: "Grapple", critType: "Huge", size: "Huge", attackDesc: "150Gr*" },
    "Mewlip":             { level: 4, hits: 60, armor: "No Armor", db: 35, ob: 55, attackType: "Weapon", critType: "Regular", size: "Medium", attackDesc: "55We" },
    "Spider, Great":      { level: 5, hits: 50, armor: "Chain", db: 20, ob: 60, attackType: "Sting", critType: "Medium", size: "Medium", attackDesc: "60Pi*" },
    "Spider, Huge":       { level: 12, hits: 180, armor: "Rigid Leather", db: 35, ob: 150, attackType: "Sting", critType: "Large", size: "Large", attackDesc: "150Bi*" },
    "Vampire":            { level: 15, hits: 150, armor: "No Armor", db: 65, ob: 100, attackType: "Bite/Claw", critType: "Huge", size: "Medium", attackDesc: "100Cl*" },
    "Werewolf":           { level: 10, hits: 250, armor: "Rigid Leather", db: 65, ob: 120, attackType: "Bite", critType: "Huge", size: "Large", attackDesc: "120Bi*" },
    "Wight, Minor":       { level: 10, hits: 100, armor: "No Armor", db: 40, ob: 95, attackType: "Weapon/Spell", critType: "Large", size: "Medium", attackDesc: "95We*" },
    "Wight, Lesser":      { level: 15, hits: 125, armor: "No Armor", db: 50, ob: 115, attackType: "Weapon/Spell", critType: "Large", size: "Medium", attackDesc: "115We*" },
    "Wight, Major":       { level: 25, hits: 175, armor: "No Armor", db: 60, ob: 170, attackType: "Weapon/Spell", critType: "Huge", size: "Medium", attackDesc: "170We*" },
    "Crebain":            { level: 2, hits: 10, armor: "No Armor", db: 50, ob: 25, attackType: "Bite", critType: "Regular", size: "Small", attackDesc: "25Bi" },
    "Eagles, Great":      { level: 30, hits: 250, armor: "Rigid Leather", db: 60, ob: 110, attackType: "Claw", critType: "Huge", size: "Huge", attackDesc: "110Pi*" },
    "Hummerthorn":        { level: 3, hits: 35, armor: "No Armor", db: 50, ob: 50, attackType: "Sting", critType: "Regular", size: "Medium", attackDesc: "50Ho" },
    "Festitycellyn":      { level: 15, hits: 250, armor: "Plate", db: 35, ob: 120, attackType: "Crush", critType: "Huge", size: "Huge", attackDesc: "120Pi" },

    // ============================================================
    // NORMAL ANIMALS
    // ============================================================
    "Wolf":               { level: 3, hits: 110, armor: "Soft Leather", db: 30, ob: 70, attackType: "Bite", critType: "Regular", size: "Large", attackDesc: "70Bi" },
    "Bear, Large":        { level: 3, hits: 150, armor: "Soft Leather", db: 30, ob: 70, attackType: "Claw/Bite", critType: "Regular", size: "Large", attackDesc: "70Ra" },
    "Bear, Giant":        { level: 7, hits: 250, armor: "Soft Leather", db: 40, ob: 95, attackType: "Claw/Bite", critType: "Regular", size: "Huge", attackDesc: "95Ra" },
    "Dog, Large":         { level: 3, hits: 110, armor: "Soft Leather", db: 25, ob: 70, attackType: "Bite", critType: "Regular", size: "Large", attackDesc: "70Bi" },
    "Horse, Large":       { level: 3, hits: 140, armor: "No Armor", db: 30, ob: 45, attackType: "Hoof", critType: "Regular", size: "Large", attackDesc: "45Ra" },
    "Shark, Large":       { level: 3, hits: 120, armor: "Soft Leather", db: 30, ob: 75, attackType: "Bite", critType: "Huge", size: "Huge", attackDesc: "75Bi" },
    "Snake, Large":       { level: 2, hits: 20, armor: "No Armor", db: 30, ob: 35, attackType: "Bite", critType: "Regular", size: "Small", attackDesc: "35Ho" },
    "Boar":               { level: 3, hits: 110, armor: "Soft Leather", db: 40, ob: 55, attackType: "Tusk", critType: "Regular", size: "Large", attackDesc: "55Ho" },
    "Elk":                { level: 4, hits: 230, armor: "Soft Leather", db: 35, ob: 75, attackType: "Antler/Hoof", critType: "Regular", size: "Huge", attackDesc: "75Ra" },
    "Bull":               { level: 3, hits: 190, armor: "No Armor", db: 25, ob: 50, attackType: "Horn", critType: "Regular", size: "Large", attackDesc: "50Ra" },
    "Cat, Large":         { level: 3, hits: 100, armor: "Soft Leather", db: 35, ob: 80, attackType: "Claw", critType: "Regular", size: "Medium", attackDesc: "80Cl" },

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
    "Corsair Sailor":     { level: 3, hits: 50, armor: "Soft Leather", db: 20, ob: 50, attackType: "Weapon", critType: "Regular", size: "Medium", attackDesc: "50 Scimitar" }
};

// ============================================================
// NPC CATEGORIES for dropdown grouping
// ============================================================
MERP.npcCategories = {
    "Orcs & Evil Humanoids": ["Orc, Weak", "Orc, Medium", "Orc, Strong", "Uruk-hai", "Olog-hai", "Half-orc", "Half-troll"],
    "Tolkien Monsters": ["Troll", "Wild Troll", "Warg", "Fell Beast", "Nazgul", "Balrog", "Dragon", "Giant", "Huorn", "Ent (Onodrim)", "Mumakil", "Kraken, Small", "Kraken, Large", "Spider, Great", "Spider, Huge", "Vampire", "Werewolf", "Festitycellyn"],
    "Undead": ["Wight, Minor", "Wight, Lesser", "Wight, Major"],
    "Animals": ["Wolf", "Bear, Large", "Bear, Giant", "Dog, Large", "Horse, Large", "Shark, Large", "Snake, Large", "Boar", "Elk", "Bull", "Cat, Large"],
    "Flying Creatures": ["Crebain", "Eagles, Great", "Hummerthorn", "Mewlip"],
    "Generic NPCs": ["Guard (Town)", "Guard (Elite)", "Bandit", "Bandit Leader", "Thief", "Peasant", "Soldier (Gondor)", "Knight (Gondor)", "Rider of Rohan", "Easterling Warrior", "Haradrim Archer", "Dunlending Raider", "Corsair Sailor"],
    "Evil Spell Users": ["Dark Sorcerer (L5)", "Dark Sorcerer (L10)"]
};
