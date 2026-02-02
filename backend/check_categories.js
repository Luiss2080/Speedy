const mysql = require("mysql2/promise");
require("dotenv").config();

async function checkCategories() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Speedy",
  });

  try {
    const [rows] = await connection.query(
      "SELECT DISTINCT categoria FROM productos",
    );
    console.log("DB CATEGORIES:", JSON.stringify(rows));

    const [all] = await connection.query(
      "SELECT id, nombre, categoria FROM productos LIMIT 10",
    );
    console.log("SAMPLE PRODUCTS:", JSON.stringify(all, null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    await connection.end();
  }
}

checkCategories();
