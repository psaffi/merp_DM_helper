# MERP GM Assistant

A browser-based Game Master assistant for **Middle-earth Role Playing (MERP) 2nd Edition** by Iron Crown Enterprises (ICE). No server required -- just open `index.html` in any modern browser.

To download on GitHub, click on the Green button for Code and select Download as a ZIP file.

## Features

### Character Management
- **5-step character creation wizard**: Stats &rarr; Race &rarr; Profession &rarr; Skills &rarr; Details
- 17+ playable races with stat bonuses and resistance roll modifiers
- 6 professions with development point cost tables
- Skill management with adolescence ranks and level-up tracking
- Characters saved to localStorage; export/import via JSON

### Battle Tracker
- Full initiative-based combat round management
- Add player characters or NPC creatures from a library of **300+ creatures**
- Attack resolution: OB vs DB, weapon selection, armor type, automatic attack table lookup
- Critical hit resolution across 11 critical tables (Slash, Puncture, Crush, Spell criticals, etc.)
- Fumble resolution across 4 fumble tables
- Parry slider for splitting OB between attack and defense
- **Status effects**: Stun, prone, bleeding, broken limbs, unconscious -- with automatic round tracking
- Bleeding auto-damage applied each round
- Resistance roll resolution with level-based target numbers
- Moving and static maneuver resolution
- Open-ended d100 rolls (high open-ended on 96+, low open-ended on 01-05)
- Battle log with undo support

### NPC/Creature Database
Over 300 creatures with PDF-accurate stats from the ICE2012 *Creatures of Middle-earth* sourcebook, organized into 26 categories:

| Category | Examples |
|----------|----------|
| Bats & Birds | Great Eagles, Crebain, Hunting Bats |
| Water Beasts | Carnantor, Watcher in the Water |
| Reptiles & Amphibians | Sea Crocodiles, Marsh Adders |
| Predators | Cave Bears, Dire Wolves, War-wolves |
| Dragons & Drakes | Cold-drakes, Fire-drakes, Cave Drakes |
| Giants & Trolls | Cave Trolls, Mountain Trolls, Stone Trolls |
| Undead | Barrow Wights, Wargs, Werewolves, Specters |
| Demons | Balrogs, Black Demons, Lassaraukar |
| Named Dragons | Smaug, Glaurung, Ancalagon, Scatha |
| Named Demons | Gothmog, Durin's Bane, Lungorthin |
| Generic NPCs | Guards, Bandits, Soldiers, Knights |
| ...and more | Pukel-creatures, Giant Spiders, Evil Huorns |

Each creature includes: Level, Hits, Armor Type, DB, OB, Attack Type, Critical Type, Size, and Attack Description.

### Reference Tables
- 9 attack tables (AT-1 through AT-9)
- 11 critical strike tables (Slash, Puncture, Crush, Unbalance, Grapple, Electricity, Cold, Heat, Impact, Large Creature, Large Spell)
- 4 fumble tables (Hand Arms, Missile, Spell, Moving Maneuver)
- Resistance Roll table
- Maneuver difficulty system
- Full weapon stats with fumble ranges and critical types

## Getting Started

1. **Download or clone** this repository
2. **Open `index.html`** in any modern web browser (Chrome, Firefox, Edge, Safari)
3. That's it -- no server, no build step, no dependencies

### Tabs

- **Characters**: Create and manage player characters
- **Combat**: Run battles with the combat tracker
- **Tables**: Browse all attack, critical, and fumble tables

## File Structure

| File | Description |
|------|-------------|
| `index.html` | Main HTML with 3-tab layout |
| `merp-style.css` | Dark parchment Middle-earth theme |
| `merp-data.js` | Core data: stats, races, professions, weapons, skills, XP |
| `merp-tables-attack.js` | Attack tables AT-1 through AT-9 with lookup functions |
| `merp-tables-critical.js` | Critical tables CT-1 through CT-11, fumble tables FT-1 through FT-4 |
| `merp-tables-chargen.js` | Adolescence ranks, background options, maneuver/RR tables |
| `merp-character.js` | `MerpCharacter` class: creation, skills, leveling |
| `merp-combat.js` | `CombatResolver`: attack/critical/fumble/RR/maneuver resolution |
| `merp-spells-npcs.js` | Spell lists and 300+ NPC/creature templates |
| `merp-battle.js` | Battle tracker UI: initiative, rounds, status effects |
| `merp-app.js` | UI controller, wizard, tab navigation, localStorage persistence |

## Data Sources

- **ICE2000** -- *Middle-earth Role Playing* 2nd Edition rulebook (core rules, tables)
- **ICE2004** -- *MERP Combat Screen* (quick reference tables)
- **ICE2012** -- *Creatures of Middle-earth* (creature stats, sections 8.1-8.3)

## Technical Notes

- Pure HTML/CSS/JavaScript -- no frameworks or dependencies
- All data stored in browser localStorage
- Dice rolls use `Math.random()` for uniform d100 distribution
- Open-ended rolls: 96-100 triggers high open-ended (roll again, add); 01-05 triggers low open-ended (roll again, subtract)
- Attack table lookup handles all armor types and modified roll ranges
- Status effect timing: stun/prone are immediate; bleeding damage starts next round

## License

This is a personal fan project for tabletop RPG use. MERP and Middle-earth Role Playing are trademarks of Iron Crown Enterprises. Middle-earth and all related characters are the property of the Tolkien Estate.
