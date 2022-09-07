/**
 * A Dialog to prompt the user to select from a list of items.
 * @type {Dialog}
 */
export default class SelectItemPrompt extends Dialog {
  constructor(items, dialogData={}, options={}) {
    super(dialogData, options);
    this.options.classes = ["dnd5e", "dialog", "select-items-prompt", "sheet"];

    /**
     * Store a reference to the Item entities being used
     * @type {Array<Item5e>}
     */
    this.items = items;
  }

  activateListeners(html) {
    super.activateListeners(html);

    // render the item's sheet if its image is clicked
    html.on('click', '.item-image', (event) => {
      const item = this.items.find((feature) => feature.id === event.currentTarget.dataset?.itemId);

      item?.sheet.render(true);
    })
  }

  /**
   * A constructor function which displays the AddItemPrompt app for a given Actor and Item set.
   * Returns a Promise which resolves to the dialog FormData once the workflow has been completed.
   * @param {Array<Item5e>} items
   * @param {Object} options
   * @param {string} options.hint - Localized hint to display at the top of the prompt
   * @return {Promise<string[]>} - list of item ids which the user has selected
   */
  static async create(items, {
    hint
  }) {
    const templateData = {
      config: CONFIG.WJMAIS,
      items: items
    }
    // Check first item
    items[0].default = true;
    // Render the selection template
    const html = await renderTemplate("modules/wjmais/templates/actors/select-item-prompt.html", {templateData, hint});

    return new Promise((resolve) => {
      const dlg = new this(items, {
        title: game.i18n.localize('WJMAIS.SelectShipWeapon'),
        content: html,
        buttons: {
          apply: {
            icon: `<i class="fas fa-user-plus"></i>`,
            label: game.i18n.localize('WJMAIS.Apply'),
            callback: html => {
              const fd = new FormDataExtended(html[0].querySelector("form")).toObject();
              const selectedId = fd["shipWeapon"];
              resolve(selectedId);
            }
          },
          cancel: {
            icon: '<i class="fas fa-forward"></i>',
            label: game.i18n.localize('WJMAIS.Skip'),
            callback: () => resolve([])
          }
        },
        default: "apply",
        close: () => resolve([])
      });
      dlg.render(true);
    });
  }
}
