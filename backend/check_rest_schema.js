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
    const [cols] = await connection.query("SHOW COLUMNS FROM restaurantes");
    console.log(
      "REST COLS:",
      JSON.stringify(
        cols.map((c) => c.Field),
        null,
        2,
      ),
    );

    // Check pivot tables?
    const [tables] = await connection.query("SHOW TABLES");
    console.log(
      "TABLES:",
      JSON.stringify(
        tables.map((t) => Object.values(t)[0]),
        null,
        2,
      ),
    );
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await connection.end();
  }
}

checkRestCols();
