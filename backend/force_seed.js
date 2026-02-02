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
    await connection.query("SET FOREIGN_KEY_CHECKS=0");

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

    // 4. Force Re-create Repartidores Table to fix schema issues
    console.log("Fixing Repartidores Schema...");
    await connection.query("DROP TABLE IF EXISTS repartidores");
    await connection.query(`
      CREATE TABLE repartidores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        nombre VARCHAR(255),
        telefono VARCHAR(50),
        dni VARCHAR(50),
        tipo_vehiculo VARCHAR(50),
        modelo_vehiculo VARCHAR(100),
        estado VARCHAR(50) DEFAULT 'disponible',
        latitud_actual DECIMAL(10, 8),
        longitud_actual DECIMAL(11, 8),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      )
    `);

    // 5. Link Driver Profile
    console.log("Linking Driver Profile...");
    await connection.query(
      "INSERT INTO repartidores (usuario_id, nombre, telefono, dni, tipo_vehiculo, modelo_vehiculo, estado, latitud_actual, longitud_actual) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        2,
        "Repartidor Demo",
        "70054321",
        "DNI123456",
        "moto",
        "Honda Cargo 150",
        "disponible",
        -12.125,
        -77.025,
      ],
    );

    console.log("✅ Force Seed Completed.");

    // Verify
    const [rows] = await connection.query(
      "SELECT id, nombre, email, password FROM usuarios",
    );
    console.table(rows);
    await connection.query("SET FOREIGN_KEY_CHECKS=1");
  } catch (error) {
    console.error("❌ Error force seeding:", error);
  } finally {
    await connection.end();
  }
}

forceSeed();
