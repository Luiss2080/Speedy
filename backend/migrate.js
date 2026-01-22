const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const DB_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "Speedy", // Use Speedy database
  multipleStatements: true, // Critical for running Full Schema scripts
};

async function migrate() {
  let connection;
  try {
    // 1. Connect without Database first to Create it if needed
    const { database, ...serverConfig } = DB_CONFIG;
    connection = await mysql.createConnection(serverConfig);

    console.log(`📦 Checking Database '${database}'...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${database}`);
    await connection.end();

    // 2. Connect to the actual database
    connection = await mysql.createConnection(DB_CONFIG);
    console.log(`✅ Connected to '${database}'.`);

    // 3. Ensure _migrations table exists (Recreate to be safe during dev)
    await connection.query("DROP TABLE IF EXISTS _migrations");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 4. Read migration files
    const migrationsDir = path.join(__dirname, "migrations");
    const files = fs.readdirSync(migrationsDir).sort(); // Sort alphabetically (001, 002...)

    // 5. Check which ones are already applied
    const [appliedRows] = await connection.query(
      "SELECT filename FROM _migrations",
    );
    const appliedFiles = new Set(appliedRows.map((r) => r.filename));

    // 6. Run pending migrations
    for (const file of files) {
      if (!file.endsWith(".sql")) continue;

      if (appliedFiles.has(file)) {
        console.log(`⏭️  Skipping already applied: ${file}`);
        continue;
      }

      console.log(`🚀 Applying: ${file}...`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");

      // Execute SQL (might have multiple statements)
      await connection.query(sql);

      // Record success
      await connection.query("INSERT INTO _migrations (filename) VALUES (?)", [
        file,
      ]);
      console.log(`✨ Success: ${file}`);
    }

    console.log("🎉 All migrations are up to date!");
  } catch (error) {
    console.error("❌ Migration Failed:", error);
    fs.writeFileSync("migration_error.log", JSON.stringify(error, null, 2));
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

migrate();
