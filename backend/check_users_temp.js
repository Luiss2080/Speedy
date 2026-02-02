const mysql = require("mysql2/promise");
require("dotenv").config();

(async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Speedy",
  });

  try {
    const [rows] = await connection.query(
      "SELECT id, nombre, email, password, rol FROM usuarios",
    );
    console.log("Current Users in DB:");
    console.table(rows);
  } catch (e) {
    console.error(e);
  } finally {
    connection.end();
  }
})();
