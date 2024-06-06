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

function patchResourceBars() {
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


export function applyPatches() {
  patchCompendiumImport();
  patchResourceBars();
  patchRollData();
}
