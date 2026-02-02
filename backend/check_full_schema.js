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
    const [prodCols] = await connection.query("SHOW COLUMNS FROM productos");
    console.log("PRODUCTOS COLS:", prodCols.map((c) => c.Field).join(", "));

    // Check if categories table exists
    try {
      const [catCols] = await connection.query("SHOW COLUMNS FROM categorias");
      console.log("CATEGORIAS COLS:", catCols.map((c) => c.Field).join(", "));

      const [cats] = await connection.query("SELECT * FROM categorias LIMIT 5");
      console.log("CATEGORIAS DATA:", JSON.stringify(cats));
    } catch (e) {
      console.log("No 'categorias' table found or error:", e.message);
    }
  } catch (error) {
    console.error(error);
  } finally {
    await connection.end();
  }
}

checkSchema();
