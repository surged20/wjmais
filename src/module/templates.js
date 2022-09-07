/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([

    // Actor Sheet Partials
    "modules/wjmais/templates/actors/parts/actor-features.html",
    "modules/wjmais/templates/actors/parts/bridge-crew-roles.html",
  ]);
};
