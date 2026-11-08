const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

/**
 * react-native-maps importa modulos nativos y rompe el bundle de web.
 * Solo para la plataforma web la cambiamos por src/demo/MapaWeb.tsx, que
 * exporta lo mismo (MapView, Marker, Polyline...) sin nada nativo. Android e
 * iOS siguen resolviendo la libreria de verdad.
 */
const config = getDefaultConfig(__dirname);

const resolverOriginal = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === "web" && moduleName === "react-native-maps") {
    return {
      type: "sourceFile",
      filePath: path.resolve(__dirname, "src/demo/MapaWeb.tsx"),
    };
  }
  return (resolverOriginal || context.resolveRequest)(context, moduleName, platform);
};

module.exports = config;
