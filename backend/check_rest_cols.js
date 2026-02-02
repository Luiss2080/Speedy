const mysql = require("mysql2/promise");
require("dotenv").config();

async function checkRestCols() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Speedy",
  });

  try {
    const [rows] = await connection.query("DESCRIBE restaurantes");
    console.log("REST COLS:", JSON.stringify(rows.map((r) => r.Field)));
  } catch (error) {
    console.error(error);
  } finally {
    await connection.end();
  }
}

checkRestCols();
