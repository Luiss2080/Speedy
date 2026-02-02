const mysql = require("mysql2/promise");
require("dotenv").config();

async function checkDirecciones() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Speedy",
  });

  try {
    const [rows] = await connection.query("SELECT * FROM direcciones LIMIT 5");
    console.log("ADDRESSES:", JSON.stringify(rows, null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    await connection.end();
  }
}

checkDirecciones();
