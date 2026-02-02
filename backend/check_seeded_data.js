const mysql = require("mysql2/promise");
require("dotenv").config();

async function checkNewProducts() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Speedy",
  });

  try {
    const [rows] = await connection.query(
      "SELECT id, nombre, descripcion FROM productos WHERE nombre LIKE 'Taco%' OR nombre LIKE 'Sushi%' OR nombre LIKE 'Ensalada%'",
    );
    console.log("SEEDED PRODUCTS FOUND:", JSON.stringify(rows, null, 2));

    const [count] = await connection.query(
      "SELECT count(*) as total FROM productos",
    );
    console.log("TOTAL PRODUCTS:", count[0].total);
  } catch (error) {
    console.error(error);
  } finally {
    await connection.end();
  }
}

checkNewProducts();
