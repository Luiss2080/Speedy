const mysql = require("mysql2/promise");
require("dotenv").config();

async function forceSeed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Speedy",
  });

  try {
    console.log("🛠️ Force Seeding Users...");

    // 1. Delete existing users to ensure clean slate (optional, but ensures no duplicates/conflicts)
    // await connection.query("DELETE FROM usuarios WHERE email IN ('demo@speedy.com', 'repartidor@speedy.com')");

    // 2. Insert Client
    console.log("Inserting Client...");
    // Try minimal columns first: id, nombre, email, password, rol
    await connection.query(
      "INSERT IGNORE INTO usuarios (id, nombre, email, password, rol) VALUES (?, ?, ?, ?, ?)",
      [1, "Usuario Demo", "demo@speedy.com", "123456", "cliente"],
    );

    // 3. Insert Driver
    console.log("Inserting Driver...");
    await connection.query(
      "INSERT IGNORE INTO usuarios (id, nombre, email, password, rol) VALUES (?, ?, ?, ?, ?)",
      [2, "Repartidor Demo", "repartidor@speedy.com", "demo123", "repartidor"],
    );

    // 4. Link Driver Profile
    // Check if repartidores table exists and has these columns. Assuming yes based on migration 005.
    console.log("Linking Driver Profile...");
    await connection.query(
      "INSERT IGNORE INTO repartidores (id, usuario_id, nombre, tipo_vehiculo, modelo_vehiculo, estado) VALUES (?, ?, ?, ?, ?, ?)",
      [1, 2, "Repartidor Demo", "moto", "Honda Cargo 150", "disponible"],
    );

    console.log("✅ Force Seed Completed.");

    // Verify
    const [rows] = await connection.query(
      "SELECT id, nombre, email, password FROM usuarios",
    );
    console.table(rows);
  } catch (error) {
    console.error("❌ Error force seeding:", error);
  } finally {
    await connection.end();
  }
}

forceSeed();
