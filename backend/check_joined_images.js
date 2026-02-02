const mysql = require("mysql2/promise");
require("dotenv").config();

async function checkPedidosImages() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Speedy",
  });

  try {
    const [rows] = await connection.query(`
        SELECT p.id, p.restaurant_id, r.nombre, r.imagen_portada 
        FROM pedidos p 
        LEFT JOIN restaurantes r ON p.restaurante_id = r.id 
        LIMIT 5
    `);
    console.log("JOINED DATA:", JSON.stringify(rows, null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    await connection.end();
  }
}

checkPedidosImages();
