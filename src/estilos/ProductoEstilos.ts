import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const ProductoEstilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: "#fff" },
  imagen: { width: width, height: 300, resizeMode: "cover" },
  infoContenedor: { flex: 1, padding: 20 },
  nombre: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 10,
  },
  descripcion: { fontSize: 16, color: "#6b7280", lineHeight: 24 },
  precio: { fontSize: 24, fontWeight: "bold", color: "#1f2937", marginTop: 20 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  controlCantidad: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
  },
  botonCantidad: { padding: 10 },
  textoCantidad: { fontSize: 16, fontWeight: "bold", paddingHorizontal: 15 },
  botonAgregar: {
    backgroundColor: "#ea580c",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  textoBoton: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
