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

function localize(stringId, data = {}) {
  return game.i18n.format(stringId, data);
}

function translateObject(obj) {
  /* translate in place */
  Object.keys(obj).forEach((key) => (obj[key] = localize(obj[key])));

  return obj;
}

function configProperties() {
  CONFIG.Actor.trackableAttributes.vehicle.bar.push("attributes.hp", "Bulwark Points");

  mergeObject(globalThis.game.dnd5e.config.armorClasses, {
    wildjammer: {
      label: localize("WJMAIS.Wildjammer"),
      formula: "10 + @ship.ac.mod",
    },
  });

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

  mergeObject(
    globalThis.game.dnd5e.config.weaponProperties,
    translateObject({
      bf1: "WJMAIS.WeaponPropertyBackfire1",
      bf2: "WJMAIS.WeaponPropertyBackfire2",
      bf3: "WJMAIS.WeaponPropertyBackfire3",
      bf4: "WJMAIS.WeaponPropertyBackfire4",
      clb: "WJMAIS.WeaponPropertyClimbing",
      dpl: "WJMAIS.WeaponPropertyDeployable",
      cr1: "WJMAIS.WeaponPropertyCrew1",
      cr2: "WJMAIS.WeaponPropertyCrew2",
      cr3: "WJMAIS.WeaponPropertyCrew3",
      cr4: "WJMAIS.WeaponPropertyCrew4",
      cr5: "WJMAIS.WeaponPropertyCrew5",
      cr6: "WJMAIS.WeaponPropertyCrew6",
      cr7: "WJMAIS.WeaponPropertyCrew7",
      cr8: "WJMAIS.WeaponPropertyCrew8",
      fmm: "WJMAIS.WeaponPropertyForeMantleModule",
      fxd: "WJMAIS.WeaponPropertyFixed",
      hlm: "WJMAIS.WeaponPropertyHelmsman",
      hps: "WJMAIS.WeaponPropertyHardpointSmall",
      hpm: "WJMAIS.WeaponPropertyHardpointMedium",
      hpl: "WJMAIS.WeaponPropertyHardpointLarge",
      ovh: "WJMAIS.WeaponPropertyOverheat",
      sc1d12: "WJMAIS.WeaponPropertyScatter112",
      sc2d6: "WJMAIS.WeaponPropertyScatter26",
      sc2d10: "WJMAIS.WeaponPropertyScatter210",
      smw: "WJMAIS.WeaponPropertyShipWeapon",
      ram: "WJMAIS.WeaponPropertyRam",
    })
  );
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

  registerMovementKey();

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
      const pack = await game.packs.get("wjmais.quickref");
      const quickref = pack.index.getName("Wildjammer Quick Reference");
      if (quickref) {
        const quickrefDocument = await pack.getDocument(quickref._id);
        quickrefDocument.sheet.render(true);
      }
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
