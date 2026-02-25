import pool from "./conexion.js";

const updateDb = async () => {
  try {
    console.log("Actualizando base de datos...");

    // Añadir columna activo a producto si no existe
    await pool.query(`
      ALTER TABLE producto 
      ADD COLUMN IF NOT EXISTS activo TINYINT(1) DEFAULT 1
    `);
    console.log("Columna 'activo' verificada/añadida en 'producto'.");

    // Crear tabla usuario
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuario (
        idUsuario INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        rol ENUM('admin', 'user') NOT NULL DEFAULT 'user'
      )
    `);
    console.log("Tabla 'usuario' verificada/creada.");

    process.exit(0);
  } catch (error) {
    console.error("Error al actualizar la base de datos:", error);
    process.exit(1);
  }
};

updateDb();
