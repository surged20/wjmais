import { WJMAIS } from "./config.js";
import { applyPatches } from "./patch.js";
import { registerMovementKey } from "./movement.js";
import { updateActorEffects } from "./effects.js";
import { preloadHandlebarsTemplates } from "./templates.js";
import WildjammerSheet from "./wildjammer-sheet.js";

// Register Wildjammer Sheet and make it the default vehicle sheet
Actors.registerSheet("wjmais", WildjammerSheet, {
  label: "WJMAIS.WildjammerSheet",
  types: ["vehicle"],
  makeDefault: true,
});

// Handlebars helper: has
// check if a value is contained in a set
Handlebars.registerHelper("has", function (value, set, options) {
  // fallback...
  set = set instanceof Set ? set : { set };
  return set.has(value) ? options.fn(this) : "";
});

function localize(stringId, data = {}) {
  return game.i18n.format(stringId, data);
}

function translateObject(obj) {
  /* translate in place */
  Object.keys(obj).forEach((key) => (obj[key] = localize(obj[key])));

  return obj;
}

function translateProperties(obj) {
  /* translate in place */
  Object.keys(obj).forEach(
    (key) => (obj[key].label = localize(obj[key].label))
  );

  return obj;
}

function configProperties() {
  CONFIG.Actor.trackableAttributes.vehicle.bar.push(
    "attributes.hp",
    "Bulwark Points"
  );

  CONFIG.DND5E.armorClasses.wildjammer = {
    label: localize("WJMAIS.Wildjammer"),
    formula: "10 + @ship.ac.mod",
  };

  mergeObject(
    globalThis.game.dnd5e.config.equipmentTypes,
    translateObject({
      foremantle: "WJMAIS.ForeMantleModule",
      material: "WJMAIS.HullMaterial",
      modifier: "WJMAIS.HullModifier",
      module: "WJMAIS.ShipModule",
      upgrade: "WJMAIS.ShipUpgrade",
    })
  );

  mergeObject(
    globalThis.game.dnd5e.config.miscEquipmentTypes,
    translateObject({
      foremantle: "WJMAIS.ForeMantleModule",
      material: "WJMAIS.HullMaterial",
      modifier: "WJMAIS.HullModifier",
      module: "WJMAIS.ShipModule",
      upgrade: "WJMAIS.ShipUpgrade",
    })
  );

  mergeObject(globalThis.game.dnd5e.config.spellTags, {
    megascale: {
      label: localize("WJMAIS.Megascale"),
      abbr: localize("WJMAIS.MegascaleAbbr"),
    },
  });

  const wjWeaponProperties = {
    bf1: { label: "WJMAIS.WeaponPropertyBackfire1" },
    bf2: { label: "WJMAIS.WeaponPropertyBackfire2" },
    bf3: { label: "WJMAIS.WeaponPropertyBackfire3" },
    bf4: { label: "WJMAIS.WeaponPropertyBackfire4" },
    clb: { label: "WJMAIS.WeaponPropertyClimbing" },
    dpl: { label: "WJMAIS.WeaponPropertyDeployable" },
    cr1: { label: "WJMAIS.WeaponPropertyCrew1" },
    cr2: { label: "WJMAIS.WeaponPropertyCrew2" },
    cr3: { label: "WJMAIS.WeaponPropertyCrew3" },
    cr4: { label: "WJMAIS.WeaponPropertyCrew4" },
    cr5: { label: "WJMAIS.WeaponPropertyCrew5" },
    cr6: { label: "WJMAIS.WeaponPropertyCrew6" },
    cr7: { label: "WJMAIS.WeaponPropertyCrew7" },
    cr8: { label: "WJMAIS.WeaponPropertyCrew8" },
    fmm: { label: "WJMAIS.WeaponPropertyForeMantleModule" },
    fxd: { label: "WJMAIS.WeaponPropertyFixed" },
    hlm: { label: "WJMAIS.WeaponPropertyHelmsman" },
    hps: { label: "WJMAIS.WeaponPropertyHardpointSmall" },
    hpm: { label: "WJMAIS.WeaponPropertyHardpointMedium" },
    hpl: { label: "WJMAIS.WeaponPropertyHardpointLarge" },
    ovh: { label: "WJMAIS.WeaponPropertyOverheat" },
    sc1d12: { label: "WJMAIS.WeaponPropertyScatter112" },
    sc2d6: { label: "WJMAIS.WeaponPropertyScatter26" },
    sc2d10: { label: "WJMAIS.WeaponPropertyScatter210" },
    smw: { label: "WJMAIS.WeaponPropertyShipWeapon" },
    ram: { label: "WJMAIS.WeaponPropertyRam" },
  };

  mergeObject(
    CONFIG.DND5E.itemProperties,
    translateProperties(wjWeaponProperties)
  );
  Object.keys(wjWeaponProperties).forEach((key) =>
    CONFIG.DND5E.validProperties.weapon.add(key)
  );
}

async function openQuickReference() {
  const pack = await game.packs.get("wjmais.quickref");
  const quickref = pack.index.getName("Wildjammer Quick Reference");
  if (quickref) {
    const quickrefDocument = await pack.getDocument(quickref._id);
    quickrefDocument.sheet.render(true);
  }
}

function registerKeys() {
  registerMovementKey();

  game.keybindings.register("wjmais", "openQuickReference", {
    name: "SETTINGS.WJMAIS.OpenQuickReferenceN",
    hint: "SETTINGS.WJMAIS.OpenQuickReferenceH",
    editable: [
      {
        key: "KeyQ",
      },
    ],
    onDown: () => {
      openQuickReference();
      return true;
    },
  });
}

function registerSettings() {
  game.settings.register("wjmais", "rollPcWeapons", {
    name: "SETTINGS.WJMAIS.RollPcWeaponsN",
    hint: "SETTINGS.WJMAIS.RollPcWeaponsH",
    scope: "world",
    type: Boolean,
    default: false,
    config: true,
  });
  game.settings.register("wjmais", "roleChangeChat", {
    name: "SETTINGS.WJMAIS.RoleChangeChatN",
    hint: "SETTINGS.WJMAIS.RoleChangeChatH",
    scope: "world",
    type: Boolean,
    default: false,
    config: true,
  });
}

function updateLogo() {
  document.getElementById("logo").src =
    "modules/wjmais/assets/wj-logo-banner.webp";
  document.getElementById("logo").style = "left: 12px; top: 12px";
}

Hooks.once("init", function () {
  if (!game.modules.get("lib-wrapper")?.active && game.user.isGM) {
    ui.notifications.error(
      "Module wjmais requires the 'libWrapper' module. Please install and activate it."
    );
    return;
  }

  applyPatches();

  console.log("wjmais | Initializing Wildjammer: More Adventures in Space");

  CONFIG.WJMAIS = WJMAIS;

  registerKeys();
  registerSettings();

  preloadHandlebarsTemplates();

  updateLogo();

  /**
   * This function runs after game data has been requested and loaded from the servers, so entities exist
   */
  Hooks.once("setup", function () {
    configProperties();

    // Localize WJMAIS objects once up-front
    const toLocalize = [
      "actorSizes",
      "bridgeCrewRoles",
      "landingTypes",
      "shipClass",
    ];

    // Exclude some from sorting where the default order matters
    const noSort = [""];

    // Localize and sort WJMAIS objects
    for (let o of toLocalize) {
      const localized = Object.entries(WJMAIS[o]).map((e) => {
        return [e[0], game.i18n.localize(e[1])];
      });
      if (!noSort.includes(o))
        localized.sort((a, b) => a[1].localeCompare(b[1]));
      WJMAIS[o] = localized.reduce((obj, e) => {
        obj[e[0]] = e[1];
        return obj;
      }, {});
    }
  });

  Hooks.on("ready", () => {
    $("#logo").click(async () => {
      openQuickReference();
    });
  });

  Hooks.on("createActiveEffect", (effect) => {
    updateActorEffects(effect);
  });

  Hooks.on("deleteActiveEffect", (effect) => {
    updateActorEffects(effect, true);
  });

  Hooks.on("updateActiveEffect", (effect) => {
    updateActorEffects(effect);
  });
});
