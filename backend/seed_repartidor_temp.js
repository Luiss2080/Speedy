const mysql = require("mysql2/promise");
require("dotenv").config();

async function seedRepartidor() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Speedy",
  });

  try {
    console.log("Seeding Repartidor...");
    // 1. Insert User
    const [res] = await connection.query(
      "INSERT IGNORE INTO usuarios (nombre, email, password, rol, telefono, avatar, estado) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        "Repartidor Demo",
        "repartidor@speedy.com",
        "demo123",
        "repartidor",
        "555-0100",
        "https://i.pravatar.cc/150?img=60",
        "activo",
      ],
    );

    // Get ID (if ignored, fetching by email)
    const [rows] = await connection.query(
      "SELECT id FROM usuarios WHERE email = ?",
      ["repartidor@speedy.com"],
    );
    const userId = rows[0].id;

    // 2. Insert into Repartidores
    await connection.query(
      "INSERT IGNORE INTO repartidores (usuario_id, nombre, telefono, dni, tipo_vehiculo, modelo_vehiculo, estado, latitud_actual, longitud_actual) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        userId,
        "Repartidor Demo",
        "555-0100",
        "DNI123456",
        "moto",
        "Honda Cargo 150",
        "disponible",
        -17.393835,
        -66.156946,
      ],
    );

    console.log("✅ Repartidor seeded successfully.");
  } catch (error) {
    console.error("❌ Error seeding repartidor:", error);
  } finally {
    await connection.end();
  }
}

seedRepartidor();
