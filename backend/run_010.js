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
      path.join(__dirname, "migrations", "010_notifications_schema.sql"),
      "utf8",
    );
    console.log("Ejecutando migración 010_notifications_schema.sql...");

    // Split by semicolon and run each
    const statements = sql.split(";").filter((s) => s.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }

    console.log("✅ Migración de notificaciones completada.");
  } catch (error) {
    console.error("❌ Error en la migración:", error);
  } finally {
    await connection.end();
  }
}

runMigration();
