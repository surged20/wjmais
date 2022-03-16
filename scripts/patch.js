function patchCompendiumImport() {
  // Override default system token bar values on wildjammer import from compendium.
  // We want token bars from the compendium to be used for ships to pick up BP.
  libWrapper.register('wjmais', 'WorldCollection.prototype.fromCompendium', function (wrapped, ...args) {
    if (!args[0].data.flags?.wjmais?.speed)
      return wrapped(...args);

    const token = args[0].data.token;
    const data = wrapped(...args);
    data.token.bar1 = token.bar1;
    data.token.bar2 = token.bar2;
    return data;
  }, 'MIXED' );
}

function patchItemSheet() {
  // Display wildjammer modules and upgrades as mountable items like vehicle equipment
  libWrapper.register('wjmais', 'game.dnd5e.applications.ItemSheet5e.prototype._isItemMountable', function (wrapped, ...args) {
    const armorType = this.document.data.data?.armor?.type;
    const wjEquipmentTypes = ["foremantle", "material", "modifier", "module", "upgrade"];
    return wrapped(...args) || wjEquipmentTypes.includes(armorType);
  }, 'MIXED' );
}

function patchResourceBars() {
  // Add Bulwark Points bar attribute choice
  libWrapper.register('wjmais', 'TokenDocument.getTrackedAttributeChoices', function (wrapped, ...args) {
    // If no args then it's the default token settings config.
    // Init args with the default tracked attribute choices.
    if (!args[0])
      args[0] = this.getTrackedAttributes();
    args[0].bar.push(["Bulwark Points"]);
    return wrapped(...args);
  }, 'MIXED' );

  // Get Bulwark Points attribute data
  libWrapper.register('wjmais', 'TokenDocument.prototype.getBarAttribute', function (wrapped, ...args) {
    const barName = args[0];
    const alternative = args[1]?.alternative;
    const attr = alternative || (barName ? this.data[barName].attribute : null);
    if (attr === "Bulwark Points") {
      const value = foundry.utils.getProperty(this.actor.data.data, "attributes.hp.temp");
      const max = foundry.utils.getProperty(this.actor.data.data, "attributes.hp.tempmax");
      const model = game.system.model.Actor[this.actor.type];
      return {
        type: "bar",
        attribute: "Bulwark Points",
        value: parseInt(value || 0),
        max: parseInt(max || 0),
        editable: foundry.utils.hasProperty(model, `attributes.hp.temp`)
      }
    }
    else
      return wrapped(...args);
  }, 'MIXED' );

  // Modify Bulwark Points bar attribute
  libWrapper.register('wjmais', 'Actor.prototype.modifyTokenAttribute', function (wrapped, ...args) {
    const attribute = args[0];
    let value = args[1];
    const isDelta = args[2];

    if (attribute === "Bulwark Points") {
      const currentValue = foundry.utils.getProperty(this.data.data, "attributes.hp.temp");
      const currentMax = foundry.utils.getProperty(this.data.data, "attributes.hp.tempmax");

      // Determine the updates to make to the actor data
      if (isDelta) value = Math.clamped(0, Number(currentValue) + value, currentMax);
      const updates = {[`data.attributes.hp.temp`]: value};

      return this.update(updates);
    }
    else
      return wrapped(...args);
  }, 'MIXED' );

  // Display raw HP bar for wildjammers
  libWrapper.register('wjmais', 'game.dnd5e.entities.Token5e.prototype._drawBar', function (wrapped, ...args) {
    if (game.actors.get(this.data.actorId).data.flags?.wjmais?.traits)
      return Object.getPrototypeOf(game.dnd5e.entities.Token5e).prototype._drawBar.apply(this, args);
    else
      return wrapped(...args);
  }, 'MIXED' );

  // Display raw HP value for wildjammers
  libWrapper.register('wjmais', 'game.dnd5e.entities.TokenDocument5e.prototype.getBarAttribute', function (wrapped, ...args) {
    if (game.actors.get(this.data.actorId).data.flags?.wjmais?.traits)
      return Object.getPrototypeOf(game.dnd5e.entities.TokenDocument5e).prototype.getBarAttribute.apply(this, args);
    else
      return wrapped(...args);
  }, 'MIXED' );
}

function patchRollData() {
  libWrapper.register('wjmais', 'game.dnd5e.entities.Actor5e.prototype.getRollData', function (wrapped, ...args) {
    const ship = game?.actors?.get(this.data.flags?.wjmais?.shipId);
    const size = ship ? ship.data.data.traits.size : this.data.data.traits.size;

    // Add @ship.ac.mod and @ship.ram.dice formula support
    this.data.data["ship"] = {
      "ac": {"mod": CONFIG.WJMAIS.shipModifiers[size].ac},
      "ram": {"dice": CONFIG.WJMAIS.shipRamDice[size]}
    };

    return wrapped(...args);
  }, 'MIXED' );
}

function patchProficiency() {
  libWrapper.register('wjmais', 'CONFIG.Actor.documentClass.prototype._prepareVehicleData', function (wrapped, ...args) {
    if (!args[0].flags?.wjmais?.npc)
      wrapped(...args);
  }, 'MIXED' );
}

export function applyPatches() {
  patchCompendiumImport();
  patchItemSheet();
  patchResourceBars();
  patchRollData();
  patchProficiency();
}
