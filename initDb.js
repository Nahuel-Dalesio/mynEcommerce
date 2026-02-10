import fs from "fs";
import pool from "./conexion.js";

async function initDb() {
  try {
    // Leer el archivo SQL completo
    const sql = fs.readFileSync("init.sql", "utf8");

    // Ejecutar el SQL
    await pool.query(sql);

    console.log("✅ Tablas creadas y datos insertados correctamente");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error ejecutando init.sql:", err);
    process.exit(1);
  }
}

initDb();
