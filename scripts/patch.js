export function patchItemSheet() {
  // Display wildjammer modules and upgrades as mountable items like vehicle equipment
  libWrapper.register('wjmais', 'game.dnd5e.applications.ItemSheet5e.prototype._isItemMountable', function (wrapped, ...args) {
    const armorType = this.document.data.data?.armor?.type;
    return wrapped(...args) || armorType === "foremantle" || armorType === "module" || armorType === "upgrade";
  }, 'MIXED' );
}

export function patchResourceBars() {
  // Add Bulwark Points bar attribute choice
  libWrapper.register('wjmais', 'TokenDocument.getTrackedAttributeChoices', function (wrapped, ...args) {
    // XXX only add on wildjammer actors
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

  // Modify Bulkwark Points bar attribute
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

export function patchRollData() {
  // Add @ship.ram.dice formula support
  libWrapper.register('wjmais', 'CONFIG.Actor.documentClass.prototype.getRollData', function (wrapped, ...args) {
    const shipId = this.data.flags?.wjmais?.shipId;
    const ship = game?.actors?.get(shipId);
    if (ship) {
      const size = ship.data.data.traits.size;
      this.data.data["ship"] = {"ram": {"dice": CONFIG.WJMAIS.shipRamDice[size]}};
    }
    return wrapped(...args);
  }, 'MIXED' );
}
