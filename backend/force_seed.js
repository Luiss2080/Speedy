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
    await connection.query(
      "INSERT IGNORE INTO usuarios (id, nombre, email, password, rol, telefono, avatar, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        1,
        "Usuario Demo",
        "demo@speedy.com",
        "123456",
        "cliente",
        "70012345",
        "https://randomuser.me/api/portraits/men/1.jpg",
        "activo",
      ],
    );

    // 3. Insert Driver
    console.log("Inserting Driver...");
    await connection.query(
      "INSERT IGNORE INTO usuarios (id, nombre, email, password, rol, telefono, avatar, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        2,
        "Repartidor Demo",
        "repartidor@speedy.com",
        "demo123",
        "repartidor",
        "70054321",
        "https://randomuser.me/api/portraits/men/2.jpg",
        "activo",
      ],
    );

    // 4. Link Driver Profile
    console.log("Linking Driver Profile...");
    await connection.query(
      "INSERT IGNORE INTO repartidores (id, usuario_id, nombre, telefono, dni, tipo_vehiculo, modelo_vehiculo, estado, latitud_actual, longitud_actual) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        1,
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
  } catch (error) {
    console.error("❌ Error force seeding:", error);
  } finally {
    await connection.end();
  }
}

forceSeed();
