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
    const [rows] = await connection.query("DESCRIBE usuarios");
    console.log("USERS SCHEMA:", JSON.stringify(rows, null, 2));

    const [repRows] = await connection.query("DESCRIBE repartidores");
    console.log("REPARTIDORES SCHEMA:", JSON.stringify(repRows, null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    await connection.end();
  }
}

checkSchema();
