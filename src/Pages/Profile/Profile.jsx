import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar";
import { UserContext } from "../context/UserContext";
import ViewAvatar from "../../components/ViewAvatar/ViewAvatar";
import { storage } from "../../api/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import api from "../../api/axiosConfig";
import "./Profile.css";

const ProfilePage = () => {
  const { user, logout, updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    avatar: ""
  });

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [editingName, setEditingName] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || ""
      }));
    }
  }, [user]);

  // Función para subir imagen a Firebase Storage
  const uploadToFirebase = async (file) => {
    try {
      setUploadingImage(true);
      setMessage({ type: "", text: "" });

      // Crear referencia única para la imagen
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      const storageRef = ref(storage, `usuarios/avatars/${fileName}`);

      // Subir archivo a Firebase Storage
      console.log('Subiendo imagen a Firebase...');
      const snapshot = await uploadBytes(storageRef, file);

      // Obtener URL de descarga
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('URL obtenida:', downloadURL);

      return downloadURL;
    } catch (error) {
      console.error('Error al subir imagen a Firebase:', error);
      throw new Error('Error al subir la imagen a Firebase Storage');
    } finally {
      setUploadingImage(false);
    }
  };

  // Función para actualizar avatar en la API
  const updateAvatarInAPI = async (avatarURL) => {
    try {
      console.log('Actualizando avatar en API...');
      const response = await api.put(`/usuarios/${user.id}`, {
        avatar: avatarURL
      });

      console.log('Avatar actualizado en API:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar avatar en API:', error);
      throw new Error('Error al guardar la imagen en el servidor');
    }
  };

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageChange(file);
    }
  };

  // Función principal para manejar el cambio de imagen
  const handleImageChange = async (file) => {
    if (!file) return;

    // Validaciones
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "La imagen debe ser menor a 5MB" });
      return;
    }

    if (!file.type.startsWith('image/')) {
      setMessage({ type: "error", text: "Por favor selecciona una imagen válida" });
      return;
    }

    try {
      setUploadingImage(true);
      setMessage({ type: "", text: "" });

      // Crear preview local mientras se sube
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // 1. Subir imagen a Firebase Storage
      console.log('Iniciando subida de imagen...');
      const firebaseURL = await uploadToFirebase(file);

      // 2. Actualizar avatar en la API
      await updateAvatarInAPI(firebaseURL);

      // 3. Actualizar estado local
      setFormData(prev => ({
        ...prev,
        avatar: firebaseURL
      }));

      // 4. Actualizar contexto de usuario
      if (updateUser) {
        updateUser({
          ...user,
          avatar: firebaseURL
        });
      }

      setMessage({
        type: "success",
        text: "Foto de perfil actualizada correctamente"
      });

      // Limpiar preview después de éxito
      setTimeout(() => {
        setPreview(null);
      }, 1000);

    } catch (error) {
      console.error('Error completo al actualizar avatar:', error);
      setMessage({
        type: "error",
        text: error.message || "Error al actualizar la foto de perfil"
      });

      // Limpiar preview en caso de error
      setPreview(null);
    } finally {
      setUploadingImage(false);
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
      // Actualizar nombre en la API
      await api.put(`/usuarios/${user.id}`, {
        name: formData.name
      });

      if (updateUser) {
        updateUser({ ...user, name: formData.name });
      }

      setMessage({ type: "success", text: "Nombre actualizado correctamente" });
      setEditingName(false);
    } catch (error) {
      console.error('Error al actualizar nombre:', error);
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
      // Actualizar contraseña en la API - ahora con currentPassword y newPassword
      await api.put(`/usuarios/${user.id}/change-password`, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      setMessage({ type: "success", text: "Contraseña actualizada correctamente" });
      setEditingPassword(false);

      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    } catch (error) {
      console.error('Error al actualizar contraseña:', error);

      // Manejo de errores más específico basado en la respuesta del servidor
      let errorMessage = "Error al actualizar la contraseña";

      if (error.response) {
        const status = error.response.status;
        const responseMessage = error.response.data?.message;

        if (status === 400) {
          errorMessage = responseMessage || "Datos inválidos";
        } else if (status === 401) {
          errorMessage = "La contraseña actual es incorrecta";
        } else if (status === 404) {
          errorMessage = "Usuario no encontrado";
        } else if (status === 500) {
          errorMessage = "Error interno del servidor";
        } else if (responseMessage) {
          errorMessage = responseMessage;
        }
      }

      setMessage({
        type: "error",
        text: errorMessage
      });
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
    <>
      <Navbar />
      <div className="profile-container">
        <h2 className="profile-title">Mi Perfil</h2>
        <p className="profile-subtitle">
          Aquí puedes actualizar tu información personal y cambiar tu contraseña.
        </p>

        <div className="form-container">
          <h3 className="section-title">Foto de perfil</h3>

          <div className="profile-section">

            <ViewAvatar
              src={preview || formData.avatar}
              placeholder={() => (
                <div className="profile-image-placeholder">
                  <span style={{ fontSize: 40 }}>📷</span>
                </div>
              )}
            />

            <input
              type="file"
              id="avatar"
              accept="image/*"
              onChange={handleFileChange}
              className="image-input"
              disabled={uploadingImage}
            />

            <label htmlFor="avatar" className="upload-button">
              {uploadingImage ? "🔄 Subiendo..." : "Cambiar foto"}
            </label>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <h3 className="section-title">Información Personal</h3>
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
                        Editar
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
                          Cancelar
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
                  Editar contraseña
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
                    Cancelar
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
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
