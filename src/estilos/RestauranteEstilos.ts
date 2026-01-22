import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const RestauranteEstilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: "#fff" },
  imagenPortada: { width: width, height: 250, resizeMode: "cover" }, // Increased height
  infoContenedor: {
    padding: 20,
    marginTop: -20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  nombre: { fontSize: 24, fontWeight: "bold", color: "#1f2937" },
  metaInfo: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  calificacion: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1f2937",
    marginRight: 5,
  },
  tiempo: { fontSize: 14, color: "#6b7280", marginLeft: 10 },
  tituloSeccion: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 15,
    marginLeft: 20,
  },
  contenedorCategorias: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoriaItem: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    marginRight: 10,
  },
  categoriaItemActivo: {
    backgroundColor: "#C21833",
  },
  textoCategoria: {
    fontSize: 14,
    color: "#4b5563",
    fontWeight: "600",
  },
  textoCategoriaActivo: {
    color: "#fff",
  },
  listaProductos: { paddingHorizontal: 20 },
  productoTarjeta: {
    flexDirection: "row",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingBottom: 20,
  },
  productoInfo: { flex: 1, paddingRight: 10 },
  productoNombre: { fontSize: 16, fontWeight: "bold", color: "#374151" },
  productoDesc: { fontSize: 14, color: "#6b7280", marginVertical: 4 },
  productoPrecio: { fontSize: 14, fontWeight: "bold", color: "#374151" },
  productoImagen: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
});
