const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Speedy",
  });

  try {
    const sql = fs.readFileSync(
      path.join(__dirname, "migrations", "008_favorites_schema.sql"),
      "utf8",
    );
    console.log("Ejecutando migración 008_favorites_schema.sql...");

    // Split by semicolon to handle multiple statements if any
    const statements = sql.split(";").filter((s) => s.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }

    console.log("✅ Migración completada exitosamente.");
  } catch (error) {
    console.error("❌ Error en la migración:", error);
  } finally {
    await connection.end();
  }
}

runMigration();
