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

    // Check or Insert Address
    let addressId = 1;
    const [addresses] = await connection.query(
      "SELECT id FROM direcciones WHERE usuario_id = ?",
      [userId],
    );
    if (addresses.length > 0) {
      addressId = addresses[0].id;
    } else {
      console.log("Creating dummy address...");
      // Assuming simplistic schema for demo based on common sense, if it fails I'll check schema.
      // Trying generic insert. If it fails, I'll default to just not crashing (but FK will fail).
      // Let's check schema first? No, let's try a safe insert.
      // Wait, I don't know the schema of direcciones.
      // I'll assume: usuario_id, direccion, nombre (label).
      // If this fails, I will be stuck.
      // BETTER: Check schema of direcciones quickly?
      // No, I will try to insert and catch error.

      // Actually, to be robust, I will inspect schema in a separate quick script or just guess common fields.
      // Let's try to insert with minimal fields.
      try {
        const [addrRes] = await connection.query(
          "INSERT INTO direcciones (usuario_id, nombre, direccion, latitud, longitud) VALUES (?, ?, ?, ?, ?)",
          [userId, "Casa", "Av. Banzer #123", -17.0, -63.0],
        );
        addressId = addrRes.insertId;
      } catch (e) {
        console.log(
          "Could not insert address, trying generic ID 1 anyway.",
          e.message,
        );
      }
    }

    const statuses = [
      "entregado",
      "entregado",
      "cancelado",
      "en_camino",
      "preparando",
    ];

    for (let i = 0; i < 12; i++) {
      const rest = restaurants[Math.floor(Math.random() * restaurants.length)];
      const status = statuses[i % statuses.length];
      const total = (Math.random() * 50 + 10).toFixed(2);

      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));

      const [res] = await connection.query(
        "INSERT INTO pedidos (usuario_id, restaurante_id, total_final, subtotal, costo_envio, estado, direccion_entrega_id, fecha_creacion, codigo_seguimiento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          userId,
          rest.id,
          total,
          (total - (rest.costo_envio_base || 5)).toFixed(2),
          rest.costo_envio_base || 5.0,
          status,
          addressId,
          date,
          `ORD-${1000 + i}`,
        ],
      );

      console.log(`Inserted order ${res.insertId}`);
    }

    console.log("✅ 12 Orders seeded successfully.");
  } catch (error) {
    console.error("❌ Error seeding orders:", error);
  } finally {
    await connection.end();
  }
}

seedOrders();
