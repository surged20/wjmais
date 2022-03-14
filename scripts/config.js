// Namespace Configuration Values
export const WJMAIS = {};

WJMAIS.actorSizes = {
  "tiny": "WJMAIS.SizeMegaTiny", // 0.5x0.5
  "sm": "WJMAIS.SizeMegaSmall", // 1x1
  "med": "WJMAIS.SizeMegaMedium", // 1x1
  "lg": "WJMAIS.SizeMegaLarge", // 2x2
  "huge": "WJMAIS.SizeMegaHuge", // 3x3
  "grg": "WJMAIS.SizeMegaGargantuan" // 4x4
};

WJMAIS.shipClass = {
  "tiny": "WJMAIS.ShipClassFighter",
  "sm": "WJMAIS.ShipClassSchooner",
  "med": "WJMAIS.ShipClassSloop",
  "lg": "WJMAIS.ShipClassFrigate",
  "huge": "WJMAIS.ShipClassHeavyFrigate",
  "grg": "WJMAIS.ShipClassShipOfTheLine"
};

WJMAIS.shipModifiers = {
  "tiny": {"ac": 0, "spd": 0, "mnv": 0},
  "sm": {"ac": 2, "spd": 0, "mnv": 45},
  "med": {"ac": 4, "spd": 0, "mnv": 0},
  "lg": {"ac": 5, "spd": -500, "mnv": 0},
  "huge": {"ac": 6, "spd": -1000, "mnv": -45},
  "grg": {"ac": 7, "spd": -1500, "mnv": -45}
};

WJMAIS.shipRamDice = {
  "tiny": 1,
  "sm": 1,
  "med": 2,
  "lg": 3,
  "huge": 4,
  "grg": 0
};

WJMAIS.mnvs = {
  "0": 0,
  "45": 45,
  "90": 90,
  "135": 135,
  "180": 180,
  "360": 360
};

WJMAIS.landingTypes = {
  "land": "WJMAIS.LandingLand",
  "water": "WJMAIS.LandingWater",
  "spacedock": "WJMAIS.LandingSpaceDock"
};

WJMAIS.bridgeCrewRoles = {
  "captain": "WJMAIS.RoleCaptain",
  "boatswain": "WJMAIS.RoleBoatswain",
  "helmsman": "WJMAIS.RoleHelmsman",
  "fighterhelmsman": "WJMAIS.RoleFighterHelmsman",
  "gunner": "WJMAIS.RoleGunner",
  "unassigned": "WJMAIS.RoleUnassigned"
};

WJMAIS.uniqueBridgeCrewRoles = ["captain", "boatswain", "fighterhelmsman", "helmsman"];

WJMAIS.weaponMountLocation = {
  "forward": "Forward",
  "aft": "Aft",
  "port": "Port (L)",
  "starboard": "Starboard (R)"
};

WJMAIS.weaponMountFacing = {
  0: "0°",
  45: "45°",
  90: "90°",
  135: "135°",
  180: "180°",
  360: "None"
};

WJMAIS.crewValues = {
  "cr1": 1,
  "cr2": 2,
  "cr3": 3,
  "cr4": 4,
  "cr5": 5,
  "cr6": 6,
  "cr8": 8,
}; 

WJMAIS.cargoTypes = [
  "consumable",
  "backpack",
  "equipment",
  "loot",
  "spell",
  "tool",
  "weapon"
];

export default WJMAIS;
