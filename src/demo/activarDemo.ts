/**
 * Modo demostracion de Speedy.
 *
 * Todo lo que la app pide pasa por `fetch` (src/servicios/BaseDeDatos.ts) y en
 * web apunta a http://localhost:3000/api, que en una demo publicada no existe.
 * Este modulo siembra la sesion e intercepta esas llamadas, asi que la app
 * corre entera en el navegador: sin el servidor de `backend/` y sin MySQL.
 *
 * Se enciende solo con EXPO_PUBLIC_DEMO=true. Compilada sin esa variable, la
 * rama se comporta igual que master.
 *
 * AVISO: deja entrar a cualquiera. Nunca compilar esto apuntando a una base
 * real.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

export const DEMO = process.env.EXPO_PUBLIC_DEMO === "true";

const USUARIO = {
  id: 1,
  nombre: "Administrador Demo",
  email: "admin@hagamostech.com",
  rol: "cliente",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
  telefono: "+591 70011223",
};

const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGVtbyI6dHJ1ZX0.demo";

const foto = (id: string, ancho = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${ancho}&q=80`;

const fecha = (horas: number) =>
  new Date(Date.now() - horas * 3600000).toISOString().slice(0, 19).replace("T", " ");

const categorias = [
  ["Hamburguesas", "hamburguesas", "hamburger", "#f97316", "photo-1568901346375-23c9450c58cd"],
  ["Pizzas", "pizzas", "pizza-slice", "#dc2626", "photo-1513104890138-7c749659a591"],
  ["Sushi", "sushi", "fish", "#0891b2", "photo-1579871494447-9811cf80d66c"],
  ["Almuerzos", "almuerzos", "utensils", "#16a34a", "photo-1546069901-ba9599a7e63c"],
  ["Postres", "postres", "ice-cream", "#db2777", "photo-1551024506-0bccd828d307"],
  ["Desayunos", "desayunos", "coffee", "#a16207", "photo-1533089860892-a7c6f0a88666"],
].map((c, i) => ({
  id: i + 1,
  nombre: c[0],
  slug: c[1],
  icono: c[2],
  color: c[3],
  imagen_cover: foto(c[4], 600),
  orden_visual: i + 1,
}));

const restaurantes = [
  ["Burger Cruz", "Hamburguesas a la parrilla con pan artesanal.", 1, 4.7, 25, 35, 8, 35, "Av. Banzer 3er anillo", "photo-1571091718767-18b5b1457add", "photo-1550547660-d9450f859349"],
  ["Nonna Rosa", "Pizza a la piedra, masa de 48 horas.", 2, 4.8, 30, 45, 10, 50, "Equipetrol, calle Las Palmas", "photo-1565299624946-b28f40a0ae38", "photo-1513104890138-7c749659a591"],
  ["Sakura Sushi", "Rolls frescos y combinados para compartir.", 3, 4.6, 35, 50, 12, 70, "Av. San Martin, Manzana 40", "photo-1579871494447-9811cf80d66c", "photo-1617196034796-73dfa7b1fd56"],
  ["Dona Marta", "Almuerzos caseros cruceños, al paso.", 4, 4.5, 20, 30, 7, 25, "Mercado Los Pozos", "photo-1546069901-ba9599a7e63c", "photo-1555939594-58d7cb561ad1"],
  ["Dulce Urbari", "Tortas, helados y postres del dia.", 5, 4.9, 20, 30, 7, 20, "Barrio Urbari, Los Tajibos", "photo-1551024506-0bccd828d307", "photo-1488477181946-6428a0291777"],
  ["Cafe Tajibo", "Desayunos, cafe de origen y panaderia.", 6, 4.4, 15, 25, 6, 18, "Av. Alemana 4to anillo", "photo-1533089860892-a7c6f0a88666", "photo-1501339847302-ac426a4a7cbb"],
].map((r, i) => ({
  id: i + 1,
  nombre: r[0] as string,
  descripcion: r[1] as string,
  categoria_id: r[2] as number,
  calificacion: r[3] as number,
  tiempo_estimado_min: r[4] as number,
  tiempo_estimado_max: r[5] as number,
  costo_envio_base: r[6] as number,
  pedido_minimo: r[7] as number,
  direccion_texto: r[8] as string,
  imagen_logo: foto(r[9] as string, 300),
  imagen_portada: foto(r[10] as string, 1200),
  etiquetas_json: JSON.stringify(["Envio rapido", "Favorito de la zona"]),
  latitud: -17.78,
  longitud: -63.18,
  telefono_contacto: "+591 3 3" + (300000 + i * 1111),
  estado: "abierto",
}));

const crudoProductos: [number, string, string, number, string, string][] = [
  [1, "Clasica de la casa", "Carne 180g, cheddar, pepinillos y salsa secreta.", 38, "photo-1568901346375-23c9450c58cd", "Hamburguesas"],
  [1, "Doble humo", "Doble carne, tocino crocante y cebolla caramelizada.", 52, "photo-1550547660-d9450f859349", "Hamburguesas"],
  [1, "Veggie del huerto", "Medallon de garbanzos, palta y rucula.", 36, "photo-1520072959219-c595dc870360", "Hamburguesas"],
  [2, "Margarita", "Tomate San Marzano, mozzarella y albahaca.", 55, "photo-1574071318508-1cdbab80d002", "Pizzas"],
  [2, "Cuatro quesos", "Mozzarella, gorgonzola, parmesano y provolone.", 68, "photo-1513104890138-7c749659a591", "Pizzas"],
  [2, "Napolitana", "Jamon, tomate en rodajas y oregano fresco.", 62, "photo-1565299624946-b28f40a0ae38", "Pizzas"],
  [3, "Roll California", "Palta, kanikama y pepino, 10 piezas.", 48, "photo-1579871494447-9811cf80d66c", "Sushi"],
  [3, "Combinado Sakura", "20 piezas variadas para dos personas.", 110, "photo-1617196034796-73dfa7b1fd56", "Sushi"],
  [3, "Gyozas de cerdo", "Seis unidades con salsa ponzu.", 32, "photo-1496116218417-1a781b1c416c", "Sushi"],
  [4, "Silpancho cruceno", "Arroz, papa, carne apanada y huevo frito.", 30, "photo-1546069901-ba9599a7e63c", "Almuerzos"],
  [4, "Majadito de charque", "Arroz cocido con charque y platano frito.", 28, "photo-1555939594-58d7cb561ad1", "Almuerzos"],
  [4, "Sopa de mani", "Receta de la casa, con fideo y papa.", 18, "photo-1547592166-23ac45744acd", "Almuerzos"],
  [5, "Torta de chocolate", "Porcion generosa con ganache.", 22, "photo-1578985545062-69928b1d9587", "Postres"],
  [5, "Cheesecake de maracuya", "Base de galleta y coulis fresco.", 25, "photo-1533134242443-d4fd215305ad", "Postres"],
  [5, "Helado artesanal", "Dos bochas a eleccion.", 16, "photo-1551024506-0bccd828d307", "Postres"],
  [6, "Desayuno completo", "Cafe, jugo, huevos y pan casero.", 26, "photo-1533089860892-a7c6f0a88666", "Desayunos"],
  [6, "Capuchino doble", "Cafe de origen, leche texturizada.", 14, "photo-1572442388796-11668a67e53d", "Desayunos"],
  [6, "Medialunas (3)", "Recien horneadas, con manteca.", 12, "photo-1555507036-ab1f4038808a", "Desayunos"],
];

const productos = crudoProductos.map((p, i) => ({
  id: i + 1,
  restaurante_id: p[0],
  nombre: p[1],
  descripcion: p[2],
  precio: p[3],
  precio_descuento: i % 5 === 0 ? Math.round(p[3] * 0.85) : null,
  imagen: foto(p[4]),
  calorias: 320 + i * 17,
  es_vegetariano: p[1].includes("Veggie") ? 1 : 0,
  es_picante: 0,
  es_gluten_free: 0,
  tiempo_preparacion_min: 12 + (i % 4) * 3,
  disponible: 1,
  categoria_interna: p[5],
  restaurante: restaurantes[p[0] - 1].nombre,
  orden_visual: i + 1,
}));

const extras = [
  { id: 1, nombre: "Papas fritas", precio: 12 },
  { id: 2, nombre: "Bebida 500ml", precio: 10 },
  { id: 3, nombre: "Salsa extra", precio: 4 },
];

const direcciones = [
  ["Casa", "Calle Los Tajibos 142", "Barrio Urbari"],
  ["Oficina", "Manzana 40, Hub40", "Equipetrol"],
  ["Casa de mama", "Av. Pirai 2do anillo", "Zona Pirai"],
].map((d, i) => ({
  id: i + 1,
  usuario_id: 1,
  titulo: d[0],
  calle_numero: d[1],
  piso_depto: i === 1 ? "Piso 3" : "",
  referencia: d[2],
  ciudad: "Santa Cruz de la Sierra",
  codigo_postal: "0000",
  latitud: -17.78,
  longitud: -63.18,
}));

const metodosPago = [
  { id: 1, usuario_id: 1, tipo: "tarjeta", marca: "Visa", ultimos_digitos: "4417", numero_enmascarado: "**** **** **** 4417", titular: "Administrador Demo", icono: "cc-visa", es_predeterminado: 1, token_falso: "demo-1", fecha_agregado: fecha(720) },
  { id: 2, usuario_id: 1, tipo: "tarjeta", marca: "Mastercard", ultimos_digitos: "8032", numero_enmascarado: "**** **** **** 8032", titular: "Administrador Demo", icono: "cc-mastercard", es_predeterminado: 0, token_falso: "demo-2", fecha_agregado: fecha(400) },
  { id: 3, usuario_id: 1, tipo: "efectivo", marca: "Efectivo", ultimos_digitos: "", numero_enmascarado: "Pago en efectivo", titular: "", icono: "money-bill", es_predeterminado: 0, token_falso: "demo-3", fecha_agregado: fecha(100) },
];

const notificaciones = [
  ["Tu pedido va en camino", "El repartidor salio de Burger Cruz.", 1, 0],
  ["20% en Nonna Rosa", "Usa el codigo SPEEDY20 hasta el domingo.", 6, 0],
  ["Pedido entregado", "Calificá tu experiencia en Dona Marta.", 26, 1],
  ["Pago acreditado", "Se cobraron Bs 84 a tu Visa terminada en 4417.", 26, 1],
  ["Nuevo restaurante cerca", "Cafe Tajibo ya reparte en tu zona.", 70, 1],
].map((n, i) => ({
  id: i + 1,
  usuario_id: 1,
  titulo: n[0] as string,
  mensaje: n[1] as string,
  leido: n[3] as number,
  fecha: fecha(n[2] as number),
}));

const crudoPedidos: [number, number, string, number, number, number][] = [
  [1, 1, "en_camino", 90, 8, 1],
  [2, 4, "entregado", 76, 7, 26],
  [3, 2, "entregado", 123, 10, 50],
  [4, 5, "cancelado", 47, 7, 96],
];

const pedidos = crudoPedidos.map((p) => {
  const resto = restaurantes[p[1] - 1];
  return {
    id: p[0],
    codigo_seguimiento: "SPD-" + (1000 + p[0]),
    usuario_id: 1,
    restaurante_id: p[1],
    repartidor_id: 1,
    direccion_entrega_id: 1,
    estado: p[2],
    fecha_creacion: fecha(p[5]),
    fecha_entrega_estimada: fecha(p[5] - 1),
    fecha_entrega_real: p[2] === "entregado" ? fecha(p[5] - 1) : null,
    subtotal: p[3],
    costo_envio: p[4],
    costo_servicio: 3,
    descuento_aplicado: 0,
    total_final: p[3] + p[4] + 3,
    metodo_pago: "tarjeta",
    estado_pago: p[2] === "cancelado" ? "reembolsado" : "pagado",
    notas_instrucciones: "",
    restaurante_nombre: resto.nombre,
    restaurante_logo: resto.imagen_logo,
  };
});

const detallePorPedido: Record<number, any[]> = {
  1: [productos[0], productos[1]],
  2: [productos[9], productos[11]],
  3: [productos[4], productos[5]],
  4: [productos[12]],
};

const detalle = (pedidoId: number) =>
  (detallePorPedido[pedidoId] || []).map((p, i) => ({
    id: pedidoId * 10 + i,
    pedido_id: pedidoId,
    producto_id: p.id,
    cantidad: 1,
    precio_unitario: p.precio,
    nombre_producto_snapshot: p.nombre,
    extras_json: "[]",
    notas_item: "",
    imagen: p.imagen,
  }));

const cupones: Record<string, any> = {
  SPEEDY20: { codigo: "SPEEDY20", tipo: "porcentaje", valor: 20, descripcion: "20% de descuento" },
  ENVIOGRATIS: { codigo: "ENVIOGRATIS", tipo: "envio", valor: 0, descripcion: "Envio sin costo" },
};

// Lo que el visitante agrega se ve de inmediato, pero vive solo en memoria.
const estado = {
  direcciones: [...direcciones],
  metodos: [...metodosPago],
  notificaciones: [...notificaciones],
  pedidos: [...pedidos],
  favoritos: [productos[1].id, productos[6].id, productos[13].id],
};

let siguienteId = 1000;
const nuevoId = () => (siguienteId += 1);

function resolver(metodo: string, ruta: string, consulta: URLSearchParams, cuerpo: any): any {
  const partes = ruta.split("/").filter(Boolean);
  const raiz = partes[0] || "";

  if (raiz === "login") {
    return { success: true, token: TOKEN, user: USUARIO, repartidor: null };
  }

  if (raiz === "usuarios") {
    return metodo === "GET" ? USUARIO : { success: true };
  }

  if (raiz === "categorias") return categorias;

  if (raiz === "restaurantes") return restaurantes;

  if (raiz === "productos") {
    if (partes[1]) {
      const uno = productos.find((p) => String(p.id) === partes[1]);
      return uno ? { ...uno, extrasDisponibles: extras } : {};
    }
    const restaurante = consulta.get("restaurante_id");
    return restaurante
      ? productos.filter((p) => String(p.restaurante_id) === restaurante)
      : productos;
  }

  if (raiz === "direcciones") {
    if (metodo === "POST") {
      const nueva = {
        id: nuevoId(),
        usuario_id: 1,
        titulo: cuerpo?.titulo || "Nueva direccion",
        calle_numero: cuerpo?.calle_numero || "Sin calle",
        piso_depto: cuerpo?.piso_depto || "",
        referencia: cuerpo?.referencia || "",
        ciudad: cuerpo?.ciudad || "Santa Cruz de la Sierra",
        codigo_postal: "0000",
        latitud: -17.78,
        longitud: -63.18,
      };
      estado.direcciones = [...estado.direcciones, nueva];
      return { id: nueva.id, message: "Direccion guardada" };
    }
    return estado.direcciones;
  }

  if (raiz === "cupones") {
    const codigo = String(cuerpo?.codigo || "").toUpperCase();
    return cupones[codigo]
      ? { success: true, ...cupones[codigo] }
      : { success: false, message: "Cupon no valido" };
  }

  if (raiz === "pedidos") {
    if (metodo === "POST") {
      const id = nuevoId();
      const resto = restaurantes.find((r) => r.id === Number(cuerpo?.restaurante_id)) || restaurantes[0];
      const nuevo = {
        ...pedidos[0],
        id,
        codigo_seguimiento: "SPD-" + id,
        restaurante_id: resto.id,
        restaurante_nombre: resto.nombre,
        restaurante_logo: resto.imagen_logo,
        estado: "confirmado",
        fecha_creacion: fecha(0),
        subtotal: cuerpo?.subtotal ?? 0,
        total_final: cuerpo?.total_final ?? cuerpo?.subtotal ?? 0,
      };
      estado.pedidos = [nuevo, ...estado.pedidos];
      return { success: true, message: "Pedido creado correctamente", id, codigo: nuevo.codigo_seguimiento };
    }
    if (partes[1]) {
      const uno = estado.pedidos.find((p) => String(p.id) === partes[1]) || estado.pedidos[0];
      return { ...uno, items: detalle(Number(uno.id)) };
    }
    return estado.pedidos;
  }

  if (raiz === "favoritos") {
    if (metodo === "POST") {
      const id = Number(cuerpo?.producto_id);
      if (id && !estado.favoritos.includes(id)) estado.favoritos = [...estado.favoritos, id];
      return { success: true };
    }
    if (metodo === "DELETE") {
      const id = Number(cuerpo?.producto_id);
      estado.favoritos = estado.favoritos.filter((x) => x !== id);
      return { success: true };
    }
    return productos
      .filter((p) => estado.favoritos.includes(p.id))
      .map((p) => ({ id: p.id, nombre: p.nombre, imagen: p.imagen, precio: p.precio, descripcion: p.descripcion }));
  }

  if (raiz === "pagos") {
    if (metodo === "POST") {
      const nuevo = {
        ...metodosPago[0],
        id: nuevoId(),
        marca: cuerpo?.marca || "Visa",
        ultimos_digitos: String(cuerpo?.numero || "0000").slice(-4),
        numero_enmascarado: "**** **** **** " + String(cuerpo?.numero || "0000").slice(-4),
        es_predeterminado: 0,
        fecha_agregado: fecha(0),
      };
      estado.metodos = [...estado.metodos, nuevo];
      return { success: true };
    }
    if (metodo === "DELETE") {
      const id = Number(partes[1]);
      estado.metodos = estado.metodos.filter((m) => m.id !== id);
      return { success: true };
    }
    return estado.metodos;
  }

  if (raiz === "notificaciones") return estado.notificaciones;

  return [];
}

function interceptarFetch() {
  const original =
    typeof globalThis.fetch === "function" ? globalThis.fetch.bind(globalThis) : null;

  globalThis.fetch = (async (entrada: any, opciones: any = {}) => {
    const url =
      typeof entrada === "string"
        ? entrada
        : entrada && entrada.url
          ? entrada.url
          : String(entrada);

    if (!url.includes("/api/")) {
      if (original) return original(entrada, opciones);
      throw new Error("Sin red en modo demo");
    }

    const metodo = String(opciones?.method || "GET").toUpperCase();
    const resto = url.split("/api/")[1];
    const ruta = resto.split("?")[0];
    const consulta = new URLSearchParams(resto.includes("?") ? resto.split("?")[1] : "");
    let cuerpo: any = null;
    try {
      cuerpo = opciones?.body ? JSON.parse(opciones.body) : null;
    } catch {
      cuerpo = null;
    }

    const datos = resolver(metodo, ruta, consulta, cuerpo);
    return new Response(JSON.stringify(datos), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch;
}

let activado = false;

export async function activarDemo() {
  if (!DEMO || activado) return;
  activado = true;
  interceptarFetch();
  try {
    // Forma que guarda zustand/persist para el store "auth-storage".
    await AsyncStorage.setItem(
      "auth-storage",
      JSON.stringify({
        state: {
          user: USUARIO,
          repartidorInfo: null,
          isAuthenticated: true,
          token: TOKEN,
        },
        version: 0,
      }),
    );
  } catch {
    // Si el almacenamiento falla, la demo arranca en la pantalla de ingreso y
    // las credenciales de DEMO.md siguen funcionando.
  }
}
