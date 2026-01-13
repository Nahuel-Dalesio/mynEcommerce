import express from 'express';
import cors from 'cors';[]
import productosRoutes from './routes/productos.js';

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

app.use('/api/productos', productosRoutes);

app.listen(3001, () => {
  console.log(`Servidor corriendo en http://localhost:3001`);
});