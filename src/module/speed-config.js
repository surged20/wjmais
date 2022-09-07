/**
 * A simple form to set wildjammer speeds
 * @implements {DocumentSheet}
 */
export default class WildjammerSpeedConfig extends DocumentSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["dnd5e"],
      template: "modules/wjmais/templates/actors/speed-config.html",
      width: 300,
      height: "auto"
    });
  }

  /* -------------------------------------------- */

  /** @override */
  get title() {
    return `${game.i18n.localize("WJMAIS.SpeedConfig")}: ${this.document.name}`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData(options) {
    const data = {
      speed: this.document.flags.wjmais.speed,
      config: CONFIG.WJMAIS
    }
    return data;
  }
}
