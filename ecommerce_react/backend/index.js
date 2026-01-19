import express from "express";
import cors from "cors";
import path from "path";
import productosRoutes from "./routes/productos.js";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middlewares
app.use(cors());
app.use(express.json());

app.use(
  "/productos",
  express.static(path.join(__dirname, "../public/productos"))
);

// rutas API
app.use("/api/productos", productosRoutes);

app.listen(3001, () => {
  console.log("Servidor corriendo en http://localhost:3001");
});
