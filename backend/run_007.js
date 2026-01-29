require("dotenv").config();
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "Speedy",
  multipleStatements: true,
};

async function runSeed() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log("Conectado a la base de datos.");

    const sqlPath = path.join(
      __dirname,
      "migrations",
      "007_massive_content_seed.sql",
    );
    const sql = fs.readFileSync(sqlPath, "utf8");

    console.log("Ejecutando seeds masivos...");
    await connection.query(sql);
    console.log("✅ Seed masivo aplicado con éxito!");
  } catch (error) {
    console.error("❌ Error al aplicar seeds:", error);
  } finally {
    if (connection) await connection.end();
  }
}

runSeed();
