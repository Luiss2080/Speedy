const mysql = require("mysql2/promise");
require("dotenv").config();

async function seedOrders() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Speedy",
  });

  try {
    console.log("Seeding Orders...");
    const userId = 1; // Demo User

    // Get some restaurants
    const [restaurants] = await connection.query(
      "SELECT id, nombre, costo_envio_base FROM restaurantes LIMIT 5",
    );
    if (restaurants.length === 0) throw new Error("No restaurants found");

    const statuses = [
      "entregado",
      "entregado",
      "cancelado",
      "en_camino",
      "preparando",
    ];

    // Clear existing for cleaner demo
    // await connection.query("DELETE FROM pedidos WHERE usuario_id = ?", [userId]);

    for (let i = 0; i < 12; i++) {
      const rest = restaurants[Math.floor(Math.random() * restaurants.length)];
      const status = statuses[i % statuses.length];
      const total = (Math.random() * 50 + 10).toFixed(2);

      // Date: random past date
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));

      // Insert Order
      const [res] = await connection.query(
        "INSERT INTO pedidos (usuario_id, restaurante_id, total_final, subtotal, costo_envio, estado, direccion_entrega_id, fecha_creacion, codigo_seguimiento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          userId,
          rest.id,
          total,
          (total - (rest.costo_envio_base || 5)).toFixed(2),
          rest.costo_envio_base || 5.0,
          status,
          1, // Default address ID
          date,
          `ORD-${1000 + i}`,
        ],
      );

      const pedidoId = res.insertId;
      console.log(`Inserted order ${pedidoId}`);
    }

    console.log("✅ 12 Orders seeded successfully.");
  } catch (error) {
    console.error("❌ Error seeding orders:", error);
  } finally {
    await connection.end();
  }
}

seedOrders();
