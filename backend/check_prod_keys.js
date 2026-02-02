const mysql = require("mysql2/promise");
require("dotenv").config();

async function checkOneProduct() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Speedy",
  });

  try {
    const [rows] = await connection.query("SELECT * FROM productos LIMIT 1");
    if (rows.length > 0) {
      console.log("PRODUCT KEYS:", Object.keys(rows[0]).join(", "));
      console.log("PRODUCT DATA:", JSON.stringify(rows[0], null, 2));
    } else {
      console.log("No products found.");
    }
  } catch (error) {
    console.error(error);
  } finally {
    await connection.end();
  }
}

checkOneProduct();
