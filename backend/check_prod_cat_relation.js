const mysql = require("mysql2/promise");
require("dotenv").config();

async function checkProductCategories() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Speedy",
  });

  try {
    // Check columns
    const [cols] = await connection.query("SHOW COLUMNS FROM productos");
    console.log("COLUMNS:", cols.map((c) => c.Field).join(", "));

    // Check data sample
    const [rows] = await connection.query(
      "SELECT id, nombre, categoria_id FROM productos LIMIT 10",
    );
    console.log("SAMPLE DATA:", JSON.stringify(rows, null, 2));

    // Check categories
    const [cats] = await connection.query("SELECT * FROM categorias");
    console.log("CATEGORIES:", JSON.stringify(cats, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await connection.end();
  }
}

checkProductCategories();
