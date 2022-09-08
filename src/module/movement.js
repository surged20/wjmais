async function toggleConeOfMovement() {
  const token = TokenLayer.instance.controlled[0];
  if (!token) return;
  if (document.body !== document.activeElement) return;

  if (token.document.flags?.wjmais?.cone) {
    const template = canvas.scene.templates.get(
      token.document.flags.wjmais.cone
    );
    if (template) {
      await template.delete();
    }
    await token.document.unsetFlag("wjmais", "cone");
    return;
  }

  let rotation = token.document.rotation;
  // Normalize rotation to positive value
  // If the user rotates the token in place to the SE inter-cardinal direction, rotation is -45
  rotation = rotation < 0 ? 360 + rotation : rotation;
  const supportedAngles = [0, 45, 90, 135, 180, 225, 270, 325, 360];
  if (!supportedAngles.includes(rotation)) {
    return;
  }

  const supportedGridSizes = [5, 500];
  const gridSize = canvas.scene.grid.distance;
  if (!supportedGridSizes.includes(gridSize)) {
    ui.notifications.warn(
      "Cone of movement template requires a 5 or 500 foot grid."
    );
    return;
  }

  if (
    !token.actor.flags.wjmais.speed?.tactical ||
    !token.actor.flags.wjmais.speed?.mnv
  ) {
    ui.notifications.warn(
      "Cone of movement requires that the ship speed is configured."
    );
    return;
  }

  const tacticalSpeed = token.actor.flags.wjmais.speed.tactical;
  const distance = gridSize === 500 ? tacticalSpeed : tacticalSpeed / 100;

  const width = token.document.width;
  const height = token.document.height;
  const gridPixels = canvas.scene.grid.size;
  const offsets = {
    0: { x: (width * gridPixels) / 2, y: 0 },
    45: { x: width * gridPixels, y: 0 },
    90: { x: width * gridPixels, y: (height * gridPixels) / 2 },
    135: { x: width * gridPixels, y: height * gridPixels },
    180: { x: (width * gridPixels) / 2, y: height * gridPixels },
    225: { x: 0, y: height * gridPixels },
    270: { x: 0, y: (height * gridPixels) / 2 },
    315: { x: 0, y: 0 },
    // If the user rotates the token in place, rotation for S cardinal direction is 360 rather than 0
    360: { x: (width * gridPixels) / 2, y: 0 },
  };
  const data = {
    t: "cone",
    user: game.user.id,
    distance: distance + width * gridSize,
    angle: token.actor.flags.wjmais.speed.mnv,
    direction: rotation - 270,
    x: token.document.x + offsets[rotation].x,
    y: token.document.y + offsets[rotation].y,
    fillColor: game.user.color,
  };

  const doc = new MeasuredTemplateDocument(data, { parent: canvas.scene });
  const template = new game.dnd5e.canvas.AbilityTemplate(doc);
  const placedTemplate = await canvas.scene.createEmbeddedDocuments(
    "MeasuredTemplate",
    [template.document.toObject()]
  );

  await token.document.setFlag("wjmais", "cone", placedTemplate[0].id);
}

export function registerMovementKey() {
  game.keybindings.register("wjmais", "coneOfMovement", {
    name: "Toggle Wildjammer cone of movement template",
    hint: "Toggle the Wildjammer cone of movement template for the selected token.",
    editable: [
      {
        key: "KeyM",
      },
    ],
    onDown: () => {
      toggleConeOfMovement();
      return true;
    },
  });
}
