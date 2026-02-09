import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function seed() {
  try {
    // Ejemplo: productos
    await pool.query(`
      INSERT INTO products (name, price, image)
      VALUES
      ('Remera Nike', 15000, '/img/remera.jpg'),
      ('Zapatillas Adidas', 45000, '/img/zapa.jpg')
    `);

    console.log("✅ Datos cargados");

    process.exit();

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seed();