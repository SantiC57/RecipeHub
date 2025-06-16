import React, { useState, useEffect, useContext } from "react";
import { Footer } from "../../components/footer/Footer";
import "./publication.css";
import Upload from "/src/components/Upload/Upload";
import { useNavigate, useLocation } from "react-router-dom";
import FoodService from "../../assets/Food Service.ico";
import { Navbar } from "../../components/Navbar/Navbar";
import { UserContext } from "../context/UserContext";
import api from "../../api/axiosConfig";
import Swal from "sweetalert2";

const Publication = ({ onSubmit, selectedRecipe }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Detectar si es modo edición
  const isEditing = location.state?.isEditing || false;
  const recipeToEdit = location.state?.recipe || selectedRecipe;
  
  const [recipe, setRecipe] = useState({
    id: null,
    titulo: "",
    ingredientes: "",
    imagen: "",
    preparacion: "",
    tiempo: "",
    categoria: "",
    coccion: "",
    usuarioId: user?.id || null
  });

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (recipeToEdit && isEditing) {
      setRecipe({
        id: recipeToEdit.id,
        titulo: recipeToEdit.titulo || "",
        ingredientes: recipeToEdit.ingredientes || "",
        imagen: recipeToEdit.imagen || "",
        preparacion: recipeToEdit.preparacion || "",
        tiempo: recipeToEdit.tiempo || "",
        categoria: recipeToEdit.categoria || "",
        coccion: recipeToEdit.coccion || "",
        usuarioId: user?.id || recipeToEdit.usuarioId
      });
    } else if (!isEditing) {
      // Limpiar formulario para nueva receta
      setRecipe({
        id: null,
        titulo: "",
        ingredientes: "",
        imagen: "",
        preparacion: "",
        tiempo: "",
        categoria: "",
        coccion: "",
        usuarioId: user?.id || null
      });
    }
  }, [recipeToEdit, isEditing, user]);

  useEffect(() => {
    if (user && user.id) {
      setRecipe(prev => ({ ...prev, usuarioId: user.id }));
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!recipe.titulo.trim()) {
      newErrors.titulo = "El título es obligatorio";
    } else if (recipe.titulo.length < 3) {
      newErrors.titulo = "El título debe tener al menos 3 caracteres";
    }
    
    if (!recipe.categoria) {
      newErrors.categoria = "Selecciona una categoría";
    }
    
    if (!recipe.ingredientes.trim()) {
      newErrors.ingredientes = "Los ingredientes son obligatorios";
    }
    
    if (!recipe.preparacion.trim()) {
      newErrors.preparacion = "La preparación es obligatoria";
    }
    
    if (!recipe.tiempo) {
      newErrors.tiempo = "Selecciona el tiempo de preparación";
    }
    
    if (!recipe.imagen) {
      newErrors.imagen = "La imagen es obligatoria";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe({ ...recipe, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleUploadStart = () => {
    setIsUploading(true);
    if (errors.imagen) {
      setErrors({ ...errors, imagen: null });
    }
  };

  const handleUploadFinish = (url) => {
    setRecipe({ ...recipe, imagen: url });
    setIsUploading(false);
  };

  const handleUploadError = (error) => {
    setIsUploading(false);
    setErrors({ ...errors, imagen: "Error al subir la imagen. Intenta nuevamente." });
    console.error("Error de carga:", error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos obligatorios.",
        icon: "warning",
        confirmButtonColor: "var(--color-primary)"
      });
      return;
    }

    if (!user || !user.id) {
      Swal.fire({
        title: "Error de autenticación",
        text: "Debes iniciar sesión para publicar una receta.",
        icon: "error",
        confirmButtonColor: "var(--color-primary)"
      });
      navigate("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      const recipeToSend = {
        titulo: recipe.titulo.trim(),
        ingredientes: recipe.ingredientes.trim(),
        preparacion: recipe.preparacion.trim(),
        imagen: recipe.imagen,
        tiempo: recipe.tiempo,
        categoria: recipe.categoria,
        coccion: recipe.coccion || null,
        usuarioId: user.id
      };

      let response;
      let successMessage;

      if (isEditing && recipe.id) {
        // Actualizar receta existente
        response = await api.put(`/recetas/${recipe.id}`, recipeToSend);
        successMessage = "¡Receta actualizada exitosamente!";
        console.log("Receta actualizada:", response.data);
      } else {
        // Crear nueva receta
        response = await api.post('/recetas', recipeToSend);
        successMessage = "¡Receta publicada exitosamente!";
        console.log("Receta creada:", response.data);
      }

      // Limpiar formulario solo si no es edición
      if (!isEditing) {
        setRecipe({
          id: null,
          titulo: "",
          ingredientes: "",
          imagen: "",
          preparacion: "",
          tiempo: "",
          categoria: "",
          coccion: "",
          usuarioId: user.id
        });
      }

      // Notificar al componente padre
      if (onSubmit) {
        onSubmit();
      }

      // Mostrar éxito
      Swal.fire({
        title: "¡Éxito!",
        text: successMessage,
        icon: "success",
        confirmButtonColor: "var(--color-primary)",
        timer: 2000,
        showConfirmButton: false
      });

      // Redireccionar con el ID del usuario
      setTimeout(() => {
        navigate(`/myrecipes/${user.id}`);
      }, 2000);

    } catch (error) {
      console.error("Error al guardar receta:", error);
      
      let errorMessage = "Error al guardar la receta. Intenta nuevamente.";
      
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 400:
            errorMessage = data.message || "Datos de la receta inválidos.";
            break;
          case 401:
            errorMessage = "Tu sesión ha expirado. Inicia sesión nuevamente.";
            navigate("/login");
            break;
          case 403:
            errorMessage = "No tienes permisos para realizar esta acción.";
            break;
          case 404:
            errorMessage = isEditing ? "La receta no existe o fue eliminada." : "Recurso no encontrado.";
            break;
          case 413:
            errorMessage = "La imagen es demasiado grande. Sube una imagen más pequeña.";
            break;
          case 500:
            errorMessage = "Error del servidor. Intenta más tarde.";
            break;
          default:
            errorMessage = data.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage = "Sin conexión. Verifica tu internet.";
      }

      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "var(--color-primary)"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    const hasChanges = recipe.titulo || recipe.ingredientes || recipe.preparacion || 
                      (isEditing && JSON.stringify(recipe) !== JSON.stringify(recipeToEdit));
    
    if (hasChanges) {
      Swal.fire({
        title: "¿Descartar cambios?",
        text: "Se perderán los datos ingresados.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "var(--color-destacado)",
        cancelButtonColor: "var(--color-primary)",
        confirmButtonText: "Sí, descartar",
        cancelButtonText: "Seguir editando"
      }).then((result) => {
        if (result.isConfirmed) {
          // Redireccionar con el ID del usuario correcto
          if (user && user.id) {
            navigate(`/myrecipes/${user.id}`);
          } else {
            navigate("/");
          }
        }
      });
    } else {
      // Redireccionar con el ID del usuario correcto
      if (user && user.id) {
        navigate(`/myrecipes/${user.id}`);
      } else {
        navigate("/");
      }
    }
  };

  return (
    <>
      <div className="publication-navbar">
        <Navbar />
      </div>
      <section className="publication">
        <div className="publication-header">
          <h2 className="publication-title">
            {isEditing ? "Editar Receta" : "Crear Nueva Receta"}
          </h2>
          <p className="publication-subtitle">
            {isEditing 
              ? "Modifica los detalles de tu receta" 
              : "Comparte tu receta favorita con la comunidad"
            }
          </p>
        </div>

        <form className="publication-form" onSubmit={handleSubmit} noValidate>
          <div className="publication-row">
            <fieldset className="publication-recipe">
              <label htmlFor="titulo" className="publication-label">
                Título de la receta *
              </label>
              <input
                type="text"
                id="titulo"
                className={`publication-input ${errors.titulo ? 'publication-input--error' : ''}`}
                placeholder="Ej. Pasta Bolognesa Casera"
                name="titulo"
                value={recipe.titulo}
                onChange={handleChange}
                disabled={isSubmitting}
                maxLength="100"
              />
              {errors.titulo && <span className="publication-error">{errors.titulo}</span>}
            </fieldset>

            <fieldset className="publication-recipe">
              <label htmlFor="categoria" className="publication-label">
                Categoría *
              </label>
              <select
                id="categoria"
                className={`publication-input ${errors.categoria ? 'publication-input--error' : ''}`}
                name="categoria"
                value={recipe.categoria}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="">Selecciona una categoría</option>
                <option value="Pastas">Pastas</option>
                <option value="Carnes">Carnes</option>
                <option value="Mariscos">Mariscos</option>
                <option value="Sopas">Sopas</option>
                <option value="Ensaladas">Ensaladas</option>
                <option value="Postres">Postres</option>
                <option value="Salsas">Salsas</option>
              </select>
              {errors.categoria && <span className="publication-error">{errors.categoria}</span>}
            </fieldset>
          </div>

          <fieldset className="publication-recipe">
            <label htmlFor="ingredientes" className="publication-label">
              Ingredientes *
            </label>
            <textarea
              id="ingredientes"
              className={`publication-textarea ${errors.ingredientes ? 'publication-textarea--error' : ''}`}
              placeholder="Lista todos los ingredientes necesarios..."
              name="ingredientes"
              value={recipe.ingredientes}
              onChange={handleChange}
              disabled={isSubmitting}
              rows="4"
            ></textarea>
            {errors.ingredientes && <span className="publication-error">{errors.ingredientes}</span>}
          </fieldset>

          <fieldset className="publication-recipe">
            <label htmlFor="preparacion" className="publication-label">
              Preparación *
            </label>
            <textarea
              id="preparacion"
              className={`publication-textarea ${errors.preparacion ? 'publication-textarea--error' : ''}`}
              placeholder="Describe paso a paso cómo preparar la receta..."
              name="preparacion"
              value={recipe.preparacion}
              onChange={handleChange}
              disabled={isSubmitting}
              rows="6"
            ></textarea>
            {errors.preparacion && <span className="publication-error">{errors.preparacion}</span>}
          </fieldset>

          <fieldset className="publication-recipe">
            <label htmlFor="upload" className="publication-label">
              Foto de la receta *
            </label>
            {recipe.imagen && (
              <div className="current-image-preview">
                <img src={recipe.imagen} alt="Vista previa" className="image-preview" />
                <div className="image-preview-info">
                  <p className="image-preview-text">Imagen actual - Sube una nueva para reemplazarla</p>
                  <span className="image-preview-status">Imagen cargada</span>
                </div>
              </div>
            )}
            <Upload 
              onUploadStart={handleUploadStart}
              onUploadFinish={handleUploadFinish}
              onUploadError={handleUploadError}
              disabled={isSubmitting}
              currentImage={recipe.imagen}
            />
            {errors.imagen && <span className="publication-error">{errors.imagen}</span>}
          </fieldset>

          <div className="publication-row">
            <fieldset className="publication-recipe">
              <label htmlFor="tiempo" className="publication-label">
                Tiempo de Preparación *
              </label>
              <select 
                id="tiempo" 
                className={`publication-input ${errors.tiempo ? 'publication-input--error' : ''}`}
                name="tiempo" 
                value={recipe.tiempo} 
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="">Selecciona el tiempo</option>
                <option value="10 minutos">10 minutos</option>
                <option value="15 minutos">15 minutos</option>
                <option value="20 minutos">20 minutos</option>
                <option value="30 minutos">30 minutos</option>
                <option value="45 minutos">45 minutos</option>
                <option value="1 hora">1 hora</option>
                <option value="2 horas">2 horas</option>
                <option value="3 horas">3 horas</option>
              </select>
              {errors.tiempo && <span className="publication-error">{errors.tiempo}</span>}
            </fieldset>

            <fieldset className="publication-recipe">
              <label htmlFor="coccion" className="publication-label">
                Tiempo de Cocción (opcional)
              </label>
              <select 
                id="coccion" 
                className="publication-input"
                name="coccion" 
                value={recipe.coccion} 
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="">Selecciona el tiempo</option>
                <option value="5 minutos">5 minutos</option>
                <option value="10 minutos">10 minutos</option>
                <option value="15 minutos">15 minutos</option>
                <option value="20 minutos">20 minutos</option>
                <option value="30 minutos">30 minutos</option>
                <option value="45 minutos">45 minutos</option>
                <option value="1 hora">1 hora</option>
              </select>
            </fieldset>
          </div>

          <div className="publication-actions">
            <button
              type="button"
              className="publication-button publication-button--cancel"
              onClick={handleCancel}
              disabled={isSubmitting || isUploading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="publication-button publication-button--save"
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting 
                ? (isEditing ? "Actualizando..." : "Publicando...") 
                : isUploading 
                  ? "Subiendo imagen..." 
                  : (isEditing ? "Actualizar Receta" : "Publicar Receta")
              }
            </button>
          </div>
        </form>

        {showSuccess && (
          <div className="xbox-achievement">
            <img src={FoodService} alt="Icono de éxito" className="achievement-icon" />
            <div>
              <p className="achievement-title">
                {isEditing ? "¡Receta actualizada!" : "¡Receta publicada!"}
              </p>
              <p className="achievement-subtitle">
                {isEditing 
                  ? "Los cambios se han guardado exitosamente" 
                  : "Tu receta se ha guardado con éxito"
                }
              </p>
            </div>
          </div>
        )}
      </section>
      <Footer />
    </>
  );
};

export default Publication;