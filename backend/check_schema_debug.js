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
    console.table(rows);

    const [repRows] = await connection.query("DESCRIBE repartidores");
    console.table(repRows);
  } catch (error) {
    console.error(error);
  } finally {
    await connection.end();
  }
}

checkSchema();
