const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Database Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "Speedy",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test Connection
pool
  .getConnection()
  .then((conn) => {
    console.log("✅ Conectado a la base de datos MySQL: Speedy");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ Error conectando a MySQL:", err);
  });

// --- ROUTES ---

// 1. Categorías
app.get("/api/categorias", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categorias");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Restaurantes
app.get("/api/restaurantes", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM restaurantes");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Productos (Todos o por Restaurante)
app.get("/api/productos", async (req, res) => {
  try {
    const { restaurante_id } = req.query;
    let query = "SELECT * FROM productos";
    let params = [];

    if (restaurante_id) {
      query += " WHERE restaurante_id = ?";
      params.push(restaurante_id);
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3.1 Producto Individual (Con Opciones/Extras Reales)
app.get("/api/productos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Get Product
    const [rows] = await pool.query("SELECT * FROM productos WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Producto no encontrado" });
    const producto = rows[0];

    // 2. Get Options/Extras Groups
    const [grupos] = await pool.query(
      "SELECT * FROM grupos_opciones WHERE producto_id = ?",
      [id],
    );

    // 3. Get Options Values for each group
    // Note: In production doing N+1 queries is bad, but fine for detail view of 1 product.
    const extrasDisponibles = [];

    for (const grupo of grupos) {
      const [opciones] = await pool.query(
        "SELECT * FROM opciones_producto WHERE grupo_id = ?",
        [grupo.id],
      );

      // Add to flat list for compatibility with current Frontend (ProductVista) which expects flat extras
      // OR redesign frontend to handle groups.
      // For NOW: Flatten them so they appear as "Extras".
      for (const op of opciones) {
        extrasDisponibles.push({
          id: op.id.toString(), // Frontend expects string id
          nombre: `${grupo.nombre}: ${op.nombre}`, // Contextualize name "Salsa: BBQ"
          precio: parseFloat(op.precio_extra),
          grupo_id: grupo.id,
          tipo: grupo.tipo_seleccion,
        });
      }
    }

    res.json({ ...producto, extrasDisponibles });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Direcciones
app.get("/api/direcciones", async (req, res) => {
  try {
    const { usuario_id } = req.query;
    // Default to user 1 for demo
    const userId = usuario_id || 1;
    const [rows] = await pool.query(
      "SELECT * FROM direcciones WHERE usuario_id = ?",
      [userId],
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/direcciones", async (req, res) => {
  try {
    const { titulo, direccion, referencia, usuario_id } = req.body;
    const userId = usuario_id || 1;
    const [result] = await pool.query(
      "INSERT INTO direcciones (usuario_id, titulo, direccion, referencia) VALUES (?, ?, ?, ?)",
      [userId, titulo, direccion, referencia],
    );
    res.json({ id: result.insertId, message: "Dirección guardada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Auth (Login Simple) - Optional if you want real auth later
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body; // Changed to email field for standard login, or map 'usuario' to it if needed
    // Assuming 'usuario' from frontend maps to 'nombre' or 'email' in DB. Let's use 'nombre' for simplicity as per current frontend usage.
    const { usuario } = req.body;

    // Search by name OR email
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE (nombre = ? OR email = ?) AND password = ?",
      [usuario, usuario, password],
    );

    if (rows.length > 0) {
      const user = rows[0];
      let repartidorInfo = null;

      // If user is a repartidor, fetch their specific details
      if (user.rol === "repartidor") {
        const [repRows] = await pool.query(
          "SELECT * FROM repartidores WHERE usuario_id = ?",
          [user.id],
        );
        if (repRows.length > 0) {
          repartidorInfo = repRows[0];
        }
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol,
          avatar: user.avatar,
        },
        repartidor: repartidorInfo,
      });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Credenciales inválidas" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Pedidos (API NUEVA)
app.post("/api/pedidos", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { usuario_id, total, items, restaurante_id, direccion_entrega_id } =
      req.body;

    // Defaults for missing data (since frontend might not send everything yet)
    const finalUserId = usuario_id || 1;
    const finalRestauranteId = restaurante_id || 1; // Default to first restaurant if not sent
    const finalDireccionId = direccion_entrega_id || 1; // Default to first address

    // Generate simple tracking code
    const codigo = `ORD-${Date.now().toString().slice(-6)}`;

    // 1. Insert Header
    const [pedidoResult] = await connection.query(
      `INSERT INTO pedidos (
        codigo_seguimiento, usuario_id, restaurante_id, direccion_entrega_id, 
        subtotal, costo_envio, total_final, estado
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        codigo,
        finalUserId,
        finalRestauranteId,
        finalDireccionId,
        total - 2.0, // Assuming 2.00 shipping cost based on frontend
        2.0,
        total,
        "pendiente",
      ],
    );

    const pedidoId = pedidoResult.insertId;

    // 2. Insert Details
    if (items && items.length > 0) {
      for (const item of items) {
        await connection.query(
          `INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario, nombre_producto_snapshot) 
            VALUES (?, ?, ?, ?, ?)`,
          [
            pedidoId,
            item.producto_id || 1,
            item.cantidad,
            item.precio,
            "Producto Generico",
          ],
          // Note: In a real app we would fetch product name from DB to enable snapshot
        );
      }
    }

    await connection.commit();
    res.json({
      success: true,
      message: "Pedido creado correctamente",
      id: pedidoId,
      codigo,
    });
  } catch (err) {
    await connection.rollback();
    console.error("Error creando pedido:", err);
    res
      .status(500)
      .json({ success: false, message: "Error al procesar el pedido" });
  } finally {
    connection.release();
  }
});

app.get("/api/pedidos", async (req, res) => {
  try {
    const { usuario_id, repartidor_id, estado } = req.query;
    let query = `
      SELECT p.*, r.nombre as restaurante_nombre, r.imagen_logo as restaurante_logo
      FROM pedidos p
      JOIN restaurantes r ON p.restaurante_id = r.id
    `;
    const params = [];

    if (usuario_id) {
      query += " WHERE p.usuario_id = ?";
      params.push(usuario_id);
    } else if (repartidor_id) {
      query += " WHERE p.repartidor_id = ?";
      params.push(repartidor_id);
      if (estado) {
        query += " AND p.estado = ?";
        params.push(estado);
      }
    }

    query += " ORDER BY p.fecha_creacion DESC";

    const [rows] = await pool.query(query, params);

    // Transform to match frontend expectations if needed
    // Current frontend expects simple list, this seems compatible.
    res.json(rows);
  } catch (err) {
    console.error("Error fetching pedidos:", err);
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`Available on your network IP as well.`);
});
