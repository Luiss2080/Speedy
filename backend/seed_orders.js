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
      try {
        // Corrected columns: titulo, calle_numero
        const [addrRes] = await connection.query(
          "INSERT INTO direcciones (usuario_id, titulo, calle_numero, latitud, longitud, ciudad, codigo_postal, referencia) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            userId,
            "Casa",
            "Av. Banzer #123",
            -17.0,
            -63.0,
            "Santa Cruz",
            "0000",
            "Porton negro",
          ],
        );
        addressId = addrRes.insertId;
      } catch (e) {
        console.log("Could not insert address:", e.message);
      }
    }

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

      console.log(`Inserted order ${res.insertId} with status ${status}`);
    }

    console.log("✅ 12 Orders seeded successfully.");
  } catch (error) {
    console.error("❌ Error seeding orders:", error);
  } finally {
    await connection.end();
  }
}

seedOrders();
