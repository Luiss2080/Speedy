import Constants from "expo-constants";
import { Platform } from "react-native";

const getApiUrl = () => {
  // --- CONFIGURACIÓN MANUAL (Si la autodeteción falla) ---
  // Si tu celular no conecta, cambia "null" por tu IP local (ej: "192.168.1.15")
  const MANUAL_IP = "172.25.1.150";

  if (MANUAL_IP) return `http://${MANUAL_IP}:3000/api`;

  // 1. Web
  if (Platform.OS === "web") return "http://localhost:3000/api";

  // 2. Autodetección via Expo (Metro Bundler)
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(":")[0];

  if (localhost) {
    // IMPORTANTE: Si esto devuelve una IP extraña (como 172.x.x.x) y no conecta,
    // es porque Expo está tomando el adaptador incorrecto. Usa MANUAL_IP arriba.
    return `http://${localhost}:3000/api`;
  }

  // 3. Fallback Android Emulator
  if (Platform.OS === "android") return "http://10.0.2.2:3000/api";

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

export const getProductoDetalle = async (id: string | number) => {
  try {
    const response = await fetch(`${API_URL}/productos/${id}`);
    if (!response.ok) throw new Error("Error fetching producto detalle");
    return await response.json();
  } catch (error) {
    console.error("API Error (Producto Detalle):", error);
    return null;
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

export const loginUsuario = async (usuario: string, pin: string) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, password: pin }),
    });
    return await response.json();
  } catch (error) {
    console.error("API Error (Login):", error);
    return { success: false, message: "Error de conexión" };
  }
};

export const crearPedido = async (pedido: any) => {
  try {
    const response = await fetch(`${API_URL}/pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedido),
    });
    return await response.json();
  } catch (error) {
    console.error("API Error (Pedido):", error);
    return { success: false, message: "Error de conexión" };
  }
};
