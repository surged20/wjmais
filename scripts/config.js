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

WJMAIS.shipData = [
  {
    "data.attributes.hp": {
      "temp": 0,
      "tempmax": 0
    },
    "flags.core.sheetClass": "wjmais.WildjammerSheet",
    "flags.wjmais": {
      "air": 120,
      "cargo": 0.25,
      "crew.min": 1,
      "crew.max": 1,
      "hardpoints.sm": 1,
      "traits.lt.value": [
        "spacedock"
      ],
      "model": "Blade",
      "speed.tactical": 3500,
      "speed.mnv": 180
    }
  },
  {
    "data.attributes.hp": {
      "temp": 0,
      "tempmax": 0
    },
    "flags.core.sheetClass": "wjmais.WildjammerSheet",
    "flags.wjmais": {
      "air": 120,
      "cargo": 0.25,
      "crew.min": 1,
      "crew.max": 1,
      "hardpoints.spc": 1,
      "traits.lt.value": [
        "land",
        "spacedock",
        "water"
      ],
      "model": "Spirit Warrior",
      "speed.tactical": 3000,
      "speed.mnv": 360
    }
  },
  {
    "data.attributes.hp": {
      "temp": 8,
      "tempmax": 8
    },
    "flags.core.sheetClass": "wjmais.WildjammerSheet",
    "flags.wjmais": {
      "air": 1200,
      "cargo": 5,
      "crew.min": 3,
      "crew.max": 10,
      "hardpoints.sm": 1,
      "traits.lt.value": [
        "land",
        "spacedock"
      ],
      "model": "Dragonfly",
      "speed.tactical": 4000,
      "speed.mnv": 135
    }
  },
  {
    "data.attributes.hp": {
      "temp": 10,
      "tempmax": 10
    },
    "flags.core.sheetClass": "wjmais.WildjammerSheet",
    "flags.wjmais": {
      "air": 1800,
      "cargo": 5,
      "crew.min": 5,
      "crew.max": 15,
      "hardpoints.sm": 1,
      "hardpoints.med": 2,
      "traits.lt.value": [
        "land",
        "spacedock",
        "water"
      ],
      "model": "Threshership",
      "speed.tactical": 3000,
      "speed.mnv": 90
    }
  },
  {
    "data.attributes.hp": {
      "temp": 12,
      "tempmax":12
    },
    "flags.core.sheetClass": "wjmais.WildjammerSheet",
    "flags.wjmais": {
      "air": 2160,
      "cargo": 9,
      "crew.min": 8,
      "crew.max": 18,
      "hardpoints.lg": 1,
      "traits.lt.value": [
        "land",
        "spacedock",
        "water"
      ],
      "model": "Wasp",
      "speed.tactical": 3000,
      "speed.mnv": 90
    }
  },
  {
    "data.attributes.hp": {
      "temp": 12,
      "tempmax": 12
    },
    "flags.core.sheetClass": "wjmais.WildjammerSheet",
    "flags.wjmais": {
      "air": 2400,
      "cargo": 10,
      "crew.min": 6,
      "crew.max": 20,
      "hardpoints.med": 3,
      "traits.lt.value": [
        "spacedock",
        "water"
      ],
      "model": "Cutter",
      "speed.tactical": 3000,
      "speed.mnv": 180
    }
  },
  {
    "data.attributes.hp": {
      "temp": 14,
      "tempmax": 14
    },
    "flags.core.sheetClass": "wjmais.WildjammerSheet",
    "flags.wjmais": {
      "air": 3000,
      "cargo": 13,
      "crew.min": 10,
      "crew.max": 25,
      "hardpoints.sm": 1,
      "hardpoints.med": 1,
      "traits.lt.value": [
        "spacedock"
      ],
      "model": "Tradesman",
      "speed.tactical": 3000,
      "speed.mnv": 90
    }
  },
  {
    "data.attributes.hp": {
      "temp": 18,
      "tempmax": 18
    },
    "flags.core.sheetClass": "wjmais.WildjammerSheet",
    "flags.wjmais": {
      "air": 4800,
      "cargo": 20,
      "crew.min": 20,
      "crew.max": 40,
      "hardpoints.sm": 1,
      "hardpoints.med": 2,
      "traits.lt.value": [
        "spacedock",
        "water"
      ],
      "model": "Galleon",
      "speed.tactical": 3000,
      "speed.mnv": 45
    }
  },
  {
    "data.attributes.hp": {
      "temp": 16,
      "tempmax": 16
    },
    "flags.core.sheetClass": "wjmais.WildjammerSheet",
    "flags.wjmais": {
      "air": 4200,
      "cargo": 17,
      "crew.min": 10,
      "crew.max": 35,
      "hardpoints.med": 5,
      "traits.lt.value": [
        "spacedock",
        "water"
      ],
      "model": "Nautiloid",
      "speed.tactical": 3000,
      "speed.mnv": 90
    }
  },
  {
    "data.attributes.hp": {
      "temp": 18,
      "tempmax": 18
    },
    "flags.core.sheetClass": "wjmais.WildjammerSheet",
    "flags.wjmais": {
      "air": 4800,
      "cargo": 20,
      "crew.min": 3,
      "crew.max": 40,
      "hardpoints.med": 3,
      "traits.lt.value": [
        "spacedock"
      ],
      "model": "Mindspider",
      "speed.tactical": 2500,
      "speed.mnv": 135
    }
  },
  {
    "data.attributes.hp": {
      "temp": 18,
      "tempmax": 18
    },
    "flags.core.sheetClass": "wjmais.WildjammerSheet",
    "flags.wjmais": {
      "air": 4800,
      "cargo": 28,
      "crew.min": 12,
      "crew.max": 40,
      "hardpoints.sm": 3,
      "hardpoints.med": 1,
      "traits.lt.value": [
        "land",
        "spacedock",
        "water"
      ],
      "model": "Turtle Ship",
      "speed.tactical": 2000,
      "speed.mnv": 90
    }
  },
  {
    "data.attributes.hp": {
      "temp": 16,
      "tempmax": 16
    },
    "flags.core.sheetClass": "wjmais.WildjammerSheet",
    "flags.wjmais": {
      "air": 5400,
      "cargo": 22,
      "crew.min": 20,
      "crew.max": 45,
      "hardpoints.med": 2,
      "traits.lt.value": [
        "spacedock",
        "water"
      ],
      "model": "Dragonship",
      "speed.tactical": 2500,
      "speed.mnv": 90
    }
  },
  {
    "data.attributes.hp": {
      "temp": 20,
      "tempmax": 20
    },
    "flags.core.sheetClass": "wjmais.WildjammerSheet",
    "flags.wjmais": {
      "air": 5400,
      "cargo": 22,
      "crew.min": 12,
      "crew.max": 45,
      "hardpoints.med": 2,
      "hardpoints.lg": 1,
      "traits.lt.value": [
        "spacedock",
        "water"
      ],
      "model": "Squid Ship",
      "speed.tactical": 2500,
      "speed.mnv": 90
    }
  },
  {
    "data.attributes.hp": {
      "temp": 26,
      "tempmax": 26
    },
    "flags.core.sheetClass": "wjmais.WildjammerSheet",
    "flags.wjmais": {
      "air": 7200,
      "cargo": 30,
      "crew.min": 24,
      "crew.max": 60,
      "hardpoints.lg": 3,
      "traits.lt.value": [
        "spacedock",
        "water"
      ],
      "model": "Hammership",
      "speed.tactical": 2500,
      "speed.mnv": 90
    }
  },
  {
    "data.attributes.hp": {
      "temp": 20,
      "tempmax": 20
    },
    "flags.core.sheetClass": "wjmais.WildjammerSheet",
    "flags.wjmais": {
      "air": 5400,
      "cargo": 22,
      "crew.min": 10,
      "crew.max": 45,
      "hardpoints.sm": 6,
      "traits.lt.value": [
        "land",
        "spacedock",
        "water"
      ],
      "model": "Triop",
      "speed.tactical": 2000,
      "speed.mnv": 135
    }
  },
  {
    "data.attributes.hp": {
      "temp": 26,
      "tempmax": 26
    },
    "flags.core.sheetClass": "wjmais.WildjammerSheet",
    "flags.wjmais": {
      "air": 7200,
      "cargo": 30,
      "crew.min": 10,
      "crew.max": 60,
      "hardpoints.med": 5,
      "traits.lt.value": [
        "spacedock"
      ],
      "model": "Man-o-War",
      "speed.tactical": 2500,
      "speed.mnv": 135
    }
  },
  {
    "data.attributes.hp": {
      "temp": 30,
      "tempmax": 30
    },
    "flags.core.sheetClass": "wjmais.WildjammerSheet",
    "flags.wjmais": {
      "air": 8400,
      "cargo": 35,
      "crew.min": 13,
      "crew.max": 70,
      "hardpoints.lg": 4,
      "traits.lt.value": [
        "land",
        "spacedock"
      ],
      "model": "Octopus",
      "speed.tactical": 2000,
      "speed.mnv": 90
    }
  },
  {
    "data.attributes.hp": {
      "temp": 30,
      "tempmax": 30
    },
    "flags.core.sheetClass": "wjmais.WildjammerSheet",
    "flags.wjmais": {
      "air": 8400,
      "cargo": 35,
      "crew.min": 12,
      "crew.max": 70,
      "hardpoints.med": 2,
      "traits.lt.value": [
        "spacedock"
      ],
      "model": "Battle Dolphin",
      "speed.tactical": 2000,
      "speed.mnv": 90
    }
  },
  {
    "data.attributes.hp": {
      "temp": 12,
      "tempmax": 12
    },
    "flags.core.sheetClass": "wjmais.WildjammerSheet",
    "flags.wjmais": {
      "air": 800,
      "cargo": 15,
      "crew.min": 4,
      "crew.max": 20,
      "hardpoints.sm": 0,
      "traits.lt.value": [
        "spacedock",
        "water"
      ],
      "model": "Dolphin Shuttle",
      "speed.tactical": 3000,
      "speed.mnv": 135
    }
  },
  {
    "data.attributes.hp": {
      "temp": 36,
      "tempmax": 36
    },
    "flags.core.sheetClass": "wjmais.WildjammerSheet",
    "flags.wjmais": {
      "air": 10800,
      "cargo": 45,
      "crew.min": 20,
      "crew.max": 90,
      "hardpoints.med": 4,
      "hardpoints.lg": 3,
      "traits.lt.value": [
        "spacedock",
        "water"
      ],
      "model": "Dreadnought",
      "speed.tactical": 2000,
      "speed.mnv": 45
    }
  },
  {
    "data.attributes.hp": {
      "temp": 36,
      "tempmax": 36
    },
    "flags.core.sheetClass": "wjmais.WildjammerSheet",
    "flags.wjmais": {
      "air": 10800,
      "cargo": 50,
      "crew.min": 20,
      "crew.max": 90,
      "hardpoints.med": 1,
      "traits.lt.value": [
        "land",
        "spacedock",
        "water"
      ],
      "model": "Whaleship",
      "speed.tactical": 1500,
      "speed.mnv": 45
    }
  },
  {
    "data.attributes.hp": {
      "temp": 26,
      "tempmax": 26
    },
    "flags.core.sheetClass": "wjmais.WildjammerSheet",
    "flags.wjmais": {
      "air": 10200,
      "cargo": 26,
      "crew.min": 18,
      "crew.max": 65,
      "hardpoints.med": 26,
      "traits.lt.value": [
        "spacedock",
        "water"
      ],
      "model": "Clipper",
      "speed.tactical": 1500,
      "speed.mnv": 45
    }
  },
  {
    "data.attributes.hp": {
      "temp": 40,
      "tempmax": 40
    },
    "flags.core.sheetClass": "wjmais.WildjammerSheet",
    "flags.wjmais": {
      "air": 12000,
      "cargo": 50,
      "crew.min": 30,
      "crew.max": 100,
      "hardpoints.lg": 7,
      "traits.lt.value": [
        "land",
        "spacedock"
      ],
      "model": "Cuttle Command",
      "speed.tactical": 1500,
      "speed.mnv": 45
    }
  },
  {
    "data.attributes.hp": {
      "temp": 40,
      "tempmax": 40
    },
    "flags.core.sheetClass": "wjmais.WildjammerSheet",
    "flags.wjmais": {
      "air": 12000,
      "cargo": 50,
      "crew.min": 40,
      "crew.max": 100,
      "hardpoints.med": 3,
      "hardpoints.lg": 14,
      "traits.lt.value": [
        "spacedock"
      ],
      "model": "Armada",
      "speed.tactical": 1500,
      "speed.mnv": 90
    }
  },
  {
    "data.attributes.hp": {
      "temp": 40,
      "tempmax": 40
    },
    "flags.core.sheetClass": "wjmais.WildjammerSheet",
    "flags.wjmais": {
      "air": 12000,
      "cargo": 50,
      "crew.min": 30,
      "crew.max": 100,
      "hardpoints.lg": 6,
      "traits.lt.value": [
        "spacedock"
      ],
      "model": "Deathspider",
      "speed.tactical": 1500,
      "speed.mnv": 45
    }
  },
  {
    "data.attributes.hp": {
      "temp": 74,
      "tempmax": 74
    },
    "flags.core.sheetClass": "wjmais.WildjammerSheet",
    "flags.wjmais": {
      "air": 36000,
      "cargo": 100,
      "crew.min": 75,
      "crew.max": 300,
      "hardpoints.med": 9,
      "hardpoints.lg": 22,
      "traits.lt.value": [
        "land",
        "spacedock"
      ],
      "model": "Tsunami",
      "speed.tactical": 2500,
      "speed.mnv": 135
    }
  }
]

export default WJMAIS;
