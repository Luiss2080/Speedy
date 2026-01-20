import { StyleSheet } from "react-native";

export const SeguimientoEstilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: "#fff" },
  mapaPlaceholder: {
    flex: 1,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  textoMapa: { color: "#9ca3af", fontSize: 16 },
  panelEstado: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  barraProgreso: {
    height: 4,
    backgroundColor: "#eee",
    borderRadius: 2,
    marginBottom: 20,
    overflow: "hidden",
  },
  progresoRelleno: { height: "100%", backgroundColor: "#ea580c" },
  estadoTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 5,
  },
  estadoSubtitulo: { fontSize: 14, color: "#6b7280", marginBottom: 20 },
  repartidorInfo: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ddd",
    marginRight: 15,
  },
  repartidorNombre: { fontSize: 16, fontWeight: "bold", color: "#374151" },
  repartidorPlaca: { fontSize: 14, color: "#6b7280" },
});
