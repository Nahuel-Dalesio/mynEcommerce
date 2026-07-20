import express from "express";
import cors from "cors";
import path from "path";
import productosRoutes from "./routes/productos.js";
import { fileURLToPath } from "url";
import pedidosRoutes from "./routes/pedidos.js";
import dotenv from "dotenv";
import productsRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.routes.js";
import { iniciarCronPedidos } from "./jobs/pedidosCron.js";
import envioRoutes from "./routes/envio.js";
import adminEnvioRoutes from "./routes/adminEnvio.js";

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

TODO://Arreglar las rutas por productos o por products elegir una

// rutas API
app.use("/api/productos", productosRoutes);
app.use("/api/pedidos", pedidosRoutes);

app.use("/api/envios", envioRoutes);
app.use("/api/admin/envios", adminEnvioRoutes);

app.use("/api", productsRoutes);
app.use("/api", authRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto :${PORT}`);
  iniciarCronPedidos();
});