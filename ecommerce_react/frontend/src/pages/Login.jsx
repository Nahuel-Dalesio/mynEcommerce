import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token);
        Swal.fire("¡Bienvenido!", "Inicio de sesión exitoso.", "success");
        navigate("/admin/productos");
      } else {
        Swal.fire("Error", data.message || "Credenciales inválidas", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Error de conexión con el servidor", "error");
    }
  };

  return (
    <div className="login-container" style={{ padding: "100px 20px", display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: "400px", width: "100%", padding: "40px", border: "1px solid #ddd", borderRadius: "10px", backgroundColor: "#fff", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Acceso Administrador</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div>
            <label>Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ width: "100%", padding: "10px", margin: "5px 0", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ width: "100%", padding: "10px", margin: "5px 0", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>
          <button 
            type="submit" 
            style={{ padding: "12px", background: "#333", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px", marginTop: "10px" }}
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
