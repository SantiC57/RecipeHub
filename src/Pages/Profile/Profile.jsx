import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar";
import { UserContext } from "../context/UserContext"; // Ajusta la ruta
import "./Profile.css";

const ProfilePage = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null
  });

  // Cuando el componente carga, sincroniza el estado con el user del contexto
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        // Mantener password vacío por seguridad
      }));
      // Si tienes imagen de perfil en user, puedes asignarla aquí también
      // profileImage: user.profileImage || null,
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        profileImage: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleLogout = () => {
    logout(); // Usar función del contexto
    navigate("/"); // Redirigir a login al cerrar sesión
  };

  return (
    <div className="profile-container">
      <Navbar />

      <h2 className="profile-title">
        Configuración<br />de Perfil
      </h2>

      <div className="form-container">
        <div className="profile-section">
          {formData.profileImage ? (
            <img
              src={formData.profileImage}
              alt="Foto de perfil"
              className="profile-image"
            />
          ) : (
            <div className="profile-image-placeholder">
              <span>Foto</span>
            </div>
          )}
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            onChange={handleImageChange}
            className="image-input"
          />
          <label htmlFor="profileImage" className="upload-button">
            Cambiar foto
          </label>
        </div>

        <div className="form-row">
          <div className="form-column">
            <div className="form-group">
              <label className="form-label">Nombre completo</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-column">
            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                disabled // Opcional: si no quieres que cambie el email aquí
              />
            </div>
          </div>
        </div>

        <div className="divider"></div>

        <h3 className="section-title">Cambiar contraseña</h3>

        <div className="form-group">
          <label className="form-label">Nueva contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>

        {/* Botón para cerrar sesión */}
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <button onClick={handleLogout} className="logout-button">
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
