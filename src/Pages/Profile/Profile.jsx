import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar";
import { UserContext } from "../context/UserContext";
import "./Profile.css";

const ProfilePage = () => {
  const { user, logout, updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    profileImage: null
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [editingName, setEditingName] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        profileImage: user.profileImage || null
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (message.text) {
      setMessage({ type: "", text: "" });
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: "error", text: "La imagen debe ser menor a 5MB" });
        return;
      }

      if (!file.type.startsWith('image/')) {
        setMessage({ type: "error", text: "Por favor selecciona una imagen válida" });
        return;
      }

      setFormData({
        ...formData,
        profileImage: URL.createObjectURL(file),
      });
    }
  };

  const validateName = (name) => {
    if (!name.trim()) {
      return "El nombre es requerido";
    }
    if (name.trim().length < 2) {
      return "El nombre debe tener al menos 2 caracteres";
    }
    return null;
  };

  const validatePassword = (password) => {
    if (!password) {
      return "La contraseña es requerida";
    }
    if (password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres";
    }
    return null;
  };

  const handleUpdateName = async () => {
    const nameError = validateName(formData.name);
    if (nameError) {
      setMessage({ type: "error", text: nameError });
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (updateUser) {
        updateUser({ ...user, name: formData.name });
      }
      
      setMessage({ type: "success", text: "Nombre actualizado correctamente" });
      setEditingName(false);
    } catch (error) {
      setMessage({ type: "error", text: "Error al actualizar el nombre" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!formData.currentPassword) {
      setMessage({ type: "error", text: "Ingresa tu contraseña actual" });
      return;
    }

    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      setMessage({ type: "error", text: passwordError });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Las contraseñas no coinciden" });
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setMessage({ type: "error", text: "La nueva contraseña debe ser diferente a la actual" });
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMessage({ type: "success", text: "Contraseña actualizada correctamente" });
      setEditingPassword(false);
      
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    } catch (error) {
      setMessage({ type: "error", text: "Error al actualizar la contraseña. Verifica tu contraseña actual" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const cancelEdit = (field) => {
    if (field === 'name') {
      setEditingName(false);
      setFormData(prev => ({ ...prev, name: user.name || "" }));
    } else if (field === 'password') {
      setEditingPassword(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    }
    setMessage({ type: "", text: "" });
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
              <span>📷</span>
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

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="form-row">
          <div className="form-column">
            <div className="form-group">
              <label className="form-label">Nombre completo</label>
              <div className="input-with-actions">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={!editingName || loading}
                  placeholder="Ingresa tu nombre completo"
                />
                <div className="input-actions">
                  {!editingName ? (
                    <button
                      onClick={() => setEditingName(true)}
                      className="edit-button"
                      disabled={loading}
                    >
                      ✏️ Editar
                    </button>
                  ) : (
                    <div className="action-buttons">
                      <button
                        onClick={handleUpdateName}
                        className="save-button"
                        disabled={loading}
                      >
                        {loading ? "⏳" : "✅"} Guardar
                      </button>
                      <button
                        onClick={() => cancelEdit('name')}
                        className="cancel-button"
                        disabled={loading}
                      >
                        ❌ Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="form-column">
            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                className="form-input disabled"
                disabled
                title="El correo no se puede modificar"
              />
            </div>
          </div>
        </div>

        <div className="divider"></div>

        <div className="password-section">
          <h3 className="section-title">
            Cambiar contraseña
            {!editingPassword && (
              <button
                onClick={() => setEditingPassword(true)}
                className="edit-button-inline"
                disabled={loading}
              >
                ✏️ Editar contraseña
              </button>
            )}
          </h3>

          {editingPassword && (
            <div className="password-form">
              <div className="form-group">
                <label className="form-label">Contraseña actual</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Ingresa tu contraseña actual"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nueva contraseña</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Mínimo 6 caracteres"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirmar nueva contraseña</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Repite la nueva contraseña"
                  disabled={loading}
                />
              </div>

              <div className="password-actions">
                <button
                  onClick={handleUpdatePassword}
                  className="save-button"
                  disabled={loading}
                >
                  {loading ? "⏳ Actualizando..." : "✅ Actualizar contraseña"}
                </button>
                <button
                  onClick={() => cancelEdit('password')}
                  className="cancel-button"
                  disabled={loading}
                >
                  ❌ Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="divider"></div>

        <div className="logout-section">
          <button 
            onClick={handleLogout} 
            className="logout-button"
            disabled={loading}
          >
            🚪 Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
