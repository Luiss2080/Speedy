const mysql = require("mysql2/promise");
require("dotenv").config();

const DESAYUNOS = [
  {
    nombre: "Chilaquiles Verdes",
    descripcion: "Totopos bañados en salsa verde con pollo y crema",
    precio: 85,
  },
  {
    nombre: "Hot Cakes Clásicos",
    descripcion: "3 piezas con miel de maple y mantequilla",
    precio: 70,
  },
  {
    nombre: "Sandwich de Jamón",
    descripcion: "Pan integral con jamón de pavo y queso panela",
    precio: 55,
  },
  {
    nombre: "Omelet de Espinacas",
    descripcion: "Relleno de queso crema y espinacas, incluye frijoles",
    precio: 90,
  },
  {
    nombre: "Huevos Rancheros",
    descripcion: "2 huevos estrellados sobre tortilla frita y salsa roja",
    precio: 80,
  },
];

async function seedDesayunos() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Speedy",
  });

  try {
    console.log("Seeding desayunos...");

    // Get generic restaurant
    const [rests] = await connection.query(
      "SELECT id FROM restaurantes LIMIT 1",
    );
    let restId = 1;
    if (rests.length > 0) restId = rests[0].id;

    for (const p of DESAYUNOS) {
      await connection.query(
        `INSERT INTO productos (restaurante_id, nombre, descripcion, precio, disponible, imagen) 
             VALUES (?, ?, ?, ?, 1, NULL)`,
        [restId, p.nombre, p.descripcion, p.precio],
      );
      console.log(`Inserted: ${p.nombre}`);
    }
    console.log("Desayunos complete!");
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await connection.end();
  }
}

seedDesayunos();
