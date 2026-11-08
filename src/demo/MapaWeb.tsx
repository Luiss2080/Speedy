import React from "react";
import { StyleSheet, Text, View } from "react-native";

/**
 * Reemplazo de react-native-maps para el navegador.
 *
 * La libreria importa modulos nativos y rompe el bundle de web. metro.config.js
 * la cambia por este archivo solo cuando la plataforma es web, asi que Android
 * e iOS siguen usando el mapa de verdad. Tres vistas la importan directo
 * (SeguimientoVista, PedidoAceptacionVista y EntregaActivaVista), por eso el
 * cambio va en el resolver y no en un .web.tsx por vista.
 */
type Hijos = { children?: React.ReactNode };

export default function MapView({ children }: Hijos & Record<string, any>) {
  return (
    <View style={estilos.lienzo}>
      <View style={estilos.tarjeta}>
        <Text style={estilos.titulo}>Mapa</Text>
        <Text style={estilos.texto}>
          El seguimiento en mapa corre en la app movil. En esta demo web se
          muestran los datos del pedido sin el mapa.
        </Text>
      </View>
      {children}
    </View>
  );
}

export const Marker = (_: Record<string, any>) => null;
export const Polyline = (_: Record<string, any>) => null;
export const Callout = (_: Record<string, any>) => null;
export const Circle = (_: Record<string, any>) => null;
export const Polygon = (_: Record<string, any>) => null;
export const PROVIDER_GOOGLE = "google";
export const PROVIDER_DEFAULT = undefined;

const estilos = StyleSheet.create({
  lienzo: {
    flex: 1,
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#13223a",
  },
  tarjeta: {
    maxWidth: 340,
    paddingHorizontal: 22,
    paddingVertical: 18,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  titulo: {
    color: "#ffffff",
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 6,
  },
  texto: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 14,
    lineHeight: 20,
  },
});
