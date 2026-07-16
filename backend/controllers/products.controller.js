import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  setProductActivo,
  getProductDetailById,
  getProductsByCategoria,
  getFeaturedProducts,
  getImagesByProducto,
  getCategoriasDisponibles,
  getCategoriasCompletas,
  createCategoria,
} from "../models/products.model.js";
import {
  createImagenProducto,
  deleteImagenesByProducto,
} from "../models/imagenesProducto.model.js";
import {
  upsertStockRow,
} from "../models/stock.model.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// backend/controllers -> subir 2 niveles a la raiz del repo -> frontend/public/productos
const CARPETA_IMAGENES = path.join(__dirname, "../../frontend/public/productos");
const EXTENSIONES_VALIDAS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

const validateProduct = (data) => {
  const { nombre, precio, idCategoria } = data;
  if (!nombre || !precio || !idCategoria) {
    return "Los campos nombre, precio y categoría son obligatorios.";
  }
  return null;
};

// --- CRUD Admin ---

export const getAll = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const error = validateProduct(req.body);
    if (error) return res.status(400).json({ message: error });
    const product = {
      ...req.body,
      precioOferta: req.body.precioOferta === "" ? null : req.body.precioOferta,
    };
    const idProducto = await createProduct(product);
    if (req.body.imagenes && req.body.imagenes.length > 0) {
      for (let i = 0; i < req.body.imagenes.length; i++) {
        await createImagenProducto({
          src: req.body.imagenes[i],
          esPrincipal: i === 0,
          idProducto,
        });
      }
    }
    if (req.body.stock && Array.isArray(req.body.stock)) {
      for (const item of req.body.stock) {
        await upsertStockRow({
          idProducto,
          talle: item.talle,
          stock: Number(item.stock) || 0,
        });
      }
    }
    res.status(201).json({
      message: "Producto creado correctamente",
      id: idProducto,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const error = validateProduct(req.body);
    if (error) return res.status(400).json({ message: error });
    await updateProduct(id, req.body);
    if (req.body.imagenes && Array.isArray(req.body.imagenes)) {
      await deleteImagenesByProducto(id);
      const imagenesValidas = req.body.imagenes.filter(
        (img) => img && img.trim() !== "",
      );
      for (let i = 0; i < imagenesValidas.length; i++) {
        await createImagenProducto({
          src: imagenesValidas[i],
          esPrincipal: i === 0,
          idProducto: id,
        });
      }
    }
    if (req.body.stock && Array.isArray(req.body.stock)) {
      for (const item of req.body.stock) {
        await upsertStockRow({
          idProducto: id,
          talle: item.talle,
          stock: Number(item.stock) || 0,
        });
      }
    }
    res.json({ message: "Producto e imágenes actualizados correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleActivo = async (req, res) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;
    const affectedRows = await setProductActivo(id, activo);
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json({ message: activo ? "Producto activado" : "Producto desactivado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Imágenes disponibles en el repo (admin) ---

export const getImagenesDisponibles = async (_req, res) => {
  try {
    if (!fs.existsSync(CARPETA_IMAGENES)) {
      return res.status(500).json({
        error: "No se encontró la carpeta de imágenes en el servidor",
        rutaEsperada: CARPETA_IMAGENES,
      });
    }

    const archivos = fs.readdirSync(CARPETA_IMAGENES);
    const imagenes = archivos
      .filter((archivo) =>
        EXTENSIONES_VALIDAS.includes(path.extname(archivo).toLowerCase()),
      )
      .map((archivo) => `/productos/${archivo}`);

    res.json(imagenes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Público ---

export const getFeatured = async (_req, res) => {
  try {
    const productos = await getFeaturedProducts();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error DB" });
  }
};

export const getByCategoria = async (req, res) => {
  try {
    const { categoria } = req.query;
    if (!categoria) return res.status(400).json({ error: "categoria es obligatoria" });
    const productos = await getProductsByCategoria(categoria);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error DB" });
  }
};

export const getDetalle = async (req, res) => {
  try {
    const { id } = req.params;
    const results = await getProductDetailById(id);
    if (results.length === 0) return res.status(404).json({ error: "Producto no encontrado" });

    const producto = {
      idProducto: results[0].idProducto,
      nombre: results[0].nombre,
      descripcion: results[0].descripcion,
      precio: results[0].precio,
      esDestacado: results[0].esDestacado,
      enOferta: results[0].enOferta,
      precioOferta: results[0].precioOferta,
      categoria: results[0].categoria,
      talles: results.map((row) => ({
        idProductoTalle: row.idProductoStock,
        talle: row.talle,
        stock: row.stock,
      })),
      imagenes: await getImagesByProducto(id),
    };

    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: "Error DB" });
  }
};

export const getImagenes = async (req, res) => {
  try {
    const imagenes = await getImagesByProducto(req.params.idProducto);
    res.json(imagenes);
  } catch (error) {
    res.status(500).json({ error: "Error DB" });
  }
};

export const getCategorias = async (_req, res) => {
  try {
    res.json(await getCategoriasDisponibles());
  } catch (error) {
    res.status(500).json({ error: "Error DB" });
  }
};

export const getCategoriasAdmin = async (_req, res) => {
  try {
    res.json(await getCategoriasCompletas());
  } catch (error) {
    res.status(500).json({ error: "Error DB" });
  }
};

export const postCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre?.trim()) return res.status(400).json({ error: "El nombre de categoría es obligatorio" });
    const idCategoria = await createCategoria(nombre.trim());
    res.status(201).json({ idCategoria, nombre: nombre.trim() });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") return res.status(400).json({ error: "Esa categoría ya existe" });
    res.status(500).json({ error: "Error DB" });
  }
};