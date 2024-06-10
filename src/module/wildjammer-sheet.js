import WildjammerSpeedConfig from "./speed-config.js";
import SelectItemPrompt from "./select-item-prompt.js";

/**
 * Is the item a fore mantle module?
 * @param {Item5e} item   The item data object
 */
function isForeMantleModule(item) {
  return item.type === "equipment" && item.system?.type.value === "foremantle";
}

/**
 * Is the item a ship mounted weapon?
 * @param {Item5e} item   The item data object
 */
function isGunnerWeapon(item) {
  return (
    item.type === "weapon" &&
    item.system?.properties.has("smw") &&
    !item.system?.properties.has("hlm")
  );
}

/**
 * Is the item a helmsman weapon?
 * @param {Item5e} item   The item data object
 */
function isHelmsmanWeapon(item) {
  return item.type === "weapon" && item.system?.properties.has("hlm");
}

/**
 * Is the item a crewed ship weapon?
 * @param {Item5e} item   The item data object
 */
function isShipWeaponCrewed(item) {
  return item.type === "weapon" && item.flags?.wjmais?.crewed;
}

/**
 * Is the role Fighter Helmsman or Gunner?
 * @param String   The role value
 */
function isFighterHelmsmanGunner(role) {
  return role === "fighterhelmsman" || role === "gunner";
}

/**
 * Is the role Helmsman?
 * @param String   The role value
 */
function isHelmsman(role) {
  return role === "helmsman";
}

async function isRoleChangeInvalid(role, ship, creature) {
  // Error if actor already assigned
  const creatureShipId = creature.flags?.wjmais?.shipId;
  if (creatureShipId && role != "unassigned") {
    const ship = game.actors.get(creature.flags.wjmais.shipId);
    if (ship && ship.id != creatureShipId) {
      ui.notifications.error(
        creature.name +
          game.i18n.localize("WJMAIS.ActorAlreadyAssigned") +
          (ship ? ship.name : "unknown ship")
      );
      return true;
    } else {
      await creature.unsetFlag("wjmais", "shipId");
    }
  }
  // Error if unique role filled
  if (
    CONFIG.WJMAIS.uniqueBridgeCrewRoles.includes(role) &&
    ship.items.toObject().some((i) => i.flags?.wjmais?.role === role)
  ) {
    ui.notifications.error(
      CONFIG.WJMAIS.bridgeCrewRoles[role] +
        game.i18n.localize("WJMAIS.RoleAlreadyFilled")
    );
    return true;
  }
}

async function notifyBridgeCrewRoleChange(ship, actor, role) {
  let roleChangeMessage;
  if (role === "unassigned") {
    roleChangeMessage =
      game.i18n.localize("WJMAIS.RoleIsUnassigned") + ship.name;
  } else {
    const roleName = game.i18n.localize(CONFIG.WJMAIS.bridgeCrewRoles[role]);
    roleChangeMessage =
      game.i18n.localize("WJMAIS.RoleIsAssigned") + ship.name + " ";
    if (isFighterHelmsmanGunner(role)) {
      const shipWeaponId = actor.items.find((i) =>
        i.system?.properties.has("smw")
      ).flags?.wjmais?.swid;
      if (shipWeaponId)
        roleChangeMessage += ship.items.get(shipWeaponId).name + " ";
    }
    roleChangeMessage += roleName;
  }
  if (game.settings.get("wjmais", "roleChangeChat")) {
    await ChatMessage.create({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      type: CONST.CHAT_MESSAGE_TYPES.EMOTE,
      content: roleChangeMessage,
    });
  }
}

async function createCrewOwnedItem(item, ship, crewMember) {
  const itemData = duplicate(item);
  itemData.name = itemData.name + " (" + ship.name + ")";
  itemData.system.equipped = true;
  itemData.flags["wjmais.swid"] = item.id;
  await crewMember.createEmbeddedDocuments("Item", [itemData]);
  await item.setFlag("wjmais", "crewed", crewMember.id);
}

async function updateRole(creature, ship, role) {
  const currentRole = creature.flags?.wjmais?.role;

  // Uncrew and delete all owned ship items when leaving F-H, Gunner, or Helmsman roles
  if (isFighterHelmsmanGunner(currentRole) || isHelmsman(currentRole)) {
    for (const item of creature.items.filter((i) => i.flags?.wjmais?.swid)) {
      const shipItem = await ship.items.get(item.flags?.wjmais?.swid);
      await shipItem.unsetFlag("wjmais", "crewed");
      await item.delete();
    }
  }

  if (isFighterHelmsmanGunner(role)) {
    const shipWeapons = ship.items.filter(
      (i) => isGunnerWeapon(i) && !isShipWeaponCrewed(i)
    );

    if (shipWeapons.length === 0) {
      ui.notifications.warn(
        ship.name + game.i18n.localize("WJMAIS.ShipHasNoWeapons")
      );
      return false;
    }

    let shipWeapon = shipWeapons[0];
    // Prompt if there's more than one ship weapon to choose from
    if (shipWeapons.length > 1) {
      const shipWeaponId = await SelectItemPrompt.create(shipWeapons, {});
      shipWeapon = ship.items.get(shipWeaponId);
    }

    if (shipWeapon) await createCrewOwnedItem(shipWeapon, ship, creature);
  }

  if (isHelmsman(role)) {
    // Helmsman owns multiple ship items
    for (const item of ship.items.filter(
      (i) => isHelmsmanWeapon(i) || isForeMantleModule(i)
    )) {
      await createCrewOwnedItem(item, ship, creature);
    }
  }

  if (role === "unassigned") await creature.unsetFlag("wjmais", "shipId");
  else await creature.setFlag("wjmais", "shipId", ship.id);

  await creature.setFlag("wjmais", "role", role);

  return true;
}

/**
 * An Actor sheet for Wildjammer vehicle type actors.
 * Extends the base ActorSheet5e class.
 * @type {ActorSheet5e}
 */
export default class WildjammerSheet extends dnd5e.applications.actor
  .ActorSheet5e {
  /**
   * Define default rendering options for the Vehicle sheet.
   * @returns {Object}
   */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["dnd5e", "sheet", "actor", "vehicle"],
      width: 680,
      height: 680,
    });
  }

  /**
   * Prepare the data structure for traits data like languages, resistances & vulnerabilities, and proficiencies.
   * @param {object} systemData  System data for the Actor being prepared.
   * @returns {object}           Prepared trait data.
   * @protected
   */
  _prepareTraits(systemData) {
    let traits = super._prepareTraits(systemData);
    const flagData = this.actor.flags.wjmais;
    const key = "traits.lt";
    const data = foundry.utils.deepClone(
      foundry.utils.getProperty(flagData, key)
    );
    foundry.utils.setProperty(traits, key, data);

    let values = data.value;
    if (!values) values = [];
    else if (values instanceof Set) values = Array.from(values);
    else if (!Array.isArray(values)) values = [values];

    data.selected = values.reduce((obj, key) => {
      obj[key] = CONFIG.WJMAIS.landingTypes[key];
      return obj;
    }, {});

    // Add custom entries
    if (data.custom)
      data.custom
        .split(";")
        .forEach((c, i) => (data.selected[`custom${i + 1}`] = c.trim()));
    data.cssClass = !foundry.utils.isEmpty(data.selected) ? "" : "inactive";

    return traits;
  }

  async getData(options) {
    const context = await super.getData(options);

    const actorFlags = this.actor.flags;
    if (!actorFlags?.wjmais) actorFlags["wjmais"] = {};
    if (!actorFlags?.wjmais?.traits)
      actorFlags["wjmais"]["traits"] = { lt: { value: ["spacedock"] } };
    if (!actorFlags?.wjmais?.speed)
      actorFlags["wjmais"]["speed"] = { tactical: 0, mnv: 0 };
    this._prepareTraits(actorFlags.wjmais.traits);

    context.flags = actorFlags;
    context.config = CONFIG.WJMAIS;
    context.isNPC = actorFlags?.wjmais?.npc;
    context.isGM = game.user.isGM;

    return context;
  }

  /* -------------------------------------------- */

  /**
   * Get the correct HTML template path to use for rendering this particular sheet
   * @type {String}
   */
  get template() {
    return "modules/wjmais/templates/actors/wildjammer.html";
  }

  /* -------------------------------------------- */

  /** @override */
  async _onDropActor(event, data) {
    let actor = await fromUuid(data.uuid);
    if (!actor) return;

    const itemData = {
      name: actor.name,
      type: "feat",
      img: actor.img,
      data: duplicate({}),
      flags: { wjmais: { role: "unassigned", actorId: actor.id } },
    };
    delete itemData.data["type"];

    if (actor.type === "vehicle") {
      ui.notifications.error(game.i18n.localize("WJMAIS.NoShipPolymorph"));
      return;
    }

    // DnD actor to a bridge crew role
    for (const [role] of Object.entries(CONFIG.WJMAIS.bridgeCrewRoles)) {
      if (event.target.classList.contains(role) || role === "unassigned") {
        // Error if actor dropped from compendium
        if (actor.pack) {
          ui.notifications.error(
            game.i18n.localize("WJMAIS.CompendiumActorRole")
          );
          return;
        }
        if (await isRoleChangeInvalid(role, this.actor, actor)) return;
        itemData.flags.wjmais.role = role;
        itemData.description = { value: CONFIG.WJMAIS.bridgeCrewRoles[role] };
        if (!(await updateRole(actor, this.actor, role))) return;
        await this.actor.createEmbeddedDocuments("Item", [itemData]);
        await notifyBridgeCrewRoleChange(this.actor, actor, role);
        return;
      }
    }
  }

  /** @override */
  async _onDropItem(event, itemData) {
    const item = await fromUuid(itemData.uuid);
    // DnD bridge crew to another bridge crew role
    if (item.flags?.wjmais?.role) {
      for (const [role] of Object.entries(CONFIG.WJMAIS.bridgeCrewRoles)) {
        if (event.target.classList.contains(role)) {
          const creature = game.actors.get(item.flags.wjmais.actorId);
          if (creature) {
            if (await isRoleChangeInvalid(role, this.actor, creature)) break;
            if (!(await updateRole(creature, this.actor, role))) break;
            await item.update({ flags: { wjmais: { role: role } } });
            await notifyBridgeCrewRoleChange(this.actor, creature, role);
            break;
          }
        }
      }
    } else {
      return super._onDropItem(event, itemData);
    }
  }

  /** @override */
  async _onDropItemCreate(itemData) {
    if (itemData.type === "weapon") {
      if (itemData.system.properties.has("smw")) {
        foundry.utils.setProperty(itemData, "flags.wjmais.location", "forward");
        foundry.utils.setProperty(itemData, "flags.wjmais.facing", 90);
      }
      if (itemData.system.properties.has("ram")) {
        const ramDiceNum =
          CONFIG.WJMAIS.shipRamDice[this.actor.system.traits.size];
        if (itemData.system.damage.parts.length > 1) {
          const ramDamageDie = Roll.parse(itemData.system.damage.parts[0][0])[0]
            .faces;
          const backlashDamageDie = Roll.parse(
            itemData.system.damage.parts[1][0]
          )[0].faces;
          foundry.utils.setProperty(itemData, "system.damage.parts", [
            [
              `${ramDiceNum}d${ramDamageDie}`,
              itemData.system.damage.parts[0][1],
            ],
            [
              `${ramDiceNum}d${backlashDamageDie}`,
              itemData.system.damage.parts[1][1],
            ],
          ]);
        } else if (itemData.system.damage.parts.length > 0) {
          const ramDamageDie = Roll.parse(itemData.system.damage.parts[0][0])[0]
            .faces;
          foundry.utils.setProperty(itemData, "system.damage.parts", [
            [
              `${ramDiceNum}d${ramDamageDie}`,
              itemData.system.damage.parts[0][1],
            ],
          ]);
        }
        if (itemData.system.damage.versatile) {
          const backlashDamageDie = Roll.parse(
            itemData.system.damage.versatile
          )[0].faces;
          foundry.utils.setProperty(
            itemData,
            "system.damage.versatile",
            `${ramDiceNum}d${backlashDamageDie}`
          );
        }
      }
    }
    return super._onDropItemCreate(itemData);
  }

  _onItemRoll(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (this._isRollable(item)) super._onItemRoll(event);
  }

  /**
   * Creates a new cargo entry for a vehicle Actor.
   * @type {object}
   */
  static get newCargo() {
    return { name: "", quantity: 1 };
  }

  /* -------------------------------------------- */

  /**
   * Compute the total weight of the vehicle's cargo.
   * @param {Number} totalWeight    The cumulative item weight from inventory items
   * @param {Object} actorData      The data object for the Actor being rendered
   * @returns {{max: number, value: number, pct: number}}
   * @private
   */
  _computeEncumbrance(totalWeight, actorData) {
    // Compute currency weight
    const totalCoins = Object.values(actorData.system.currency).reduce(
      (acc, denom) => acc + denom,
      0
    );
    totalWeight +=
      totalCoins / CONFIG.DND5E.encumbrance.currencyPerWeight.imperial;

    // Compute overall encumbrance
    const max = actorData.actor.flags?.wjmais?.cargo * 2000;
    const pct = Math.clamp((totalWeight * 100) / max, 0, 100);
    return { value: totalWeight.toNearest(0.1), max, pct };
  }

  /* -------------------------------------------- */

  /** @override */
  _getMovementSpeed(actorData, largestPrimary = true) {
    return super._getMovementSpeed(actorData, largestPrimary);
  }

  /* -------------------------------------------- */

  /**
   * Prepare items that are mounted to a vehicle and are equippable.
   * @private
   */
  _prepareEquippableItem(item, context) {
    const isActive = !!item.system.equipped;
    context.toggleClass = isActive ? "active" : "";
    context.toggleTitle = game.i18n.localize(
      isActive ? "DND5E.Equipped" : "DND5E.Unequipped"
    );
    context.canToggle = "equipped" in item.system;
  }

  /**
   * Remove actor role
   * @param {Item} item   The role item
   * @private
   */
  async _doRemoveRole(item) {
    const actor = game.actors.get(item.flags.wjmais.actorId);
    await updateRole(actor, this.actor, "unassigned");
    notifyBridgeCrewRoleChange(actor, "unassigned");
  }

  /**
   * Is ship an NPC?
   * @private
   */
  _isNPC() {
    return this.actor.flags?.wjmais?.npc;
  }

  /**
   * Is the item rollable?
   * @param {ItemData} itemData   The item data object
   * @private
   */
  _isRollable(item) {
    if (this._isNPC()) return true;

    if (
      (item.system?.properties.has("smw") ||
        item.system?.type.value === "foremantle") &&
      !game.settings.get("wjmais", "rollPcWeapons")
    )
      return false;

    return true;
  }

  /**
   * Get required crew from weapon properties.
   * @private
   */
  _getCrewValue(item) {
    const crewProperties = Object.keys(CONFIG.WJMAIS.crewValues);
    const itemProperties = Array.from(item.system.properties);
    const crewProperty = crewProperties.find((r) => itemProperties.includes(r));

    return crewProperty ? CONFIG.WJMAIS.crewValues[crewProperty] : 0;
  }

  /* -------------------------------------------- */

  /**
   * Organize Owned Items for rendering the Vehicle sheet.
   * @private
   */
  _prepareItems(context) {
    const cargoColumns = [
      {
        label: game.i18n.localize("DND5E.Quantity"),
        css: "item-qty",
        property: "quantity",
        editable: "Number",
      },
    ];

    const moduleColumns = [
      {
        label: game.i18n.localize("DND5E.Weight"),
        css: "item-weight",
        property: "system.weight",
        editable: "Number",
      },
      {
        label: game.i18n.localize("DND5E.HP"),
        css: "item-hp",
        property: "system.hp.value",
        editable: "Number",
      },
    ];

    const upgradeColumns = [
      {
        label: game.i18n.localize("DND5E.Quantity"),
        css: "item-qty",
        property: "system.quantity",
      },
    ];

    const weaponColumns = [
      {
        label: game.i18n.localize("WJMAIS.WeaponMountFacing"),
        css: "item-facing",
        visible: "fxd",
        property: "flags.wjmais.facing",
        table: CONFIG.WJMAIS.weaponMountFacing,
        editable: true,
      },
      {
        label: game.i18n.localize("WJMAIS.WeaponMountLocation"),
        css: "item-location",
        visible: "smw",
        property: "flags.wjmais.location",
        table: CONFIG.WJMAIS.weaponMountLocation,
        editable: true,
      },
      {
        label: game.i18n.localize("WJMAIS.Crew"),
        css: "item-crew",
        property: "crewValue",
      },
      {
        label: game.i18n.localize("DND5E.HP"),
        css: "item-hp",
        property: "system.hp.value",
        editable: "Number",
      },
    ];

    const features = {
      actions: {
        label: game.i18n.localize("DND5E.ActionPl"),
        items: [],
        equippable: true,
        dataset: { type: "feat", "activation.type": "crew" },
      },
      passive: {
        label: game.i18n.localize("DND5E.Features"),
        items: [],
        equippable: true,
        dataset: { type: "feat" },
      },
      hull: {
        label: game.i18n.localize("WJMAIS.ItemTypeHull"),
        items: [],
        equippable: true,
        dataset: {
          type: "equipment",
          "type.value": "material",
          "hp.max": 10,
          "hp.value": 10,
        },
      },
      modules: {
        label: game.i18n.localize("WJMAIS.ItemTypeModules"),
        items: [],
        equippable: true,
        dataset: {
          type: "equipment",
          "type.value": "module",
          "hp.max": 10,
          "hp.value": 10,
        },
        columns: moduleColumns,
      },
      reactions: {
        label: game.i18n.localize("DND5E.ReactionPl"),
        items: [],
        equippable: true,
        dataset: { type: "feat", "activation.type": "reaction" },
      },
      upgrades: {
        label: game.i18n.localize("WJMAIS.ItemTypeUpgrades"),
        items: [],
        equippable: true,
        dataset: {
          type: "equipment",
          "type.value": "upgrade",
        },
        columns: upgradeColumns,
      },
      weapons: {
        label: game.i18n.localize("ITEM.TypeWeaponPl"),
        items: [],
        equippable: true,
        dataset: {
          type: "weapon",
          "properties.smw": true,
          "action-type": "mwak",
          "hp.max": 10,
          "hp.value": 10,
        },
        columns: weaponColumns,
      },
    };

    const cargo = {
      crew: {
        label: game.i18n.localize("DND5E.VehicleCrew"),
        items: context.actor.system.cargo.crew,
        css: "cargo-row crew",
        editableName: true,
        dataset: { type: "crew" },
        columns: cargoColumns,
      },
      passengers: {
        label: game.i18n.localize("DND5E.VehiclePassengers"),
        items: context.actor.system.cargo.passengers,
        css: "cargo-row passengers",
        editableName: true,
        dataset: { type: "passengers" },
        columns: cargoColumns,
      },
      cargo: {
        label: game.i18n.localize("DND5E.VehicleCargo"),
        items: [],
        dataset: { type: "loot" },
        columns: [
          {
            label: game.i18n.localize("DND5E.Quantity"),
            css: "item-qty",
            property: "system.quantity",
            editable: "Number",
          },
          {
            label: game.i18n.localize("DND5E.Price"),
            css: "item-price",
            property: "system.price.value",
            editable: "Number",
          },
          {
            label: game.i18n.localize("DND5E.Weight"),
            css: "item-weight",
            property: "system.weight.value",
            editable: "Number",
          },
        ],
      },
    };

    const fighterRoles = {
      fighterhelmsman: {
        role: "fighterhelmsman",
        label: game.i18n.localize("WJMAIS.RoleFighterHelmsman"),
        items: [],
        dataset: { type: "feat", "flags.wjmais.role": "fighterhelmsman" },
      },
      unassigned: {
        role: "unassigned",
        label: game.i18n.localize("WJMAIS.RoleUnassigned"),
        items: [],
        dataset: { type: "feat", "flags.wjmais.role": "unassigned" },
      },
    };

    const shipRoles = {
      captain: {
        role: "captain",
        label: game.i18n.localize("WJMAIS.RoleCaptain"),
        items: [],
        dataset: { type: "feat", "flags.wjmais.role": "captain" },
      },
      helmsman: {
        role: "helmsman",
        label: game.i18n.localize("WJMAIS.RoleHelmsman"),
        items: [],
        dataset: { type: "feat", "flags.wjmais.role": "helmsman" },
      },
      boatswain: {
        role: "boatswain",
        label: game.i18n.localize("WJMAIS.RoleBoatswain"),
        items: [],
        dataset: { type: "feat", "flags.wjmais.role": "boatswain" },
      },
      gunner: {
        role: "gunner",
        label: game.i18n.localize("WJMAIS.RoleGunner"),
        items: [],
        dataset: { type: "feat", "flags.wjmais.role": "gunner" },
      },
      unassigned: {
        role: "unassigned",
        label: game.i18n.localize("WJMAIS.RoleUnassigned"),
        items: [],
        dataset: { type: "feat", "flags.wjmais.role": "unassigned" },
      },
    };

    let totalWeight = 0;
    const roles =
      this.actor.system.traits.size === "tiny" ? fighterRoles : shipRoles;

    for (const item of context.items) {
      // Item details
      const ctx = (context.itemContext[item.id] ??= {});
      this._prepareEquippableItem(item, ctx);
      item["rollable"] = this._isRollable(item);
      if (item.type === "weapon" && item.system?.properties.has("smw")) {
        item["crewValue"] = this._getCrewValue(item);
        features.weapons.items.push(item);
      } else if (
        item.type === "equipment" &&
        ["foremantle", "module"].includes(item.system?.type.value)
      ) {
        totalWeight += item.system.totalWeight ?? 0;
        features.modules.items.push(item);
      } else if (
        item.type === "equipment" &&
        item.system?.type.value === "upgrade"
      )
        features.upgrades.items.push(item);
      else if (
        item.type === "equipment" &&
        ["material", "modifier"].includes(item.system?.type.value)
      )
        features.hull.items.push(item);
      else if (CONFIG.WJMAIS.cargoTypes.includes(item.type)) {
        totalWeight += item.system.totalWeight ?? 0;
        cargo.cargo.items.push(item);
      } else if (item.type === "feat") {
        if (item?.flags?.wjmais?.role) {
          roles[item.flags.wjmais.role].items.push(item);
        } else if (
          !item.system.activation.type ||
          item.system.activation.type === "none"
        ) {
          features.passive.items.push(item);
        } else if (item.system.activation.type === "reaction")
          features.reactions.items.push(item);
        else features.actions.items.push(item);
      }
    }

    context.roles = Object.values(roles);
    context.features = Object.values(features);
    context.cargo = Object.values(cargo);
    context.encumbrance = this._computeEncumbrance(totalWeight, context);
  }

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    let actor = this.actor;

    if (!this.options.editable) return;

    html.find(".item-facing select").change(async (event) => {
      event.preventDefault();
      const itemID = event.currentTarget.closest(".item").dataset.itemId;
      const item = actor.items.get(itemID);
      let value =
        event.target.options[event.target.options.selectedIndex].value;
      await item.setFlag("wjmais", "facing", value);
    });

    html.find(".item-location select").change(async (event) => {
      event.preventDefault();
      const itemID = event.currentTarget.closest(".item").dataset.itemId;
      const item = actor.items.get(itemID);
      let value =
        event.target.options[event.target.options.selectedIndex].value;
      await item.setFlag("wjmais", "location", value);
    });

    html
      .find(".item-hp input")
      .click((evt) => evt.target.select())
      .change(this._onHPChange.bind(this));

    html[0]
      .querySelector('[data-tab="cargo"] dnd5e-inventory')
      .addEventListener("inventory", this._onInventoryEvent.bind(this));
    html
      .find(".cargo-row input")
      .click((evt) => evt.target.select())
      .change(this._onCargoRowChange.bind(this));

    html.find(".armor-config-button").click(super._onConfigMenu.bind(this));
    html.find(".speed-config-button").click(this._onSpeedConfigMenu.bind(this));

    html
      .find(".trait-selector-landing")
      .click(this._onTraitSelector.bind(this));

    html.find(".npc-toggle input").change(this._onNPCChanged.bind(this));
  }

  /* -------------------------------------------- */

  /**
   * Handle saving a cargo row (i.e. crew or passenger) in-sheet.
   * @param event {Event}
   * @returns {Promise<Actor>|null}
   * @private
   */
  _onCargoRowChange(event) {
    event.preventDefault();
    const target = event.currentTarget;
    const row = target.closest(".item");
    const idx = Number(row.dataset.itemIndex);
    const property = row.classList.contains("crew") ? "crew" : "passengers";

    // Get the cargo entry
    const cargo = foundry.utils.deepClone(this.actor.system.cargo[property]);
    const entry = cargo[idx];
    if (!entry) return null;

    // Update the cargo value
    const key = target.dataset.property ?? "name";
    const type = target.dataset.dtype;
    let value = target.value;
    if (type === "Number") value = Number(value);
    entry[key] = value;

    // Perform the Actor update
    return this.actor.update({ [`system.cargo.${property}`]: cargo });
  }

  /**
   * Handle creating and deleting crew and passenger rows.
   * @param {CustomEvent} event   Triggering inventory event.
   * @returns {Promise}
   */
  async _onInventoryEvent(event) {
    if (event.detail === "create") {
      const type = event.target.dataset.type;
      if (!["crew", "passengers"].includes(type)) return;
      event.preventDefault();
      const cargoCollection = foundry.utils.deepClone(
        this.actor.system.cargo[type]
      );
      cargoCollection.push(this.constructor.newCargo);
      return this.actor.update({ [`system.cargo.${type}`]: cargoCollection });
    } else if (event.detail === "delete") {
      const row = event.target.closest(".item");
      if (!row.classList.contains("cargo-row")) return;
      event.preventDefault();
      const idx = Number(row.dataset.itemIndex);
      const type = row.classList.contains("crew") ? "crew" : "passengers";
      const cargoCollection = foundry.utils
        .deepClone(this.actor.system.cargo[type])
        .filter((_, i) => i !== idx);
      return this.actor.update({ [`system.cargo.${type}`]: cargoCollection });
    }
  }
  /* -------------------------------------------- */

  /**
   * Handle creating a new crew or passenger row.
   * @param event {Event}
   * @returns {Promise<Actor|Item>}
   * @private
   */
  _onItemCreate(event) {
    event.preventDefault();
    // Handle creating a new crew or passenger row.
    const target = event.currentTarget;
    const type = target.dataset.type;
    if (type === "crew" || type === "passengers") {
      const cargo = foundry.utils.deepClone(this.actor.system.cargo[type]);
      cargo.push(this.constructor.newCargo);
      return this.actor.update({ [`system.cargo.${type}`]: cargo });
    }
    return super._onItemCreate(event);
  }

  /* -------------------------------------------- */

  /**
   * Handle deleting a crew/passenger row, roles, and ship weapons.
   * @param event {Event}
   * @returns {Promise<Actor|Item>}
   * @private
   */
  async _onItemDelete(event) {
    event.preventDefault();
    const row = event.currentTarget.closest(".item");
    const item = this.actor.items.get(row.dataset.itemId);
    if (row.classList.contains("cargo-row")) {
      const idx = Number(row.dataset.itemIndex);
      const type = row.classList.contains("crew") ? "crew" : "passengers";
      const cargo = foundry.utils
        .deepClone(this.actor.system.cargo[type])
        .filter((_, i) => i !== idx);
      return this.actor.update({ [`system.cargo.${type}`]: cargo });
    } else if (item.flags?.wjmais?.role) {
      this._doRemoveRole(item);
    } else if (isGunnerWeapon(item)) {
      const creature = game.actors.get(item.flags?.wjmais?.crewed);
      if (creature) {
        const creatureShipWeapon = creature.items.find(
          (i) => i.flags.wjmais?.swid
        );
        if (creatureShipWeapon) await creatureShipWeapon.delete();
      }
    }

    return super._onItemDelete(event);
  }

  /* -------------------------------------------- */

  /**
   * Special handling for editing HP to clamp it within appropriate range.
   * @param event {Event}
   * @returns {Promise<Item>}
   * @private
   */
  _onHPChange(event) {
    event.preventDefault();
    const itemID = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemID);
    const hp = Math.clamped(
      0,
      parseInt(event.currentTarget.value),
      item.system.hp.max
    );
    event.currentTarget.value = hp;
    return item.update({ "system.hp.value": hp });
  }

  /**
   * When entering NPC mode, remove all existing bridge crew roles
   * @param event {Event}
   * @private
   */
  async _onNPCChanged(event) {
    if (event.target.checked) {
      this.actor.items
        .filter((i) => i.flags?.wjmais?.role)
        .forEach(async (item) => {
          await this._doRemoveRole(item);
          await item.delete();
        });
    }
  }

  /* -------------------------------------------- */

  /**
   * Handle spawning the TraitSelector application which allows a checkbox of multiple trait options
   * @param {Event} event   The click event which originated the selection
   * @private
   */
  _onSpeedConfigMenu(event) {
    event.preventDefault();
    const button = event.currentTarget;
    switch (button.dataset.action) {
      case "speed":
        new WildjammerSpeedConfig(this.object).render(true);
        break;
    }
  }

  /**
   * Handle spawning the TraitSelector application which allows a checkbox of multiple trait options
   * @param {Event} event   The click event which originated the selection
   * @private
   */
  _onTraitSelector(event) {
    event.preventDefault();
    const a = event.currentTarget;
    const label = a.parentElement.querySelector("label");
    const choices = CONFIG.WJMAIS[a.dataset.options];
    const options = {
      name: a.dataset.target,
      title: label.innerText,
      choices,
      allowCustom: false,
    };
    new dnd5e.applications.actor.TraitSelector(
      this.actor,
      "lt",
      options
    ).render(true);
  }
}
