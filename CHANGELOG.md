# Changelog

## [0.3.3] - 2022-03-16

### Add

- Sheet support for per-ability proficiency

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

[Unreleased]: https://github.com/surged20/wjmais/compare/0.2.3...HEAD
[0.2.3]: https://github.com/surged20/wjmais/compare/0.2.2...0.2.3
[0.2.2]: https://github.com/surged20/wjmais/compare/0.2.1...0.2.2
[0.2.1]: https://github.com/surged20/wjmais/compare/0.2.0...0.2.1
[0.2.0]: https://github.com/surged20/wjmais/compare/0.1.1...0.2.0
[0.1.1]: https://github.com/surged20/wjmais/compare/0.1.0...0.1.1
[0.1.0]: https://github.com/surged20/wjmais/releases/tag/0.1.0
