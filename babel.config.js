/**
 * El bundle de web se cargaba como script clasico y zustand/middleware usa
 * import.meta.env (lo trae el devtools que viene en el mismo modulo que
 * persist), asi que el navegador cortaba con "Cannot use import.meta outside
 * a module" y la pantalla quedaba en blanco. Esta opcion del preset lo
 * transforma en algo que el script clasico entiende.
 *
 * Sin este archivo Expo usa babel-preset-expo igual; lo unico que agregamos
 * es la opcion.
 */
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { unstable_transformImportMeta: true }]],
  };
};
