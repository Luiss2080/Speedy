import { Platform } from "react-native";

const getApiUrl = () => {
  // --- CONFIGURACIÓN DINÁMICA ---
  // El script start_app.js establece la IP correcta en el entorno de Expo.
  // Esto permite que 'hostUri' siempre tenga la IP de tu red actual.

  // 1. Web
  if (Platform.OS === "web") return "http://localhost:3000/api";

  // 3. Fallback (Solo si todo falla)
  return "http://192.168.1.15:3000/api";
};

export const API_URL = getApiUrl();
console.log(`📡 Conectando a API Backend en: ${API_URL}`);

// Helper to prevent infinite hangs
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout = 5000,
) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal as any, // Type cast for RN compatibility
    });
    clearTimeout(id);
    return response;
  } catch (err: any) {
    clearTimeout(id);
    if (err.name === "AbortError") {
      throw new Error("Timeout: El servidor tardó mucho en responder");
    }
    throw err;
  }
};

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
    console.log(`Intentando login en: ${API_URL}/login`);
    const response = await fetchWithTimeout(
      `${API_URL}/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password: pin }),
      },
      5000,
    ); // 5 sec timeout

    return await response.json();
  } catch (error) {
    console.error("API Error (Login):", error);
    return {
      success: false,
      message: "No se pudo conectar al servidor. Verifica tu IP.",
    };
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

export const getPedidosUsuario = async (usuarioId: number) => {
  try {
    const response = await fetch(`${API_URL}/pedidos?usuario_id=${usuarioId}`);
    if (!response.ok) throw new Error("Error fetching pedidos");
    return await response.json();
  } catch (error) {
    console.error("API Error (Pedidos Usuario):", error);
    return [];
  }
};

export const getGananciasRepartidor = async (repartidorId: number) => {
  try {
    const response = await fetch(
      `${API_URL}/pedidos?repartidor_id=${repartidorId}&estado=entregado`,
    );
    if (!response.ok) throw new Error("Error fetching ganancias");
    const pedidos = await response.json();

    // Calculate totals locally
    const days = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
    const mockData = days.map((d) => ({ day: d, amount: Math.random() * 50 }));

    return mockData;
  } catch (error) {
    console.error("API Error (Ganancias):", error);
    return [];
  }
};
