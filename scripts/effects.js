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

async function updateBulwarkPoints(change, deleted)
{
  const actor = change.document.parent;
  const disabled = change.document.data.disabled;
  if (deleted && disabled) return;
  const add = disabled || (deleted && !disabled) ? false : true;

  await actor.update({
    "data.attributes.hp.temp": _updateValue(actor.data.data.attributes.hp.temp, change.value, add),
    "data.attributes.hp.tempmax": _updateValue(actor.data.data.attributes.hp.tempmax, change.value, add)
  });
}

async function updateHullPoints(change, deleted)
{
  const actor = change.document.parent;
  const disabled = change.document.data.disabled;
  if (deleted && disabled) return;
  const add = disabled || (deleted && !disabled) ? false : true;

  await actor.update({
    "data.attributes.hp.value": _updateValue(actor.data.data.attributes.hp.value, change.value, add),
    "data.attributes.hp.max": _updateValue(actor.data.data.attributes.hp.max, change.value, add)
  });
}

export async function updateActorEffects(effect, deleted=false) 
{
    if (effect.parent instanceof Actor) {
      let change = effect.data.changes.find(e => e.key === "flags.wjmais.bp");
      if (change) await updateBulwarkPoints(change, deleted);

      change = effect.data.changes.find(e => e.key === "flags.wjmais.hp");
      if (change) await updateHullPoints(change, deleted);
    }
}
