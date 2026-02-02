const mysql = require("mysql2/promise");
require("dotenv").config();

async function checkPedidosSchema() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Speedy",
  });

  try {
    const [rows] = await connection.query("DESCRIBE pedidos");
    console.log("PEDIDOS COLS:", JSON.stringify(rows.map((r) => r.Field)));

    // Also check detalle_pedidos to know how to insert items
    const [detRows] = await connection.query("DESCRIBE detalle_pedidos");
    console.log(
      "DETALLE PEDIDOS COLS:",
      JSON.stringify(detRows.map((r) => r.Field)),
    );
  } catch (error) {
    console.error(error);
  } finally {
    await connection.end();
  }
}

checkPedidosSchema();
