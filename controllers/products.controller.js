import { createProduct } from "../models/products.model.js";

export const create = async (req, res) => {
  try {
    const id = await createProduct(req.body);

    res.status(201).json({
      message: "Producto creado correctamente",
      id,
    });
  } catch (error) {
    console.error("ERROR REAL:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};
