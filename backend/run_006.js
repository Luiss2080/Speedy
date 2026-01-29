const mysql = require("mysql2/promise");
require("dotenv").config();

(async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Speedy",
  });

  try {
    const connection = await pool.getConnection();
    console.log("Applying 006 migration...");

    try {
      await connection.query(`
                ALTER TABLE pedidos
                ADD COLUMN conductor_id INT NULL,
                ADD CONSTRAINT fk_pedidos_conductor
                FOREIGN KEY (conductor_id) REFERENCES repartidores(id) ON DELETE SET NULL;
            `);
      console.log("Success!");
    } catch (e) {
      console.error("Migration error (might be already applied):", e.message);
    }

    connection.release();
  } catch (err) {
    console.error("Connection error:", err);
  } finally {
    pool.end();
  }
})();
