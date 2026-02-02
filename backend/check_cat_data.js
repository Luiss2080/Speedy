const mysql = require("mysql2/promise");
require("dotenv").config();

async function checkCategoriesData() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Speedy",
  });

  try {
    const [rows] = await connection.query("SELECT * FROM categorias");
    console.log("DB CATEGORIES:", JSON.stringify(rows));
  } catch (error) {
    console.error(error);
  } finally {
    await connection.end();
  }
}

checkCategoriesData();
