const mysql = require("mysql2/promise");
require("dotenv").config();

async function checkSchema() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Speedy",
  });

  try {
    const [rows] = await connection.query("DESCRIBE pedidos");
    console.log(rows.map((r) => r.Field));
  } catch (e) {
    console.error(e);
  } finally {
    await connection.end();
  }
}

checkSchema();
