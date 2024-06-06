/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {

  const partials = [
    // Actor Sheet Partials
    "modules/wjmais/templates/actors/parts/actor-features.hbs",
    "modules/wjmais/templates/actors/parts/bridge-crew-roles.hbs",
  ];

  const paths = {};
  for ( const path of partials ) {
    paths[path.replace(".hbs", ".html")] = path;    
    paths[`wjmais.${path.split("/").pop().replace(".hbs", "")}`] = path;
  }

  return loadTemplates(paths);
};
