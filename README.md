![Supported Foundry Versions](https://img.shields.io/endpoint?url=https://foundryshields.com/version?url=https://github.com/surged20/wjmais/releases/latest/download/module.json)
![GitHub License](https://img.shields.io/github/license/surged20/wjmais)
![Latest Release Download Count](https://img.shields.io/github/downloads/surged20/wjmais/latest/module.zip)

# Wildjammer: More Adventures in Space

This Foundry VTT module provides support for the
[Wildjammer: More Adventures in Space](https://www.dropbox.com/sh/3c88jrhy1t7gyql/AACS63QaKFCCrBn_-cxRVHBda)
supplement by Sesserdrix#7270.

**Wildjammer: More Adventures in Space is unofficial Fan Content permitted under the [Fan Content Policy](https://company.wizards.com/en/legal/fancontentpolicy). Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.**

## Features

This Foundry VTT module extends the dnd5e 1.4.1+ system with the following:
- WJ:MAiS version 0.97 content
  - Wildjammer ships
  - Helms, Modules, Upgrades, and Fore Mantle Modules
  - Ship Weapons and Personal Weapons
  - Optional class features, Bridge Crew Role Features, and Spells
  - Quick Reference guide
- Wildjammer ship vehicle sheet (PC and NPC modes)
  - Hull Points, Bulwark Points, Tactical Speed, and Manueverability
  - dnd5e 1.4.x compatible armor class config
  - Active Effects tab
  - PC Mode
    - Weapons not rollable from Wildjammer sheet
    - Bridge crew role management
    - Fighter-Helmsman/Gunner and Helmsman character sheets inherit ship weapons/equipment when entering the appropriate role.
  - NPC Mode
    - Exposes configurable abilities and proficiency modifier
    - All items, ability checks, and saving throws rollable from Wildjammer sheet
    - Attacks may have hardcoded bonuses or use the ability/proficiency modifiers.
- Token resource bar support for Hull Points and Bulwark Points
- Ship class scaled Collide and Ram attacks using **@ship.ram.dice** 
- Additional personal and ship weapon properties
- Additional wildjammer fore mantle module, module, and upgrade equipment types

## Use

### Quick Reference

Click the Wildjammer logo in the upper left to open the *Wildjammer Quick Reference* journal. This journal provides an index of the Wildjammer: More Adventures in Space content.

### Wildjammer Sheet

#### PC Mode

This is the default mode available to players.

- Owned ship weapons display facing and location to assist with determining potential targets.
- Bridge crew role assignment is managed via drag and drop of an actor to the sheet.
- Only one actor allowed in unique roles (Captain, Boatswain, Fighter-Helmsman, and Helmsman)
- Dragging an actor to Gunner or Fighter-Helmsman role will present a weapon selection dialog if more than one weapon is available for use in that role. The selected weapon is inherited by the actor and rolled from their sheet in mega scale combat.
- Dragging an actor to the Helmsman role will result in all ship Helmsman equipment/weapons being inherited by the actor to be rolled from their own sheet in mega scale combat.
- Deleting a bridge role assignment or dragging it to Unassigned will remove them from the bridge crew and remove any inherited ship weapon from their actor sheet.

#### NPC Mode

This mode is only availble to GMs.

- GM Visible *NPC Ship* toggle enters NPC mode.
  - Any PCs assigned to bridge crew roles will be removed upon entering NPC mode.
- Ability scores and proficiency may be configured as needed.
- Roll weapon attacks and other items directly from the sheet.
- Roll ability checks or saving throws for the ship by clicking the appropriate ability.

## Licenses

- This Foundry VTT module is licensed under MIT and with permission from Sesserdrix#7270
- This work is licensed under Foundry Virtual Tabletop EULA - Limited License Agreement for module development v 0.1.6.
- Threshership and Turtleship artwork used under permission from [Lauren Decker](http://www.instagram.com/1d10art).
- The remaining ship artwork is used under the WotC Fan Content Policy.
- Wildjammer logo and social preview art used under permission from [RathofKelly](https://www.instagram.com/rathofkelly).

## Thanks

- Sesserdrix#7270 for producing the high quality Wildjammer supplement for 5e.
- [Lauren Decker](http://www.instagram.com/1d10art) and [RathofKelly](https://www.instagram.com/rathofkelly) for providing beautiful artwork (check out their sites).
- Calego#0914 and the entire League of Extraordinary FoundryVTT Developers community for answering questions and documenting API usage.
