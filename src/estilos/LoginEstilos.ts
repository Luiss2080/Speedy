import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const LoginEstilos = StyleSheet.create({
  fondo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20, // Reduced from 40
  },
  logoImagen: {
    width: 90, // Reduced from 120
    height: 90,
    resizeMode: "contain",
    marginBottom: 10, // Reduced from 20
    borderRadius: 15,
  },
  titulo: {
    fontSize: 24, // Reduced from 28
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 13, // Reduced from 14
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    paddingHorizontal: 40,
  },
  tarjeta: {
    width: width * 0.9,
    backgroundColor: "#fff",
    borderRadius: 24, // Slightly reduced radius
    padding: 25, // Reduced from 35
    alignItems: "center",
    shadowColor: "#C21833",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  tarjetaTitulo: {
    fontSize: 20, // Reduced from 24
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 5,
  },
  tarjetaSubtitulo: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 20, // Reduced from 35
    lineHeight: 20,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f3f4f6",
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 50, // Reduced from 60
    marginBottom: 15, // Reduced from 25
    backgroundColor: "#f9fafb",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  inputIcono: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15, // Reduced from 16
    color: "#374151",
  },
  labelPin: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 10, // Reduced from 15
    fontWeight: "500",
  },
  pinContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20, // Reduced from 30
    width: "100%",
  },
  pinInput: {
    width: 45, // Reduced from 50
    height: 45,
    borderWidth: 1.5,
    borderColor: "#C21833",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 20, // Reduced from 24
    fontWeight: "bold",
    color: "#C21833",
    backgroundColor: "#fff0f0",
  },
  botonIngresar: {
    width: "100%",
    backgroundColor: "#C21833",
    paddingVertical: 15, // Reduced from 18
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 15, // Reduced from 20
    shadowColor: "#C21833",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  textoBoton: {
    color: "#fff",
    fontSize: 16, // Reduced from 18
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  footerNota: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    padding: 8, // Reduced from 10
    borderRadius: 8,
    width: "100%",
  },
  textoNota: {
    fontSize: 11, // Reduced from 12
    color: "#6b7280",
    marginLeft: 10,
    flex: 1,
  },
});
