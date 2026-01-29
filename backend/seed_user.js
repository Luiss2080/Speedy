const mysql = require("mysql2/promise");
require("dotenv").config();

async function seedUser() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Speedy",
  });

  try {
    console.log("Seeding User 1...");
    await connection.query(
      "INSERT IGNORE INTO usuarios (id, nombre, email, password, rol) VALUES (1, 'Usuario Demo', 'demo@speedy.com', '123456', 'cliente')",
    );
    console.log("✅ User 1 seeded successfully.");
  } catch (error) {
    console.error("❌ Error seeding user:", error);
  } finally {
    await connection.end();
  }
}

seedUser();
