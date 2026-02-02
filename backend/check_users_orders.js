const mysql = require("mysql2/promise");
require("dotenv").config();

async function checkUsersAndOrders() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Speedy",
  });

  try {
    const [users] = await connection.query(
      "SELECT id, nombre, email, rol FROM usuarios",
    );
    console.log("USERS:", JSON.stringify(users, null, 2));

    const [orders] = await connection.query(
      "SELECT id, usuario_id, total_final, descripcion FROM pedidos",
    );
    console.log("ORDERS COUNT by USER:");
    const counts = {};
    orders.forEach((o) => {
      counts[o.usuario_id] = (counts[o.usuario_id] || 0) + 1;
    });
    console.log(JSON.stringify(counts, null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    await connection.end();
  }
}

checkUsersAndOrders();
