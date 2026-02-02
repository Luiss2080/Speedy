const mysql = require("mysql2/promise");
require("dotenv").config();

async function debugDB() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Speedy",
  });

  try {
    const [users] = await connection.query(
      "SELECT id, nombre, email FROM usuarios",
    );
    console.log("USERS:", JSON.stringify(users, null, 2));

    const [dirCols] = await connection.query("DESCRIBE direcciones");
    console.log(
      "DIRECCIONES SCHEMA:",
      JSON.stringify(dirCols.map((c) => c.Field)),
    );

    const [dirs] = await connection.query("SELECT * FROM direcciones");
    console.log("DIRECCIONES DATA:", JSON.stringify(dirs, null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    await connection.end();
  }
}

debugDB();
