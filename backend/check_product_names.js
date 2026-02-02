const mysql = require("mysql2/promise");
require("dotenv").config();

async function checkProductNames() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Speedy",
  });

  try {
    const [rows] = await connection.query(
      "SELECT id, nombre, descripcion FROM productos LIMIT 50",
    );
    console.log("PRODUCTS:", JSON.stringify(rows, null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    await connection.end();
  }
}

checkProductNames();
