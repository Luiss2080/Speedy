import { StyleSheet } from "react-native";

export const PedidosEstilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: "#f9fafb" },
  encabezado: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  titulo: { fontSize: 28, fontWeight: "bold", color: "#111", marginBottom: 5 },
  lista: { padding: 20 },
  tarjeta: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderLeftWidth: 4,
  },
  filaEncabezado: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  nombreRestaurante: { fontSize: 16, fontWeight: "bold", color: "#1f2937" },
  fecha: { fontSize: 12, color: "#9ca3af" },
  estado: { fontSize: 14, fontWeight: "600" },
  detalles: { fontSize: 14, color: "#6b7280", marginTop: 5 },
  total: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 10,
    alignSelf: "flex-end",
  },
});
