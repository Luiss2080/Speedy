const mysql = require("mysql2/promise");
require("dotenv").config();

async function seedOrdersForAll() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Speedy",
  });

  try {
    console.log("Seeding Orders for ALL Users...");

    // Get ALL users
    const [users] = await connection.query("SELECT id FROM usuarios");

    // Get restaurants
    const [restaurants] = await connection.query(
      "SELECT id, nombre, costo_envio_base FROM restaurantes LIMIT 5",
    );

    if (users.length === 0 || restaurants.length === 0) {
      console.log("No users or restaurants found.");
      return;
    }

    const statuses = [
      "entregado",
      "entregado",
      "cancelado",
      "en_camino",
      "preparando",
    ];

    for (const user of users) {
      // Ensure address exists
      let addressId = 1;
      try {
        const [addrRes] = await connection.query(
          "INSERT INTO direcciones (usuario_id, titulo, calle_numero, latitud, longitud, ciudad, codigo_postal, referencia) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            user.id,
            "Casa",
            `Av. Banzer #${user.id * 10}`,
            -17.0,
            -63.0,
            "Santa Cruz",
            "0000",
            "Porton negro",
          ],
        );
        addressId = addrRes.insertId;
      } catch (e) {
        // If fails, try to find existing
        const [existing] = await connection.query(
          "SELECT id FROM direcciones WHERE usuario_id = ? LIMIT 1",
          [user.id],
        );
        if (existing.length > 0) addressId = existing[0].id;
      }

      // Create 5 orders for EACH user
      for (let i = 0; i < 5; i++) {
        const rest =
          restaurants[Math.floor(Math.random() * restaurants.length)];
        const status = statuses[i % statuses.length];
        const total = (Math.random() * 50 + 10).toFixed(2);

        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));

        await connection.query(
          "INSERT INTO pedidos (usuario_id, restaurante_id, total_final, subtotal, costo_envio, estado, direccion_entrega_id, fecha_creacion, codigo_seguimiento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            user.id,
            rest.id,
            total,
            (total - (rest.costo_envio_base || 5)).toFixed(2),
            rest.costo_envio_base || 5.0,
            status,
            addressId,
            date,
            `ORD-${user.id}-${100 + i}`,
          ],
        );
      }
      console.log(`✅ Seeded 5 orders for User ID ${user.id}`);
    }
  } catch (error) {
    console.error("❌ Error seeding orders:", error);
  } finally {
    await connection.end();
  }
}

seedOrdersForAll();
