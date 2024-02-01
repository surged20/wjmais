# Changelog

## [1.0.0] - 2024-02-01

### Added

- v12 verified

### Changed

- Requires dnd5e 3.0.0+

### Fixed

- failed template partial references from dnd5e 3.0.0 reorg
- template source object deprecation warning

## [0.9.4] - 2023-08-14

### Added

- keybind (default Q) to open quick reference journal.

## [0.9.3] - 2023-06-16

### Fixed

- Cargo price now displays properly with denomination. dnd5e 2.1.x change prices to value/denomination (thanks to tprussak for the suggested fix.

## [0.9.2] - 2023-06-15

### Fixed

- dnd5e removed all attribute bar options for vehicles so add back attributes.hp for Hull Point display

## [0.9.1] - 2023-06-14

### Added

- Added a compendium banner for all packs
- Grouped packs into a Wildjammer folder
- Enabled setup screen banner

## [0.9.0] - 2023-06-13

### Added

- FoundryVTT v11 and dnd5e 2.2.x compatibility

### Changed

- Removed patching of isItemMountable for ship equipment. It's no longer necessary since the dnd5e 2.2.x refactor.

## [0.8.2] - 2023-03-02

### Fixed

- Unable to open core default token settings (undefined actor flags in wrapper)

## [0.8.1] - 2023-03-01

### Fixed

- Ship sheet weapons section translation string

## [0.8.0] - 2023-02-15

### Fixed

- NPC ship ability display on dnd5e 2.1.x
- Warnings for deprecated `attributable` `data-property` use on dnd5e 2.1.x

## [0.7.3] - 2022-09-13

### Added

- Support for Ready-Set-Roll compatible Collide Attack and Ram items

## [0.7.2] - 2022-09-09

### Fixed

- Fixed typo causing cone of movement to not work at 315 degrees.

## [0.7.1] - 2022-09-09

### Fixed

- Fix bug where an actor assigned to a deleted ship actor cannot be reassigned to another ship.

## [0.7.0] - 2022-09-08

### Added

- midi-qol onUse macro support for Collide Attack and Rams resolving backlash damage to the attacking ship.
- Additional check to warn user if ship speed is not configured when using the cone of movement measured template.
- Check that ship is in a valid cardinal/inter-cardinal facing before enabling the movement template.

### Changed

- Collide Attack and Rams now have a base damage formula that is scaled according to the rules when added to a ship.

## [0.6.1] - 2022-09-05

### Fixed

- Addressed issues preventing cone of movement template from working in all cases.

## [0.6.0] - 2022-09-03

### Added

- Key toggled ship cone of movement measured template. Represent the allowed cone of movement for the currently select token.

### Changed

- Adjusted manifest to remove explicit verified versions. This has the side effect of displaying scary warnings in the package manager.

## [0.5.0] - 2022-08-31

### Fixed

- Fixed landing types trait selector
- Correctly test for actors dropped from a compendium so the user facing error is displayed
- Active effects targeting hull points and bulwark points now work
- Fixed html and compendium link rendering in the ship description tab
- Fixed drag and drop to roles

### Changed

- Add dnd5e extensions by mergeObject to the global dnd5e config variable. This gets rid of the hacky relative import of dnd5e.mjs.
- Switch ship description text editor to use prosemirror
- Updated quick reference to v10 journal pages
- v10 compatible manifest
- migrate packs to dnd5e v2 schema
- patch updates for v10 and dnd5e v2
- dnd5e v2 import fixes
- Update data.data to system and data.flags to flags for v10

## [0.4.3] - 2022-08-26

### Changed

- Remove unnessary font-related changes to improve readability

### Fixed

- Fix for Foundry installs with non-root routePrefix

## [0.4.2] - 2022-07-24

### Fixed

- Failure adding crew and passenger entries

## [0.4.1] - 2022-07-21

### Fixed

- NaN encumberance value when switching PC/NPC sheet mode

## [0.4.0] - 2022-05-09

### Added

- Tagged all megascale spells with with megascale
- Add module setting to allow weapons to be rolled from a sheet in PC mode

### Changed

- Minimum core system is now v9, as required by dnd5e 1.6.0

### Fixed

- Quick reference dual ballista data in ship weapons table
- Removed C&P scaling text in Distress Beacon spell

## [0.3.4] - 2022-04-27

### Added

- Megascale spell tag support (requires dnd5e 1.6.0)

### Changed

- Dropping a PC/NPC actor anywhere adds them to the unassigned bridge crew role
- Ship polymorph is disabled since restoring transformation is buggy and needs mechanics defined

### Fixed

- Dual Ballista and Clipper content updates from 0.97.2

## [0.3.3] - 2022-03-16

### Add

- Sheet support for NPC ship per-ability proficiency

### Fixed

- Base proficiency configuration for NPC ships

### Removed

- Unused shipData and import support removed

## [0.3.2] - 2022-03-14

### Added

- Add Conjure Ballista spell icon

### Fixed

- Actually push the fix for display and configuration of ship equipment on item sheets.
- Fix Clipper AC
- Fix Dragonship BP

## [0.3.1] - 2022-03-07

### Fixed

- Fix display and configuration of ship equipment on item sheets

## [0.3.0] - 2022-03-07

### Added

- core v9 and dnd5e 1.5.7 compatibility

### Fixed

- Cargo weight now correctly calculated (was NaN after dnd5e system update)

## [0.2.3] - 2021-09-13

### Fixed

- Speed config now stores maneuverability as an integer. This fixes active effects calculations applied to maneuverability.

## [0.2.2] - 2021-08-23

### Added 

- New wildjammer AC formula to support ship construction rules ship class AC modifier.
- New hull material and modifier equipment types.
- Hull section on sheet contains material/modifiers.
- New ship construction hull material content. 
- Actor update support for active effects that modify BP or HP.
- Active effects for all material, modifiers, and upgrades with changes targeting AC, Speed, BP, or HP.

### Changed

- Ship construction hull modifiers moved from features to equipment items

### Removed

- Remove **Ram** feature, was replaced by **Collide**.

## [0.2.1] - 2021-08-03

### Added

- Patched fromCompendium() so that ships that are imported from a compendium will retain their resource bar config. This allow ships to be imported with bar2 preset to BP.

### Changed

- Update with wording changes between 0.97 prerelease and final pdf
- Ships now set base AC using custom formula instead of using the flat AC override.

### Fixed

- Fix bug where opening Default Token Config will crash

## [0.2.0] - 2021-07-31

### Added

- Update to *Wildjammer: More Adventures in Space 0.97* content
- New optional class features and bridge crew role compendium
- New quick reference guide
- Add NPC ship mode to sheet, allowing GMs to run a ship by rolling attacks from the vehicle sheet.
- Add new **dpl**, **fmm**, and **sc2d10** weapon properties
- Enable active effects tab in sheet
- Equip toggle in Features tab to support transfer of active effects.
- Add **@ship.ram.dice roll** formula that scales as described in the *Collide* action
- Add additional foremantle equipment type
- Replace anvil with wildjammer logo
- Click on wildjammer logo opens quick reference guide
- README updated with additional docs
- Added support for dnd5e 1.4.x compatible armor class config dialog

### Changed

- Depends on dnd5e 1.4.1+
- Consolidated compendiums to just ships, items, features, spells, and quickref
- Equip all inherited items on PC actor
- Allow Helmsman to inherit all weapons/items when entering that role
- Adjust styles to match font/color scheme of WJMAiS supplement
- Ship class is no longer a text field, set it based on ship size
- All ship weapons have finesse property so higher of str/dex is selected for modifier

### Fixed

- Fix bug with speed configuration on new or converted vehicle actors
- Fix bug where many types of items do not show up in Cargo after being added

## [0.1.1] - 2021-07-01

### Added
- Enable display of hull points and bulwark points on separate token resource bars

### Changed
- Minor cleanups

### Fixed
- Fix bug in speed config

## [0.1.0] - 2021-06-29
 
### Added
 
- Wildjammer ship vehicle sheet
- Bridge crew role management
- Fighter-Helmsman/Gunner/Helmsman ship weapon assignment
- Additional weapon proficiencies
- Additional wildjammer module/upgrade equipment types
- WJ:MAiS 0.96.1 compendiums

[Unreleased]: https://github.com/surged20/wjmais/compare/1.0.0...HEAD
[0.9.4]: https://github.com/surged20/wjmais/compare/0.9.4...1.0.0
[0.9.4]: https://github.com/surged20/wjmais/compare/0.9.3...0.9.4
[0.9.3]: https://github.com/surged20/wjmais/compare/0.9.2...0.9.3
[0.9.2]: https://github.com/surged20/wjmais/compare/0.9.1...0.9.2
[0.9.1]: https://github.com/surged20/wjmais/compare/0.9.0...0.9.1
[0.9.0]: https://github.com/surged20/wjmais/compare/0.8.2...0.9.0
[0.8.2]: https://github.com/surged20/wjmais/compare/0.8.1...0.8.2
[0.8.1]: https://github.com/surged20/wjmais/compare/0.8.0...0.8.1
[0.8.0]: https://github.com/surged20/wjmais/compare/0.7.3...0.8.0
[0.7.3]: https://github.com/surged20/wjmais/compare/0.7.2...0.7.3
[0.7.2]: https://github.com/surged20/wjmais/compare/0.7.1...0.7.2
[0.7.1]: https://github.com/surged20/wjmais/compare/0.7.0...0.7.1
[0.7.0]: https://github.com/surged20/wjmais/compare/0.6.1...0.7.0
[0.6.1]: https://github.com/surged20/wjmais/compare/0.6.0...0.6.1
[0.6.0]: https://github.com/surged20/wjmais/compare/0.5.0...0.6.0
[0.5.0]: https://github.com/surged20/wjmais/compare/0.4.3...0.5.0
[0.4.3]: https://github.com/surged20/wjmais/compare/0.4.2...0.4.3
[0.4.2]: https://github.com/surged20/wjmais/compare/0.4.1...0.4.2
[0.4.1]: https://github.com/surged20/wjmais/compare/0.4.0...0.4.1
[0.4.0]: https://github.com/surged20/wjmais/compare/0.3.4...0.4.0
[0.3.4]: https://github.com/surged20/wjmais/compare/0.3.3...0.3.4
[0.3.3]: https://github.com/surged20/wjmais/compare/0.3.2...0.3.3
[0.3.2]: https://github.com/surged20/wjmais/compare/0.3.1...0.3.2
[0.3.1]: https://github.com/surged20/wjmais/compare/0.3.0...0.3.1
[0.3.0]: https://github.com/surged20/wjmais/compare/0.2.3...0.3.0
[0.2.3]: https://github.com/surged20/wjmais/compare/0.2.2...0.2.3
[0.2.2]: https://github.com/surged20/wjmais/compare/0.2.1...0.2.2
[0.2.1]: https://github.com/surged20/wjmais/compare/0.2.0...0.2.1
[0.2.0]: https://github.com/surged20/wjmais/compare/0.1.1...0.2.0
[0.1.1]: https://github.com/surged20/wjmais/compare/0.1.0...0.1.1
[0.1.0]: https://github.com/surged20/wjmais/releases/tag/0.1.0
