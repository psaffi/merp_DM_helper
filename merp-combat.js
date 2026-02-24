// MERP 2nd Edition - Combat Management Module

// ============================================================
// DICE ROLLING
// ============================================================
MERP.rollD100 = function() {
    return Math.floor(Math.random() * 100) + 1;
};

MERP.rollD10 = function() {
    return Math.floor(Math.random() * 10) + 1;
};

// Open-ended roll: if 96-100 (high), roll again and add.
// If 01-05 (low), roll again and subtract.
MERP.openEndedRoll = function() {
    let roll = MERP.rollD100();
    let total = roll;
    const rolls = [roll];

    // High open-ended
    if (roll >= 96) {
        let extra;
        do {
            extra = MERP.rollD100();
            rolls.push(extra);
            total += extra;
        } while (extra >= 96);
    }
    // Low open-ended
    else if (roll <= 5) {
        let extra;
        do {
            extra = MERP.rollD100();
            rolls.push(-extra);
            total -= extra;
        } while (extra >= 96);
    }

    return { total, rolls, openEnded: rolls.length > 1 };
};

// ============================================================
// COMBAT RESOLVER
// ============================================================
MERP.CombatResolver = {
    // Resolve a melee/missile attack
    resolveAttack: function(params) {
        const {
            attackerOB = 0,       // Total offensive bonus
            defenderDB = 0,       // Total defensive bonus
            roll = null,          // Manual roll input (null = auto-roll)
            weaponName = null,    // Weapon being used
            attackTable = null,   // Override attack table
            armorType = "No Armor", // Defender's armor
            modifiers = {}        // {flank, rear, surprised, stunnedOrDown, etc}
        } = params;

        // Determine attack table
        let tableName = attackTable;
        if (!tableName && weaponName && MERP.weapons[weaponName]) {
            tableName = MERP.weapons[weaponName].attackTable;
        }
        if (!tableName) tableName = "AT1"; // Default

        // Calculate total modifiers
        let totalMod = 0;
        if (modifiers.flank) totalMod += MERP.combatMods.flank;
        if (modifiers.rear) totalMod += MERP.combatMods.rear;
        if (modifiers.surprised) totalMod += MERP.combatMods.surprised;
        if (modifiers.stunnedOrDown) totalMod += MERP.combatMods.stunnedOrDown;
        if (modifiers.drawingWeapon) totalMod += MERP.combatMods.drawingWeapon;
        if (modifiers.halfHitsTaken) totalMod += MERP.combatMods.halfHitsTaken;
        if (modifiers.feetMoved) totalMod += Math.floor(modifiers.feetMoved / 10) * MERP.combatMods.perTenFeetMoved;
        if (modifiers.custom) totalMod += modifiers.custom;

        // Roll or use provided roll
        let rollResult;
        if (roll !== null) {
            // Manual roll - check for open-ended
            rollResult = { total: roll, rolls: [roll], openEnded: false };
        } else {
            rollResult = MERP.openEndedRoll();
        }

        // Calculate modified roll for table lookup
        // Modified result = OB - DB + roll + modifiers
        const modifiedRoll = attackerOB - defenderDB + rollResult.total + totalMod;

        // Armor column index
        const armorCol = MERP.armorCols[armorType] !== undefined ? MERP.armorCols[armorType] : 4;

        // Check for fumble (UM range with unmodified roll 01-08)
        let fumbleCheck = false;
        const rawRoll = rollResult.rolls[0]; // First (unmodified) roll
        const weapon = MERP.weapons[weaponName];
        if (weapon && rawRoll >= weapon.fumble[0] && rawRoll <= weapon.fumble[1]) {
            fumbleCheck = true;
        }

        // Look up on attack table
        const attackResult = MERP.lookupAttackTable(tableName, modifiedRoll, armorCol);

        // Build result object
        const result = {
            roll: rollResult,
            modifiedRoll,
            attackerOB,
            defenderDB,
            totalMod,
            armorType,
            weapon: weaponName,
            attackTable: tableName,
            hits: attackResult.hits,
            criticalLetter: attackResult.crit,
            fumble: fumbleCheck || attackResult.fumble,
            criticalResult: null,
            fumbleResult: null
        };

        return result;
    },

    // Resolve a critical hit
    resolveCritical: function(params) {
        const {
            critType = "Slash",    // Critical table type
            severity = "C",        // A, B, C, D, E
            roll = null,           // Manual roll (null = auto)
            weaponName = null,     // For determining crit type from weapon
            isLargeCreature = false,
            isSuperLargeCreature = false
        } = params;

        // Determine critical type
        let actualCritType = critType;
        if (weaponName && MERP.weapons[weaponName]) {
            actualCritType = MERP.weapons[weaponName].primaryCrit;
        }

        // Use large/super-large creature table if applicable
        // Physical crits (Slash, Puncture, Crush, Unbalance, Grapple) → Large Creature or Super Large Creature
        // Spell crits (Heat, Cold, Electricity, Impact) → Large Spell
        if (isLargeCreature) {
            if (actualCritType === "Slash" || actualCritType === "Puncture" ||
                actualCritType === "Crush" || actualCritType === "Unbalance" ||
                actualCritType === "Grapple") {
                actualCritType = isSuperLargeCreature ? "Super Large Creature" : "Large Creature";
            } else {
                actualCritType = "Large Spell";
            }
        }

        // Roll
        let critRoll;
        if (roll !== null) {
            critRoll = { total: roll, rolls: [roll], openEnded: false };
        } else {
            critRoll = MERP.openEndedRoll();
        }

        // Apply severity modifier
        const sevMod = MERP.critSeverityMod[severity] || 0;
        const modifiedRoll = critRoll.total + sevMod;

        // Look up critical result
        const critResult = MERP.lookupCritical(actualCritType, modifiedRoll);

        return {
            roll: critRoll,
            severity,
            severityMod: sevMod,
            modifiedRoll,
            critType: actualCritType,
            hits: critResult.hits,
            text: critResult.text
        };
    },

    // Resolve a fumble
    resolveFumble: function(params) {
        const {
            fumbleType = 1,  // 1=Hand Arms, 2=Missile, 3=Spell, 4=Moving Maneuver
            roll = null,
            modifier = 0     // Weapon type modifier
        } = params;

        let fumbleRoll;
        if (roll !== null) {
            fumbleRoll = { total: roll, rolls: [roll], openEnded: false };
        } else {
            fumbleRoll = MERP.openEndedRoll();
        }

        const modifiedRoll = fumbleRoll.total + modifier;
        const result = MERP.lookupFumble(fumbleType, modifiedRoll);

        return {
            roll: fumbleRoll,
            modifier,
            modifiedRoll,
            fumbleTable: fumbleType,
            text: result.text
        };
    },

    // Resolve a resistance roll
    resolveResistanceRoll: function(params) {
        const {
            targetLevel = 1,
            attackLevel = 1,
            targetRRBonus = 0,
            roll = null,
            baseModifier = 0  // From AT-9 or spell effect
        } = params;

        const needed = MERP.lookupResistanceRoll(targetLevel, attackLevel);

        let rrRoll;
        if (roll !== null) {
            rrRoll = { total: roll, rolls: [roll], openEnded: false };
        } else {
            rrRoll = MERP.openEndedRoll();
        }

        const modifiedRoll = rrRoll.total + targetRRBonus + baseModifier;
        const success = modifiedRoll >= needed;

        return {
            roll: rrRoll,
            needed,
            targetRRBonus,
            baseModifier,
            modifiedRoll,
            success,
            text: success ? "Resisted!" : "Failed to resist."
        };
    },

    // Resolve a maneuver
    resolveManeuver: function(params) {
        const {
            type = "moving",        // "moving" or "static"
            difficulty = "Medium",
            skillBonus = 0,
            roll = null,
            customMod = 0
        } = params;

        const diffMod = MERP.maneuverDifficulty[difficulty] || 0;

        let manRoll;
        if (roll !== null) {
            manRoll = { total: roll, rolls: [roll], openEnded: false };
        } else {
            manRoll = MERP.openEndedRoll();
        }

        const total = manRoll.total + skillBonus + diffMod + customMod;

        let result;
        if (type === "moving") {
            result = MERP.movingManeuverResult(total);
        } else {
            result = MERP.staticManeuverResult(total);
        }

        return {
            roll: manRoll,
            skillBonus,
            difficultyMod: diffMod,
            customMod,
            total,
            ...result
        };
    }
};
