const mysql = require("mysql2/promise");
require("dotenv").config();

async function checkKeysLineByLine() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Speedy",
  });

  try {
    const [rows] = await connection.query("SELECT * FROM productos LIMIT 1");
    if (rows.length > 0) {
      console.log("--- COLUMNS ---");
      Object.keys(rows[0]).forEach((k) => console.log(k));
      console.log("--- DATA SAMPLE ---");
      // Print image-like columns
      Object.keys(rows[0]).forEach((k) => {
        if (
          k.includes("img") ||
          k.includes("foto") ||
          k.includes("url") ||
          k.includes("image")
        ) {
          console.log(`${k}: ${rows[0][k]}`);
        }
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    await connection.end();
  }
}

checkKeysLineByLine();
