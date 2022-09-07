function _updateValue(old, change, add)
{
  const value = parseInt(change);

  if (old === null) 
    return value;

  if (add)
    return old + value;
  else
    return old - value;
}

// The actor effect helpers assume a numeric add mode effect

async function updateBulwarkPoints(effect, change, deleted)
{
  const actor = effect.parent;
  const disabled = effect.disabled;
  if (deleted && disabled) return;
  const add = disabled || (deleted && !disabled) ? false : true;

  await actor.update({
    "system.attributes.hp.temp": _updateValue(actor.system.attributes.hp.temp, change.value, add),
    "system.attributes.hp.tempmax": _updateValue(actor.system.attributes.hp.tempmax, change.value, add)
  });
}

async function updateHullPoints(effect, change, deleted)
{
  const actor = effect.parent;
  const disabled = effect.disabled;
  if (deleted && disabled) return;
  const add = disabled || (deleted && !disabled) ? false : true;

  await actor.update({
    "system.attributes.hp.value": _updateValue(actor.system.attributes.hp.value, change.value, add),
    "system.attributes.hp.max": _updateValue(actor.system.attributes.hp.max, change.value, add)
  });
}

export async function updateActorEffects(effect, deleted=false) 
{
    if (effect.parent instanceof Actor) {
      let change = effect.changes.find(e => e.key === "flags.wjmais.bp");
      if (change) await updateBulwarkPoints(effect, change, deleted);

      change = effect.changes.find(e => e.key === "flags.wjmais.hp");
      if (change) await updateHullPoints(effect, change, deleted);
    }
}
