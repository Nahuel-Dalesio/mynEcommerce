import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

// Configuración de conexión a Render
const pool = new Pool({
  host: process.env.DB_HOST,       
  port: process.env.DB_PORT,       
  user: process.env.DB_USER,       
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME    
});

const createTables = async () => {
  try {
    // Aquí van tus tablas
    await pool.query(`
      -- Tabla de usuarios
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      -- Tabla de productos
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price NUMERIC NOT NULL,
        stock INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );

      -- Tabla de categorías
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL
      );

      -- Relación productos-categorías (muchos a muchos)
      CREATE TABLE IF NOT EXISTS product_categories (
        product_id INT REFERENCES products(id) ON DELETE CASCADE,
        category_id INT REFERENCES categories(id) ON DELETE CASCADE,
        PRIMARY KEY (product_id, category_id)
      );

      -- Tabla de pedidos
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE SET NULL,
        total NUMERIC NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      );

      -- Tabla de detalle de pedidos
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INT REFERENCES orders(id) ON DELETE CASCADE,
        product_id INT REFERENCES products(id),
        quantity INT NOT NULL,
        price NUMERIC NOT NULL
      );
    `);

    console.log('✅ Todas las tablas se crearon correctamente');

  } catch (err) {
    console.error('❌ Error creando tablas:', err);
    process.exit(1);
  }
};

export default createTables;
