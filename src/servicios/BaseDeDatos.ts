import Constants from "expo-constants";
import { Platform } from "react-native";

const getApiUrl = () => {
  // 1. Si estamos en Web o no hay hostUri (prod?), usar localhost
  if (Platform.OS === "web") return "http://localhost:3000/api";

  // 2. Intentar obtener la IP del debugger (Metro Bundler)
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(":")[0];

  if (localhost) {
    // Devuelve la IP de tu PC (ej: 192.168.1.15)
    return `http://${localhost}:3000/api`;
  }

  // 3. Fallback para emulador Android si falla lo anterior
  if (Platform.OS === "android") return "http://10.0.2.2:3000/api";

  // 4. Fallback final (iOS simulator o error)
  return "http://localhost:3000/api";
};

const API_URL = getApiUrl();
console.log(`📡 Conectando a API Backend en: ${API_URL}`);

// --- INITIALIZATION (No longer creates tables locally) ---
export const initDB = async () => {
  // Check API health if needed, simplifies to just returning true
  console.log("Inicialización de Base de Datos (Modo API): LISTO");
  return true;
};

export const seedDB = async () => {
  console.log("Seeding handles by API/Backend Logic manually via SQL script.");
};

// --- DATA ACCESS METHODS ---

export const getCategorias = async () => {
  try {
    const response = await fetch(`${API_URL}/categorias`);
    if (!response.ok) throw new Error("Error fetching categorias");
    return await response.json();
  } catch (error) {
    console.error("API Error (Categorias):", error);
    return [];
  }
};

export const getRestaurantes = async () => {
  try {
    const response = await fetch(`${API_URL}/restaurantes`);
    if (!response.ok) throw new Error("Error fetching restaurantes");
    return await response.json();
  } catch (error) {
    console.error("API Error (Restaurantes):", error);
    return [];
  }
};

export const getProductosPorRestaurante = async (restauranteId: number) => {
  try {
    const response = await fetch(
      `${API_URL}/productos?restaurante_id=${restauranteId}`,
    );
    if (!response.ok) throw new Error("Error fetching productos");
    return await response.json();
  } catch (error) {
    console.error("API Error (Productos):", error);
    return [];
  }
};

export const getProductosTodos = async () => {
  try {
    const response = await fetch(`${API_URL}/productos`);
    if (!response.ok) throw new Error("Error fetching productos");
    return await response.json();
  } catch (error) {
    console.error("API Error (Productos Todos):", error);
    return [];
  }
};

export const getDirecciones = async () => {
  try {
    // Hardcoded user 1 for demo
    const response = await fetch(`${API_URL}/direcciones?usuario_id=1`);
    if (!response.ok) throw new Error("Error fetching direcciones");
    return await response.json();
  } catch (error) {
    console.error("API Error (Direcciones):", error);
    return [];
  }
};

export const crearDireccion = async (
  titulo: string,
  direccion: string,
  referencia: string,
) => {
  try {
    const response = await fetch(`${API_URL}/direcciones`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usuario_id: 1, // Mock user
        titulo,
        direccion,
        referencia,
      }),
    });
    if (!response.ok) throw new Error("Error creando direccion");
    return await response.json();
  } catch (error) {
    console.error("API Error (Crear Direccion):", error);
    throw error;
  }
};
