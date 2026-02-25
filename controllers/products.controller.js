import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../models/products.model.js";

// Helper for validating product data
const validateProduct = (data) => {
  const { nombre, precio, categoria } = data;
  if (!nombre || !precio || !categoria) {
    return "Los campos nombre, precio y categoría son obligatorios.";
  }
  return null;
};

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

    const id = await createProduct(req.body);

    res.status(201).json({
      message: "Producto creado correctamente",
      id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const error = validateProduct(req.body);
    if (error) return res.status(400).json({ message: error });

    const affectedRows = await updateProduct(req.params.id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const affectedRows = await deleteProduct(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
