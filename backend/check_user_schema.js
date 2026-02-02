const mysql = require("mysql2/promise");
require("dotenv").config();

async function checkUserSchema() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Speedy",
  });

  try {
    const [cols] = await connection.query("SHOW COLUMNS FROM usuarios");
    console.log(
      "USER COLS:",
      JSON.stringify(
        cols.map((c) => c.Field),
        null,
        2,
      ),
    );

    // Check one user
    const [rows] = await connection.query("SELECT * FROM usuarios LIMIT 1");
    console.log("SAMPLE USER:", JSON.stringify(rows[0], null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await connection.end();
  }
}

checkUserSchema();
