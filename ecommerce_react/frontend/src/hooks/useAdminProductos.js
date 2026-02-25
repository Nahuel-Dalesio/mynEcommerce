import { useState, useCallback, useContext } from "react";
import { BASE_URL } from "../config";
import { AuthContext } from "../context/AuthContext";

export function useAdminProductos() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/products`);
      if (!response.ok) throw new Error("Error fetching products");
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createItem = async (product) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/products`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(product),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error creating product");
      }
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id, product) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/products/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(product),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error updating product");
      }
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${token}`
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error deleting product");
      }
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, fetchItems, createItem, updateItem, deleteItem };
}
