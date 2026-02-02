const mysql = require("mysql2/promise");
require("dotenv").config();

async function checkCols() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Speedy",
  });

  try {
    const [uRows] = await connection.query("DESCRIBE usuarios");
    console.log("USERS COLUMNS: " + uRows.map((r) => r.Field).join(", "));

    const [rRows] = await connection.query("DESCRIBE repartidores");
    console.log(
      "REPARTIDORES COLUMNS: " + rRows.map((r) => r.Field).join(", "),
    );
  } catch (error) {
    console.error(error);
  } finally {
    await connection.end();
  }
}

checkCols();
