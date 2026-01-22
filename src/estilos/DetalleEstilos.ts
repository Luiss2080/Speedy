import { StyleSheet } from "react-native";

export const DetalleEstilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: "#fff", padding: 20 },
  encabezado: {
    paddingTop: 60,
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 20,
  },
  titulo: { fontSize: 26, fontWeight: "bold", color: "#111", marginBottom: 5 },
  subtitulo: { fontSize: 14, color: "#666", fontFamily: "monospace" },
  contenido: { backgroundColor: "#f9fafb", padding: 20, borderRadius: 12 },
  texto: { fontSize: 16, lineHeight: 24, color: "#374151", marginBottom: 20 },
  autor: { fontSize: 14, fontStyle: "italic", color: "#4b5563" },
});
