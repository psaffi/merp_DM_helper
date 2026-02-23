// MERP 2nd Edition - Critical Tables (CT-1 through CT-11) and Fumble Tables (FT-1 through FT-4)
// Critical severity modifiers: T=-50, A=-20, B=-10, C=0, D=+10, E=+20

MERP.critSeverityMod = { T: -50, A: -20, B: -10, C: 0, D: 10, E: 20 };

// Critical table format: [minRoll, maxRoll, description]
// Each table is an array of entries

// CT-1: CRUSH CRITICAL TABLE
MERP.CT1 = { name: "Crush", entries: [
    [-999, 5, { hits: 0, text: "Weak grip. No extra damage. +0 hits." }],
    [6, 20, { hits: 5, text: "Minor fracture of ribs. +5 hits. -5 to activity." }],
    [21, 35, { hits: 4, text: "Blow to side. +4 hits. -40 to activity for 1 round." }],
    [36, 50, { hits: 5, text: "Blow to forearm. +5 hits. If no arm armor, stunned 1 round." }],
    [51, 65, { hits: 0, text: "Blow to shield shoulder breaks shield. If no shield: shoulder broken, arm useless." }],
    [66, 79, { hits: 12, text: "Blow breaks bone in leg. +12 hits. -40 to activity. Stunned 2 rounds." }],
    [80, 80, { hits: 30, text: "Strike to forehead. +30 hits. One eye destroyed. Stunned 24 rnds. If no helm: a 1 month coma results." }],
    [81, 86, { hits: 8, text: "Blow to weapon arm. +8 hits. Stunned 2 rounds. If no arm armor: tendon damaged, arm broken and useless." }],
    [87, 89, { hits: 9, text: "Shatter knee. +9 hits. -60 to activity. Knocked down and stunned for 3 rounds." }],
    [90, 90, { hits: 25, text: "Blow to back of neck paralyzes from the shoulders down. +25 hits. Foe quite stunned." }],
    [91, 96, { hits: 20, text: "Unconscious for 4 hours due to blow to side of head. If no helm: skull crushed. +20 hits." }],
    [97, 99, { hits: 0, text: "Blast to chest sends rib cage through lungs. Drops and dies in 6 rounds. Vicious." }],
    [100, 100, { hits: 0, text: "Blow to jaw. Drives bone into brain. Dies instantly." }],
    [101, 106, { hits: 15, text: "Blow breaks hip. +15 hits. -75 to activity. Knocked down and stunned 3 rounds." }],
    [107, 109, { hits: 0, text: "Neck strike crushes throat. Cannot breath and stunned for 12 rounds. Poor fool then expires." }],
    [110, 110, { hits: 35, text: "Crushes hip. +35 hits. Stunned for 2 rounds. Active the following 4 rounds, but then dies of nerve failure." }],
    [111, 116, { hits: 0, text: "Shatter elbow in weapon arm. Arm useless. Stunned 5 rounds." }],
    [117, 119, { hits: 0, text: "Blow to side crushes chest cavity. Drops and dies in 3 rounds." }],
    [120, 999, { hits: 25, text: "Blast to chest area. Destroys heart. Dies immediately. +25 hits. Fine work." }]
]};

// CT-2: SLASH CRITICAL TABLE
MERP.CT2 = { name: "Slash", entries: [
    [-999, 5, { hits: 0, text: "Weak strike yields no extra damage. +0 hits." }],
    [6, 20, { hits: 0, text: "Minor calf wound. 1 hit per round." }],
    [21, 35, { hits: 5, text: "Blow to upper leg. +5 hits. If no leg armor: +3 hits & 2 hits/rnd." }],
    [36, 50, { hits: 3, text: "Minor chest wound. +3 hits. 1 hit per round. -5 to activity." }],
    [51, 65, { hits: 4, text: "Minor forearm wound. +4 hits. 2 hits per round. Stunned 1 round." }],
    [66, 79, { hits: 6, text: "Medium thigh wound. +6 hits. 1 hit per round. -10 to activity. Stunned 2 rounds." }],
    [80, 80, { hits: 0, text: "Neck strike severs carotid artery. Neck broken. Dies in 1 round of intense agony." }],
    [81, 86, { hits: 10, text: "Slash weapon arm. +10 hits. 1 hit per round. If no arm armor: muscle and tendon damage, arm useless." }],
    [87, 89, { hits: 10, text: "Destroys one eye. +10 hits. Stunned for 30 rounds." }],
    [90, 90, { hits: 0, text: "Disemboweled, dies instantly. 25% chance your weapon is stuck in opponent for 2 rounds." }],
    [91, 96, { hits: 15, text: "Knocked out for 6 hours with a strike to side of head. +15 hits. If no helm: dies instantly." }],
    [97, 99, { hits: 0, text: "Sever lower leg. 20 hits per round. Drops and lapses into unconsciousness." }],
    [100, 100, { hits: 0, text: "Slash side. Down, unconscious and dies in 3 rounds due to massive internal organ damage." }],
    [101, 106, { hits: 8, text: "Major abdominal wound. +10 hits. 8 hits per round. -10 to activity. Stunned for 4 rounds." }],
    [107, 109, { hits: 15, text: "Sever weapon arm. 15 hits per round. Down and unconscious immediately." }],
    [110, 110, { hits: 0, text: "Impaled in heart. Dies instantly. Heart destroyed. 25% chance your weapon is stuck in foe 3 rounds." }],
    [111, 116, { hits: 12, text: "Sever hand. 12 hits per round. Knocked down and stunned for 6 rounds." }],
    [117, 119, { hits: 0, text: "Sever spine. Collapses immediately. Paralyzed from the neck down permanently. +20 hits." }],
    [120, 999, { hits: 0, text: "Strike to head destroys brain. Life is hard for the unfortunate fool. Expires in a heap, immediately." }]
]};

// CT-3: PUNCTURE CRITICAL TABLE
MERP.CT3 = { name: "Puncture", entries: [
    [-999, 5, { hits: 0, text: "Glancing blow. No extra damage. +0 hits." }],
    [6, 20, { hits: 3, text: "Glancing blow to side. +3 hits." }],
    [21, 35, { hits: 3, text: "Thigh strike. +3 hits. If no leg armor: 3 hits per round." }],
    [36, 50, { hits: 2, text: "Minor forearm wound. +2 hits. If no arm armor: stunned 1 round." }],
    [51, 65, { hits: 1, text: "Strike along side of chest. 1 hit per round. Stunned 1 round." }],
    [66, 79, { hits: 3, text: "Strike to lower leg. Tendons torn. +3 hits. -25 to activity. Stunned 1 round." }],
    [80, 80, { hits: 0, text: "Strike to neck. Nerves and blood vessels severed. Dies of a massive heart failure." }],
    [81, 86, { hits: 10, text: "Strike to weapon. +10 hits. If no arm armor: bone broken, stunned 3 rounds." }],
    [87, 89, { hits: 0, text: "Strike through lower leg. Sever muscle. -50 to activity. Stunned 3 rounds." }],
    [90, 90, { hits: 0, text: "Strike through both lungs. Drops and passes out. Dies in 6 rounds." }],
    [91, 96, { hits: 10, text: "Strike to side of head. Knocked out for 6 hours. +10 hits. If no helm: dies instantly." }],
    [97, 99, { hits: 0, text: "Strike through neck breaks backbone and severs spine. Paralyzed from the neck down, permanently." }],
    [100, 100, { hits: 0, text: "Strike through eye. Dies instantly. A real eye full." }],
    [101, 106, { hits: 10, text: "Major abdominal wound. +10 hits. 6 hits per round. -20 to activity. Stunned 4 rounds." }],
    [107, 109, { hits: 0, text: "Nailed in lower back. Down and unconscious. Dies from internal bleeding and shock in 6 rounds." }],
    [110, 110, { hits: 0, text: "Shot through heart. Reels 10 feet to a spot suitable for dying. Weapon stuck in spinning victim for at least 3 rounds." }],
    [111, 116, { hits: 12, text: "Strike through leg. Artery severed. Down and unconscious. 12 hits per round." }],
    [117, 119, { hits: 9, text: "Strike through kidneys. +9 hits. Knocked down and dies after 6 rounds of very intense agony. Sad." }],
    [120, 999, { hits: 0, text: "Shot through both ears. Hearing impaired, dies instantly. Awesome shot." }]
]};

// CT-4: UNBALANCING CRITICAL TABLE
MERP.CT4 = { name: "Unbalancing", entries: [
    [-999, 5, { hits: 0, text: "Fairly weak. +0 hits. Zip." }],
    [6, 20, { hits: 2, text: "Arm strike. +2 hits. -5 to activity for 2 rounds." }],
    [21, 35, { hits: 4, text: "Leg strike. +4 hits. If no leg armor: stunned 1 round." }],
    [36, 50, { hits: 5, text: "Chest strike. Knocked back 3 feet. +5 hits. -10 to activity for 2 rnds." }],
    [51, 65, { hits: 5, text: "Blow to shield arm. +5 hits. Shield torn away. If no shield: +8 hits and stunned 2 rounds." }],
    [66, 79, { hits: 8, text: "Elbow strike. Forearm numbed. +8 hits. Drop weapon. -10 to activity for 10 rounds." }],
    [80, 80, { hits: 0, text: "Brutal hip strike. Knocked down. Tendon torn and joint shattered. Leg useless. -80 to activity." }],
    [81, 86, { hits: 5, text: "Shot to side. Knocked 5 feet sideways. Drop anything carried in hands. Stunned 3 rounds." }],
    [87, 89, { hits: 0, text: "Side strike. Stumble ungracefully to an embarrassing prone position. Stunned 6 rounds." }],
    [90, 90, { hits: 0, text: "Back strike. Knocked flying 10' onto face. Severe nerve damage. Paralyzed from waist down." }],
    [91, 96, { hits: 18, text: "Hard head strike. Knocked back 10' and stunned 6 rounds. If no helm: unconscious for 24 hours." }],
    [97, 99, { hits: 0, text: "Totally awesome strike. Knocked to knees. If using 1 hand weapon: it is thrown backwards 10 feet. Stunned 15 rounds." }],
    [100, 100, { hits: 12, text: "Upper chest strike. Knocked 10' sideways. Fall down, break both arms. A 2 month coma results. +12 hits." }],
    [101, 106, { hits: 12, text: "Blow breaks leg. +12 hits. -50 to activity. Stunned 1 round." }],
    [107, 109, { hits: 9, text: "Strike to head. Knocked 10' back. +9 hits. Stunned 6 rounds. If no helm: a 4 week coma results." }],
    [110, 110, { hits: 12, text: "Savage blow to head. Knocked down. Dies in 12 rounds due to severed vein." }],
    [111, 116, { hits: 0, text: "Great side shot. Knocked down and sideways 5'. Lower leg broken. Stunned 7 rounds. -40 to activity." }],
    [117, 119, { hits: 9, text: "Blow to shield shoulder. Stunned 9 rounds. -20 to activity. If no shield: unconscious and upper arm shattered." }],
    [120, 999, { hits: 0, text: "Frightening strike to temple. Knocked back 20 feet. Dies instantly. Not nice." }]
]};

// CT-5: GRAPPLING CRITICAL TABLE
MERP.CT5 = { name: "Grappling", entries: [
    [-999, 5, { hits: 0, text: "An opportunity lost." }],
    [6, 20, { hits: 2, text: "Passing strike. +2 hits." }],
    [21, 35, { hits: 3, text: "Attack fended off. +3 hits. If arm armor: stunned 1 round." }],
    [36, 50, { hits: 0, text: "Leg attack. Spun about, but breaks loose. If leg armor, stunned 1 round." }],
    [51, 65, { hits: 0, text: "Shield arm entangled. If shield: -50 to activity until it is dropped. If no shield: -50 to activity." }],
    [66, 79, { hits: 0, text: "Weapon arm grasped. Disarmed and wrist sprained. Stunned 2 rounds. -25 to activity." }],
    [80, 80, { hits: 9, text: "Both legs entangled. Down and knocked out. +9 hits." }],
    [81, 86, { hits: 0, text: "Weapon arm grappled. Ligaments torn and muscle pulled. Disarmed and stunned for 3 rounds. -40 to activity." }],
    [87, 89, { hits: 0, text: "Completely entangled and immobilized. Knocked down, but still conscious. No activity." }],
    [90, 90, { hits: 0, text: "Vicious hold around neck. Knocked out. Sprained neck: -60 to activity." }],
    [91, 96, { hits: 0, text: "Head grappled. Stunned 9 rounds. If no helm: a coma (1-10 days) results due to a fractured skull." }],
    [97, 99, { hits: 0, text: "Both arms entangled and pinned to chest. Arms may not be moved until entanglement removed. -75 to activity." }],
    [100, 100, { hits: 0, text: "Neck grappled. If neck armor: -60 to activity due to neck sprain and stunned 3 rounds. If not: dies from broken neck." }],
    [101, 106, { hits: 0, text: "Chest grasped. Ribs broken. Stunned 5 rounds. -10 to activity." }],
    [107, 109, { hits: 20, text: "Legs entangled and completely immobilized. Fall and break weapon arm. Disarmed and knocked out. +20 hits." }],
    [110, 110, { hits: 0, text: "Neck grappled. If neck armor: disarmed and stunned 5 rounds. If not: dies in 6 rounds." }],
    [111, 116, { hits: 0, text: "Foot entangled. Stumble, fall, break weapon on impact, and stunned 2 rounds. If no chest armor: take a D crush crit." }],
    [117, 119, { hits: 20, text: "Both legs wrapped up. Tumbles to ground and knocked out. -80 to activity due to a broken arm and a broken ankle. +20 hits." }],
    [120, 999, { hits: 0, text: "Windpipe crushed. Dies instantly due to massive shock and savage asphyxiation." }]
]};

// CT-6: HEAT CRITICAL TABLE
MERP.CT6 = { name: "Heat", entries: [
    [-999, 5, { hits: 0, text: "Hot air. +0 hits." }],
    [6, 20, { hits: 3, text: "Strong heat, little effect. +3 hits." }],
    [21, 35, { hits: 8, text: "Minor burns. +8 hits. 1 hit per round." }],
    [36, 50, { hits: 12, text: "Blinded by hot smoke. +12 hits. Stunned 1 round." }],
    [51, 65, { hits: 12, text: "Clothing catches on fire. Takes 2 rnds to extinguish. +12 hits. 8 hits per rnd afire. Stunned 1 rnd." }],
    [66, 79, { hits: 10, text: "Knocked down by fiery blast. Any organic foot and calf covering destroyed. +10 hits." }],
    [80, 80, { hits: 15, text: "Blast to head. Face horribly scarred. Knocked out. +15 hits. 5 hits per round. If no helm: a 1 month coma results." }],
    [81, 86, { hits: 0, text: "Fire engulfs back. Knocked down. All organic material on back destroyed. 2 hits per round. Stunned 1 round." }],
    [87, 89, { hits: 0, text: "Strike to head. Blinded for 6 rounds. Any organic head covering destroyed. If no helm: head hair destroyed." }],
    [90, 90, { hits: 0, text: "Head becomes a charred stump. Sadly, dies instantly due to this unacceptable condition." }],
    [91, 96, { hits: 0, text: "Shield arm fried. Any shield is destroyed along with hand. Stunned 5 rounds. If no shield: loses arm and knocked out." }],
    [97, 99, { hits: 2, text: "Upper leg burn. Use of leg lost due to tissue destruction. 2 hits per round. -60 to activity. Stunned 6 rounds." }],
    [100, 100, { hits: 25, text: "Blast to neck fuses vertebrae and unites skin with clothing. Paralyzed permanently. +25 hits." }],
    [101, 106, { hits: 2, text: "Blast to leg. 2 hits/round. -20 to activity. If no leg armor: massive tissue damage, -70 to activity." }],
    [107, 109, { hits: 0, text: "Head strike. If helm: blinded for 2 weeks. If not: dies in 6 rnds due to massive shock and brain damage." }],
    [110, 110, { hits: 0, text: "Midsection vaporized. Cut in half and dies. Clothing, armor, and all items destroyed." }],
    [111, 116, { hits: 12, text: "Blast to chest. Any chest armor destroyed. +12 hits. Stunned 3 rounds. If no chest armor: knocked down, 6 hits per round." }],
    [117, 119, { hits: 25, text: "Fire engulfs body. All organic material on body destroyed. Dies in 6 rnds. +25 hits." }],
    [120, 999, { hits: 0, text: "All that remains are charred bits of teeth and bone." }]
]};

// CT-7: COLD CRITICAL TABLE
MERP.CT7 = { name: "Cold", entries: [
    [-999, 5, { hits: 0, text: "Cool breeze. +0 hits." }],
    [6, 20, { hits: 3, text: "Cold blast. +3 hits. If no cloak or armor: +6 hits and stunned 1 rnd." }],
    [21, 35, { hits: 7, text: "Frosty 'burn.' +7 hits. 1 hit per round." }],
    [36, 50, { hits: 5, text: "Mild frostbite. +5 hits. 2 hits per round and -10 to activity." }],
    [51, 65, { hits: 9, text: "Back strike. +9 hits. 2 hits/rnd. Stunned 2 rnds. Wood exposed on back is useless and brittle." }],
    [66, 79, { hits: 0, text: "Strong, but low, blast. Stunned 1 round. Any foot covering destroyed. If no foot covering: frostbite, -30 to activity." }],
    [80, 80, { hits: 0, text: "Icy blast to head. A month long coma (and head cold) results. Loses nose as a result of severe frostbite and shock." }],
    [81, 86, { hits: 0, text: "Strike to leg. Knocked down. Stunned for 3 rounds. If no leg armor: frostbite, lower leg useless and -40 to activity." }],
    [87, 89, { hits: 0, text: "Strike to neck and collar area. Knocked out. Lose outer ear. If no neck armor: neck is frozen and dies in 9 inactive rounds." }],
    [90, 90, { hits: 0, text: "Blast freeze-dries head. Dies in 2 rounds. Skull and brain are brittle and lifeless." }],
    [91, 96, { hits: 5, text: "Thigh iced. Broken bone and frostbite. 5 hits per round. -30 to activity. Stunned for 4 rounds." }],
    [97, 99, { hits: 0, text: "Side strike freezes and shatters pelvis. Dies in 12 rounds due to shock and nerve damage." }],
    [100, 100, { hits: 0, text: "Head strike. Eyes are frozen. A 3 week coma results. Paralyzed from the neck down." }],
    [101, 106, { hits: 6, text: "Blast freezes both hands. Loses use of both arms for 1 hour. 6 hits per round. Stunned for 5 rounds." }],
    [107, 109, { hits: 0, text: "Heart and lungs suddenly frozen. Dies in 6 inactive rounds of shock and suffocation." }],
    [110, 110, { hits: 0, text: "Massive strike shatters chest and freezes precious bodily fluids. Dies in 3 rounds." }],
    [111, 116, { hits: 0, text: "Icy blast to upper chest. Knocked down and out. If no chest armor: dies in 10 rounds due to a cold, cold heart." }],
    [117, 119, { hits: 0, text: "Frozen into a lifeless statue—well preserved, but quite dead." }],
    [120, 999, { hits: 0, text: "Frozen solid, then shatters into thousands of pieces after being slammed into the ground." }]
]};

// CT-8: ELECTRICITY CRITICAL TABLE
MERP.CT8 = { name: "Electricity", entries: [
    [-999, 5, { hits: 0, text: "Hair stands up. +0 hits." }],
    [6, 20, { hits: 3, text: "Light charge. +3 hits. If metal armor: stunned 1 rounds." }],
    [21, 35, { hits: 0, text: "Explosion of light. Stunned 1 round." }],
    [36, 50, { hits: 6, text: "Medium charge. +6 hits. -5 to activity. If metal armor: stunned 2 rounds." }],
    [51, 65, { hits: 9, text: "Heavy charge. +9 hits. -10 to activity. Stunned 1 round. If metal armor: stunned 3 rounds." }],
    [66, 79, { hits: 12, text: "Strike to shield arm. +12 hits. -20 to activity. If metal armor and no shield: knocked out for 1 day." }],
    [80, 80, { hits: 0, text: "Strike to side devastates nervous system. Severe shock results. Victim is a living vegetable for 1 month." }],
    [81, 86, { hits: 2, text: "Strike to weapon arm. 2 hits per round. If no leather arm armor: muscle and cartilage mangled, arm useless, stunned 6 rounds." }],
    [87, 89, { hits: 0, text: "Permeated by electricity. Entire nervous system rearranged. Drops and lies in shock for 12 rounds before dying." }],
    [90, 90, { hits: 0, text: "Head strike. If leather helm: it is destroyed, 2 week coma results. If not: dies instantly as brain is fried." }],
    [91, 96, { hits: 0, text: "Chest strike. If metal armor: it becomes fused and immobile. If not: knocked out for 6 hours." }],
    [97, 99, { hits: 0, text: "Electrifying experience. Brain falls victim to massive shock and surface burns. Passes out and dies in 6 rounds." }],
    [100, 100, { hits: 0, text: "Nervous system acts as a superconductor. Instant death provides all with a fine light show." }],
    [101, 106, { hits: 0, text: "Strike to face. Loses nose. Stunned 8 rounds. Blinded for 2 weeks. If no helm: knocked down as well." }],
    [107, 109, { hits: 0, text: "Strike destroys heart, lungs. If metal chest armor: it is fused, dies in 6 rnds. If not: dies instantly." }],
    [110, 110, { hits: 0, text: "Head is no longer available for use. Smoke and ozone surround the lifeless body." }],
    [111, 116, { hits: 7, text: "Abdomen strike. Stunned 7 rounds. 6 hits per round. If no armor over abdomen: dies of shock and bleeding in 12 rounds." }],
    [117, 119, { hits: 0, text: "Chest strike destroys both lungs. Cut in half. Charge extends 10 feet giving an A critical to anyone in the way." }],
    [120, 999, { hits: 0, text: "Charge disrupts cell structure. Entire body turned to dust." }]
]};

// CT-9: IMPACT CRITICAL TABLE
MERP.CT9 = { name: "Impact", entries: [
    [-999, 5, { hits: 0, text: "Not even a scratch. +0 hits." }],
    [6, 20, { hits: 5, text: "Grazing shot. +5 hits." }],
    [21, 35, { hits: 10, text: "Staggered by strike to side. +10 hits. Stunned 1 round." }],
    [36, 50, { hits: 12, text: "Strike to shoulder. Spun about. Reel backwards 10 feet. +12 hits. If no armor: stunned 2 rounds." }],
    [51, 65, { hits: 8, text: "Strike to leg. Knocked down. +8 hits. If no leg armor: stunned 2 rounds." }],
    [66, 79, { hits: 10, text: "Blast to shield arm. +10 hits. Shield or arm armor destroyed. If none: arm broken and useless, stunned 3 rounds." }],
    [80, 80, { hits: 12, text: "Strike to head. +12 hits. Helm is shattered. Knocked down and out for 1 day. If no helm: skull fractured, dies in 3 rounds." }],
    [81, 86, { hits: 15, text: "Blow to upper leg. Muscles torn. +15 hits. -10 to activity. If no leg armor: -20 to activity and stunned 3 rounds." }],
    [87, 89, { hits: 12, text: "Blast to collar area. +12 hits. Stunned 5 rounds. Cannot speak for 1 week. If no neck armor: voice loss is permanent." }],
    [90, 90, { hits: 20, text: "Neck strike. +20 hits. Paralyzed from the shoulders down. A melancholy mood falls on victim." }],
    [91, 96, { hits: 18, text: "Blow to knee. Knee dislocated. Cartilage and tendons ripped. +15 hits. -50 to activity. Stunned 9 rounds." }],
    [97, 99, { hits: 18, text: "Strike abdomen. +18 hits. Stunned 12 rounds. If no abdomen armor: dies in 6 rounds due to destroyed organs." }],
    [100, 100, { hits: 0, text: "Blast to head fractures skull. A 3 week coma results. If no helm: dies immediately." }],
    [101, 106, { hits: 12, text: "Blow breaks leg. +12 hits. -50 to activity. Stunned 1 round." }],
    [107, 109, { hits: 15, text: "Blow to jaw. Jaw broken. Cannot speak or eat solid food until healed. +15 hits. Stunned 7 rnds." }],
    [110, 110, { hits: 0, text: "Blow to side. Bone is driven into kidneys. Dies in 6 rounds." }],
    [111, 116, { hits: 0, text: "Spun by blow. Knocked down. Breaks both arms. -60 to activity. Stunned 3 rounds." }],
    [117, 119, { hits: 0, text: "Blast shatters skull into thousands of particles. Dies instantly. Direct hit, fine punch." }],
    [120, 999, { hits: 0, text: "Blast annihilates entire skeleton. Reduced to a gelatinous pulp. Try a spatula." }]
]};

// CT-10: PHYSICAL CRITICALS FOR LARGE CREATURES TABLE
MERP.CT10 = { name: "Large Creature Physical", entries: [
    [-999, 5, { hits: 10, text: "+10 hits. 20% chance a normal weapon breaks, 1% for a magic weapon." }],
    [6, 20, { hits: 6, text: "+6 hits." }],
    [21, 35, { hits: 12, text: "+12 hits." }],
    [36, 50, { hits: 18, text: "+18 hits." }],
    [51, 65, { hits: 20, text: "Staggered by strong blast. +20 hits. -10 to activity. Stunned 2 rounds." }],
    [66, 79, { hits: 8, text: "Fine leg strike. +18 hits. 5 hits per round. -20 to activity. Stunned 3 rounds." }],
    [80, 80, { hits: 15, text: "Well placed strike to neck severs the jugular vein. +15 hits. Dies in 6 rounds, but may act at -60 to activity until then." }],
    [81, 86, { hits: 25, text: "Hard blow. +25 hits. 3 hits per round due to light wound. -10 to activity. Stunned 2 rounds." }],
    [87, 89, { hits: 0, text: "Strike severs an artery in leg. May act at -30 to activity for 4 rounds, then drops and dies after 6 more rounds." }],
    [90, 90, { hits: 20, text: "Sever a vein in forelimb. +20 hits. Stunned for 6 rounds, then falls dead." }],
    [91, 96, { hits: 15, text: "Strike to leg. +15 hits. -20 to activity. 2 hits per round. Stunned 3 rounds." }],
    [97, 99, { hits: 30, text: "Strike to head. Skull fracture. +30 hits. Knocked out. Fine shot." }],
    [100, 100, { hits: 0, text: "Heart strike. Dies immediately. Weapon stuck and trapped under body. Chance weapon broken is 60% - weapon bonus." }],
    [101, 106, { hits: 15, text: "Shatter shoulder in weapon arm. +15 hits. Stunned 3 rounds. Arm is quite useless." }],
    [107, 109, { hits: 0, text: "Vicious crossing strike. Blinded and upset. Stunned 2 rounds, but then the poor brute can blunder around." }],
    [110, 110, { hits: 0, text: "Strike through cheek. Dies immediately. Unfortunately, the weapon is stuck in the bone for 2 rounds." }],
    [111, 116, { hits: 0, text: "Strike to chin. Jaw shattered. Knocked out. +60 hits. A 1 month coma results." }],
    [117, 119, { hits: 0, text: "Strike through the eye. Dies instantly and falls upon attacker, who then takes 20 hits and is pinned for 6 rounds." }],
    [120, 999, { hits: 0, text: "Strike through ear destroys brain. The unfortunate lummox dies instantly, and any ear wax is removed." }]
]};

// CT-11: SPELL CRITICALS FOR LARGE CREATURES TABLE
MERP.CT11 = { name: "Large Creature Spell", entries: [
    [-999, 5, { hits: 0, text: "Size of creature awes you. +0 hits." }],
    [6, 20, { hits: 5, text: "+5 hits." }],
    [21, 35, { hits: 8, text: "+8 hits." }],
    [36, 50, { hits: 10, text: "+10 hits." }],
    [51, 65, { hits: 12, text: "+12 hits." }],
    [66, 79, { hits: 15, text: "+15 hits." }],
    [80, 80, { hits: 15, text: "Unbalanced by blast. +15 hits. Stunned 2 round." }],
    [81, 86, { hits: 20, text: "Staggered by strong blast. +20 hits. Stunned 2 rounds." }],
    [87, 89, { hits: 15, text: "Strike to leg. +15 hits. -20 to activity. Stunned 2 rounds." }],
    [90, 90, { hits: 30, text: "+30 hits." }],
    [91, 96, { hits: 18, text: "Spun about by blast. Off balance. +18 hits. -10 to activity. Stunned 1 round." }],
    [97, 99, { hits: 25, text: "Side strike. +25 hits. -20 to activity due to broken ribs. Stunned 3 rounds." }],
    [100, 100, { hits: 0, text: "Strike to midsection. Bladder destroyed. Dies in 4 rounds, but is fully active until then." }],
    [101, 106, { hits: 20, text: "Head strike. Momentarily confused. +20 hits. Stunned 2 rounds." }],
    [107, 109, { hits: 25, text: "Blast buckles leg. Severe thigh wound. +25 hits. Dies in 5 rounds due to nerve damage, but is fully active until then." }],
    [110, 110, { hits: 0, text: "Vicious blast. Neck crunched and spine severed. Drops and dies in 3 rounds." }],
    [111, 116, { hits: 15, text: "Strike to eyes. Blinded for 2 rounds. +15 hits. -20 to activity." }],
    [117, 119, { hits: 0, text: "Strike to body destroys a variety of organs. Dies in 3 rounds, but the ignorant brute is fully active until then." }],
    [120, 999, { hits: 0, text: "Superb strike drives rib through heart. Drops and dies in 6 agonizing rounds." }]
]};

// ============================================================
// CRITICAL TABLE LOOKUP FUNCTION
// ============================================================
MERP.criticalTables = {
    "Crush": "CT1", "Slash": "CT2", "Puncture": "CT3",
    "Unbalance": "CT4", "Unbalancing": "CT4",
    "Grapple": "CT5", "Grappling": "CT5",
    "Heat": "CT6", "Cold": "CT7",
    "Electricity": "CT8", "Impact": "CT9",
    "Large Creature": "CT10", "Large Spell": "CT11"
};

MERP.lookupCritical = function(critType, roll) {
    const tableName = MERP.criticalTables[critType];
    if (!tableName) return { text: "Unknown critical type: " + critType, hits: 0 };
    const table = MERP[tableName];
    if (!table) return { text: "Table not found: " + tableName, hits: 0 };

    for (const entry of table.entries) {
        if (roll >= entry[0] && roll <= entry[1]) {
            return entry[2];
        }
    }
    // If roll exceeds table, use last entry
    return table.entries[table.entries.length - 1][2];
};

// ============================================================
// FUMBLE TABLES (FT-1 through FT-4)
// ============================================================

// FT-1: Hand Arms Fumble Table
MERP.FT1 = { name: "Hand Arms Fumble", entries: [
    [-999, 5, { text: "Lose your grip. No further activity this round." }],
    [6, 20, { text: "You slip. If your weapon is 1-handed and non-magic, it breaks. Handle loading. Lose this round." }],
    [21, 35, { text: "Bad follow-through. You lose your opportunity, give yourself 2 hits." }],
    [36, 50, { text: "Drop your weapon. It will take 1 round to draw a new one or 2 rounds to recover old one." }],
    [51, 65, { text: "Lose your wind and realize that you should try to relax. -40 to activity for 2 rounds." }],
    [66, 79, { text: "You stumble. The classless display leaves you stunned for 2 rounds. With luck, you might still survive." }],
    [80, 80, { text: "Incredibly inept move. Roll a B crush crit on yourself. If opponent is using a slashing weapon, your weapon is broken." }],
    [81, 86, { text: "Bite and swallow tongue in the excitement. Stunned 2 rounds." }],
    [87, 89, { text: "Lose your grip on your weapon and reality. Stunned 3 rounds." }],
    [90, 90, { text: "Poor execution. You attempt to maim yourself as your weapon breaks. You take a C slash crit." }],
    [91, 96, { text: "Unbelievable mishandling of your weapon. A friendly combatant near you takes a B crush critical." }],
    [97, 99, { text: "Stumble over an unseen, imaginary, deceased turtle. You are very confused. Stunned 3 rounds." }],
    [100, 100, { text: "Worst move seen in ages. -60 to activity from a pulled groin. Foe is stunned 2 rounds laughing." }],
    [101, 106, { text: "You fall in an attempt to commit suicide. Stunned 3 rounds. If using a pole-arm, its shaft is shattered." }],
    [107, 109, { text: "You break your weapon through ineptness. Stunned 4 rounds." }],
    [110, 110, { text: "You stumble, driving your weapon into the ground. Stunned 5 rounds. If mounted: you pole vault 30', take a C crush crit upon landing." }],
    [111, 116, { text: "Your mount rears suddenly. Stunned 3 rounds recovering." }],
    [117, 119, { text: "You do not coordinate your movement with your mount's. -90 to activity for next 3 rounds trying to stay mounted." }],
    [120, 999, { text: "Fall off your mount. Roll a D crush crit on yourself." }]
]};

// FT-1 Modifications
MERP.FT1.mods = { "1H Concussion": -20, "1H Slashing": -10, "2-Handed": 0, "Pole Arms": 10, "Mounted": 20 };

// FT-2: Missile Weapons Fumble Table
MERP.FT2 = { name: "Missile Weapons Fumble", entries: [
    [-999, 5, { text: "Lose your grip. No further activity this round." }],
    [6, 20, { text: "One's ten thumbs just cannot handle loading. Lose this round." }],
    [21, 35, { text: "Fumble ammunition. Lose this round. -50 to activity next round." }],
    [36, 50, { text: "Break ammunition and lose your cool. You find yourself at -30 activity for 3 rounds of action." }],
    [51, 65, { text: "Drop ammunition. Stunned this round and next trying to decide whether to retrieve it." }],
    [66, 79, { text: "You really mishandle your weapon. Stunned 2 rounds." }],
    [80, 80, { text: "Poor judgment. +5 hits. If not using a crossbow, you let arrow fly, lose an ear and take 2 hits per round." }],
    [81, 86, { text: "Bowstring breaks. 2 rnds to draw a weapon or 6 rnds to restring bow." }],
    [87, 89, { text: "Fumble ammunition when loading. You scatter all of your ammunition over a 10' radius area." }],
    [90, 90, { text: "Weapon shatters. You are stunned for 4 rounds of action. Good luck, pal." }],
    [91, 96, { text: "You let your arrow fly too soon. You strike 20' short of target. You are at -30 activity for 3 rnds." }],
    [97, 99, { text: "You seem to think that your bow is a baton. It slips. Trying to grab it, you knock it 5' in front of you." }],
    [100, 100, { text: "Ammunition slips as you fire. The missile goes through your hand; its useless. +8 hits. 2 hits per round." }],
    [101, 106, { text: "Slip and fall down. Your shot goes astray. Stunned 5 rounds." }],
    [107, 109, { text: "Fletching on missile scratches eye as it is released. +5 hits. -20 to activity. Stunned 2 rounds." }],
    [110, 110, { text: "Tip of weapon catches on closest object and breaks off. If applicable, the object takes an A puncture crit." }],
    [111, 116, { text: "Trigger slips while you are bringing up your weapon. Make an attack with no modifications on the closest combatant. Stunned 3 rounds." }],
    [117, 119, { text: "While daydreaming you put your hand in the quarrel while firing. Lose a finger. +4 hits. 2 hits per round." }],
    [120, 999, { text: "You slip and pin your foot to the ground with a quarrel. +10 hits. 2 hits per round. -30 to activity. Stunned 3 rounds." }]
]};

MERP.FT2.mods = { "Sling": -20, "Short Bow": -10, "Composite Bow": 0, "Long Bow": 10, "Crossbow": 20 };

// FT-3: Spell Failure Table
MERP.FT3 = { name: "Spell Failure", entries: [
    [-999, 5, { text: "Lose concentration due to strain. Spell lost, but not power points." }],
    [6, 20, { text: "Second thoughts. No spell may be cast or prepared next round." }],
    [21, 35, { text: "Indecision due to mild mental lapse. Spell delayed one round." }],
    [36, 50, { text: "Serious mental lapse. Spell lost, but not power points. -30 to activity for 3 rounds." }],
    [51, 65, { text: "Moderate but serious, strain. Spell lost along with power points. Stunned 1 round." }],
    [66, 79, { text: "Subconscious fear. Spell lost along with power points. Stunned 2 rounds." }],
    [80, 80, { text: "Spell internalized. +15 hits. Knocked down. Stunned 1 hour. +1 CP." }],
    [81, 86, { text: "Serious strain. Spell lost, but not power points. Stunned 3 rounds." }],
    [87, 89, { text: "Internalization overloads senses. +20 hits. Blinded and deaf for 10 minutes. +1 CP." }],
    [90, 90, { text: "Strain causes mild stroke. +20 hits. Knocked out for 12 hours. +3 CP." }],
    [91, 96, { text: "Severe strain causes misfire. +5 hits. Stunned 3 rounds. +1 CP." }],
    [97, 99, { text: "Target's Essence causes spell to backfire. Reverse roles of target and caster in spell effects. +2 CP." }],
    [100, 100, { text: "Identity crisis. Lose spell casting capabilities for 2 weeks. +5 CP." }],
    [101, 106, { text: "Extreme mental pressure causes misfire. Knocked down. +10 hits. Stunned 6 rounds. +4 CP." }],
    [107, 109, { text: "Internalize spell. Lose spell casting ability for 3 weeks. +25 hits. Unconscious for 3 hours. +8 CP." }],
    [110, 110, { text: "Strain causes severe stroke. Paralyzed from the waist down. +15 CP." }],
    [111, 116, { text: "Spell strays and travels to a point 20 feet right of target. Anyone in line takes an unmodified attack. Stunned 3 rounds. +6 CP." }],
    [117, 119, { text: "Spell strays and travels to a point 20 feet left of target. Anyone in line takes an unmodified attack. Stunned 3 rounds. +10 CP." }],
    [120, 999, { text: "Mental Collapse. Spell is cast in direction opposite to the intended line. Lose all spell casting ability for 3 months. +20 CP." }]
]};

MERP.FT3.mods = { "Class T Spell": -20, "Class U Spell": -10, "Class P Spell": 0, "Class E/F Spell": 10, "Class DE/BE Spell": 20 };

// FT-4: Moving Maneuver Failure Table
MERP.FT4 = { name: "Moving Maneuver Failure", entries: [
    [-999, 5, { text: "You hesitate and fail to act." }],
    [6, 20, { text: "You have second thoughts and decide to wait one round." }],
    [21, 35, { text: "You slip. 30% chance of falling. -20 from maneuvers for 2 rounds." }],
    [36, 50, { text: "You stumble. 45% chance of falling. -30 from any maneuvers for 2 rounds." }],
    [51, 65, { text: "You stub your toe. 60% chance of falling. +3 hits. -10 to activity." }],
    [66, 79, { text: "You slip. 75% chance of falling. Stunned 2 rounds." }],
    [80, 80, { text: "You twist your ankle. +5 hits. -10 to activity." }],
    [81, 86, { text: "You fall down. +3 hits. -20 to activity for 3 rounds." }],
    [87, 89, { text: "You sprain your ankle and tear some tendons. +7 hits. -20 to activity. Stunned 1 round." }],
    [90, 90, { text: "Fall breaks your leg. +8 hits. -30 to activity. Stunned 3 rounds." }],
    [91, 96, { text: "You break your wrist when you fall. +12 hits. -20 to activity. Stunned 2 rounds." }],
    [97, 99, { text: "Your arm breaks when you land on it. +14 hits. -30 to activity. Stunned 4 rounds." }],
    [100, 100, { text: "Attempting to break a fall you break your arms. They are useless. +30 hits. Stunned 6 rounds." }],
    [101, 106, { text: "When you fall, your leg twists under you and breaks. +15 hits. -50 to activity. Stunned 3 rounds." }],
    [107, 109, { text: "Your knee strikes a hard object and shatters as you fall. +10 hits. -80 to activity. Stunned 4 rounds." }],
    [110, 110, { text: "You fall. The resulting concussion causes a year-long coma." }],
    [111, 116, { text: "You fall and land on your lower spine. You are paralyzed from the waist down. +30 hits." }],
    [117, 119, { text: "You fall and are paralyzed from the neck down. +20 hits." }],
    [120, 999, { text: "Your fall turns into a dive. You crush your skull and die." }]
]};

MERP.FT4.mods = { "Routine": -50, "Easy": -35, "Light": -20, "Medium": -10, "Hard": 0, "Very Hard": 5, "Extremely Hard": 10, "Sheer Folly": 15, "Absurd": 20 };

// ============================================================
// FUMBLE TABLE LOOKUP
// ============================================================
MERP.lookupFumble = function(tableNum, roll) {
    const table = MERP["FT" + tableNum];
    if (!table) return { text: "Unknown fumble table" };
    for (const entry of table.entries) {
        if (roll >= entry[0] && roll <= entry[1]) {
            return entry[2];
        }
    }
    return table.entries[table.entries.length - 1][2];
};
