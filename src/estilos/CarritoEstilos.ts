import { StyleSheet } from "react-native";

export const CarritoEstilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: "#f9fafb" },
  encabezado: { padding: 20, backgroundColor: "#fff", alignItems: "center" },
  titulo: { fontSize: 20, fontWeight: "bold", color: "#1f2937" },
  lista: { padding: 20 },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  itemInfo: { flexDirection: "row", alignItems: "center" },
  cantidadBadge: {
    backgroundColor: "#eee",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 10,
  },
  itemNombre: { fontSize: 16, color: "#374151" },
  itemPrecio: { fontSize: 16, fontWeight: "bold", color: "#374151" },
  resumen: { backgroundColor: "#fff", padding: 20, marginTop: 20 },
  filaResumen: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  textoResumen: { fontSize: 16, color: "#6b7280" },
  textoTotal: { fontSize: 18, fontWeight: "bold", color: "#1f2937" },
  botonPagar: {
    backgroundColor: "#ea580c",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  textoBoton: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
