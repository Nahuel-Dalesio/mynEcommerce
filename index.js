import express from "express";
import cors from "cors";
import path from "path";
import productosRoutes from "./routes/productos.js";
import { fileURLToPath } from "url";
import pedidosRoutes from "./routes/pedidos.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middlewares
app.use(cors());
app.use(express.json());

app.use(
  "/productos",
  express.static(path.join(__dirname, "../frontend/public/productos")),
);

// rutas API
app.use("/api/productos", productosRoutes);
app.use("/api/pedidos", pedidosRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto :${PORT}`);
});