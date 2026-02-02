const mysql = require("mysql2/promise");
require("dotenv").config();

async function checkRestData() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Speedy",
  });

  try {
    const [rows] = await connection.query(
      "SELECT id, nombre, imagen_portada FROM restaurantes LIMIT 3",
    );
    console.log("REST DATA:", JSON.stringify(rows, null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    await connection.end();
  }
}

checkRestData();
