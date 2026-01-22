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

// 3.1 Producto Individual (Detalle + Extras Mock)
app.get("/api/productos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM productos WHERE id = ?", [
      id,
    ]);

    if (rows.length === 0)
      return res.status(404).json({ error: "Producto no encontrado" });

    const producto = rows[0];

    // Mock Extras based on category (Simple logic for demo)
    let extras = [];
    if (
      producto.categoria === "Hamburguesas" ||
      producto.categoria === "Combos"
    ) {
      extras = [
        { id: "e1", nombre: "Queso Extra", precio: 1.5 },
        { id: "e2", nombre: "Tocino", precio: 2.0 },
        { id: "e3", nombre: "Papas Grandes", precio: 3.5 },
      ];
    } else if (producto.categoria === "Pizza") {
      extras = [
        { id: "e4", nombre: "Queso Borde", precio: 4.0 },
        { id: "e5", nombre: "Peperoni Extra", precio: 2.5 },
      ];
    }

    res.json({ ...producto, extrasDisponibles: extras });
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
  // For now simple pass-through or mock
  res.json({ message: "Login logic to be implemented" });
});

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`Available on your network IP as well.`);
});
