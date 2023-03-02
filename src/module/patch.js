function patchCompendiumImport() {
  // Override default system token bar values on wildjammer import from compendium.
  // We want token bars from the compendium to be used for ships to pick up BP.
  libWrapper.register(
    "wjmais",
    "WorldCollection.prototype.fromCompendium",
    function (wrapped, ...args) {
      if (!args[0].flags?.wjmais?.speed) return wrapped(...args);

      const prototypeToken = args[0].prototypeToken;
      const data = wrapped(...args);
      data.prototypeToken.bar1 = prototypeToken.bar1;
      data.prototypeToken.bar2 = prototypeToken.bar2;
      return data;
    },
    "MIXED"
  );
}

function patchItemSheet() {
  // Display wildjammer modules and upgrades as mountable items like vehicle equipment
  libWrapper.register(
    "wjmais",
    "game.dnd5e.applications.item.ItemSheet5e.prototype._isItemMountable",
    function (wrapped, ...args) {
      const armorType = this.document.system?.armor?.type;
      const wjEquipmentTypes = [
        "foremantle",
        "material",
        "modifier",
        "module",
        "upgrade",
      ];
      return wrapped(...args) || wjEquipmentTypes.includes(armorType);
    },
    "MIXED"
  );
}

function patchResourceBars() {
  // Add Bulwark Points bar attribute choice
  libWrapper.register(
    "wjmais",
    "TokenDocument.getTrackedAttributeChoices",
    function (wrapped, ...args) {
      // If no args then it's the default token settings config.
      // Init args with the default tracked attribute choices.
      if (!args[0]) args[0] = this.getTrackedAttributes();
      args[0].bar.push(["Bulwark Points"]);
      return wrapped(...args);
    },
    "MIXED"
  );

  // Get Bulwark Points attribute data
  libWrapper.register(
    "wjmais",
    "TokenDocument.prototype.getBarAttribute",
    function (wrapped, ...args) {
      const barName = args[0];
      const alternative = args[1]?.alternative;
      const attr = alternative || (barName ? this[barName].attribute : null);
      if (attr === "Bulwark Points") {
        const value = foundry.utils.getProperty(
          this.actor.system,
          "attributes.hp.temp"
        );
        const max = foundry.utils.getProperty(
          this.actor.system,
          "attributes.hp.tempmax"
        );
        const model = game.system.model.Actor[this.actor.type];
        return {
          type: "bar",
          attribute: "Bulwark Points",
          value: parseInt(value || 0),
          max: parseInt(max || 0),
          editable: foundry.utils.hasProperty(model, `attributes.hp.temp`),
        };
      } else return wrapped(...args);
    },
    "MIXED"
  );

  // Modify Bulwark Points bar attribute
  libWrapper.register(
    "wjmais",
    "Actor.prototype.modifyTokenAttribute",
    function (wrapped, ...args) {
      const attribute = args[0];
      let value = args[1];
      const isDelta = args[2];

      if (attribute === "Bulwark Points") {
        const currentValue = foundry.utils.getProperty(
          this.system,
          "attributes.hp.temp"
        );
        const currentMax = foundry.utils.getProperty(
          this.system,
          "attributes.hp.tempmax"
        );

        // Determine the updates to make to the actor data
        if (isDelta)
          value = Math.clamped(0, Number(currentValue) + value, currentMax);
        const updates = { [`system.attributes.hp.temp`]: value };

        return this.update(updates);
      } else return wrapped(...args);
    },
    "MIXED"
  );

  // Display raw HP bar for wildjammers
  libWrapper.register(
    "wjmais",
    "game.dnd5e.canvas.Token5e.prototype._drawBar",
    function (wrapped, ...args) {
      if (game.actors.get(this.document.actorId).flags?.wjmais?.traits)
        return Object.getPrototypeOf(
          game.dnd5e.canvas.Token5e
        ).prototype._drawBar.apply(this, args);
      else return wrapped(...args);
    },
    "MIXED"
  );

  // Display raw HP value for wildjammers
  libWrapper.register(
    "wjmais",
    "game.dnd5e.documents.TokenDocument5e.prototype.getBarAttribute",
    function (wrapped, ...args) {
      if (game.actors.get(this.actorId)?.flags?.wjmais?.traits)
        return Object.getPrototypeOf(
          game.dnd5e.documents.TokenDocument5e
        ).prototype.getBarAttribute.apply(this, args);
      else return wrapped(...args);
    },
    "MIXED"
  );
}

function patchRollData() {
  libWrapper.register(
    "wjmais",
    "game.dnd5e.documents.Actor5e.prototype.getRollData",
    function (wrapped, ...args) {
      const ship = game?.actors?.get(this.flags?.wjmais?.shipId);
      const size = ship ? ship.system.traits.size : this.system.traits.size;

      // Add @ship.ac.mod formula support
      this.system["ship"] = {
        ac: { mod: CONFIG.WJMAIS.shipModifiers[size].ac },
      };

      return wrapped(...args);
    },
    "MIXED"
  );
}

function patchProficiency() {
  libWrapper.register(
    "wjmais",
    "CONFIG.Actor.documentClass.prototype._prepareVehicleData",
    function (wrapped, ...args) {
      if (this.flags?.wjmais?.npc) wrapped(...args);
    },
    "MIXED"
  );
}

export function applyPatches() {
  patchCompendiumImport();
  patchItemSheet();
  patchResourceBars();
  patchRollData();
  patchProficiency();
}
