import { DND5E } from "/systems/dnd5e/module/config.js";
import { WJMAIS } from "./config.js";
import { preloadHandlebarsTemplates } from "./templates.js";
import WildjammerSheet from "./wildjammer-sheet.js";

DND5E.equipmentTypes["module"] = "Wildjammer Module";
DND5E.equipmentTypes["upgrade"] = "Wildjammer Upgrade";

DND5E.weaponProperties["bf1"] = "Backfire 1";
DND5E.weaponProperties["bf2"] = "Backfire 2";
DND5E.weaponProperties["bf3"] = "Backfire 3";
DND5E.weaponProperties["bf4"] = "Backfire 4";
DND5E.weaponProperties["clb"] = "Climbing";
DND5E.weaponProperties["cr1"] = "Crew 1";
DND5E.weaponProperties["cr2"] = "Crew 2";
DND5E.weaponProperties["cr3"] = "Crew 3";
DND5E.weaponProperties["cr4"] = "Crew 4";
DND5E.weaponProperties["cr5"] = "Crew 5";
DND5E.weaponProperties["cr6"] = "Crew 6";
DND5E.weaponProperties["cr8"] = "Crew 8";
DND5E.weaponProperties["fxd"] = "Fixed";
DND5E.weaponProperties["hlm"] = "Helmsman";
DND5E.weaponProperties["hps"] = "Hardpoint (Small)";
DND5E.weaponProperties["hpm"] = "Hardpoint (Medium)";
DND5E.weaponProperties["hpl"] = "Hardpoint (Large)";
DND5E.weaponProperties["ovh"] = "Overheat";
DND5E.weaponProperties["sc1d12"] = "Scatter (1d12)";
DND5E.weaponProperties["sc2d6"] = "Scatter (2d6)";
DND5E.weaponProperties["smw"] = "Ship Mounted Weapon";

// Register Wildjammer Sheet and make it the default vehicle sheet
Actors.registerSheet("wjmais", WildjammerSheet, {
  label: "WJMAIS.WildjammerSheet",
  types: ["vehicle"],
  makeDefault: true
});

function registerSettings() {

  game.settings.register('wjmais', "roleChangeChat", {
    name: "SETTINGS.WJMAIS.RoleChangeChatN",
    hint: "SETTINGS.WJMAIS.RoleChangeChatH",
    scope: "world",
    type: Boolean,
    default: false,
    config: true
  });

}

Hooks.once("init", function() {
  CONFIG.WJMAIS = WJMAIS;

  console.log("wjmais | Initializing Wildjammer: More Adventures in Space");

  registerSettings();

  preloadHandlebarsTemplates();

  /**
   * This function runs after game data has been requested and loaded from the servers, so entities exist
   */
  Hooks.once("setup", function() {
    // Localize WJMAIS objects once up-front
    const toLocalize = [
      "actorSizes", "bridgeCrewRoles", "landingTypes"
    ];

    // Exclude some from sorting where the default order matters
    const noSort = [
      "",
    ];

    // Localize and sort WJMAIS objects
    for ( let o of toLocalize ) {
      const localized = Object.entries(WJMAIS[o]).map(e => {
        return [e[0], game.i18n.localize(e[1])];
      });
      if ( !noSort.includes(o) ) localized.sort((a, b) => a[1].localeCompare(b[1]));
      WJMAIS[o] = localized.reduce((obj, e) => {
        obj[e[0]] = e[1];
        return obj;
      }, {});
    }
  });

  Hooks.once('ready', () => {
    if(!game.modules.get('lib-wrapper')?.active && game.user.isGM) {
      ui.notifications.error("Module wjmais requires the 'libWrapper' module. Please install and activate it.");
      return;
    }

    // Display wildjammer modules and upgrades as mountable items like vehicle equipment
    libWrapper.register('wjmais', 'game.dnd5e.applications.ItemSheet5e.prototype._isItemMountable', function (wrapped, ...args) {
      const armorType = this.document.data.data?.armor?.type;
      return wrapped(...args) || armorType === "module" || armorType === "upgrade";
    }, 'MIXED' );
  });

  Hooks.on('updateActor', (actor, data) => {
    if (actor.data.type === "vehicle" && !actor.data.flags?.wjmais?.model && actor.data.name != "Importing..." && actor.data.data.attributes.ac.value ) {
      const shipData = WJMAIS.shipData.find( (ship) => ship["flags.wjmais"].model === actor.data.name );
      if (shipData) actor.update(shipData);
    }
  });

});
