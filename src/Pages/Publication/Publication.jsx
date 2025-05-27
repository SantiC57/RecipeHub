import React, { useState, useEffect, useContext } from "react";
import { Footer } from "../../components/footer/Footer";
import "./publication.css";
import Upload from "/src/components/Upload/Upload";
import { useNavigate } from "react-router-dom";
import FoodService from "../../assets/Food Service.ico";
import { Navbar } from "../../components/Navbar/Navbar";
import api from "../../api/axiosConfig";
import Swal from "sweetalert2";
import { UserContext } from "../context/UserContext";

const Publication = ({ onSubmit, selectedRecipe }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [recipe, setRecipe] = useState({
    titulo: "",
    ingredientes: "",
    imagen: "",
    preparacion: "",
    tiempo: "",
    categoria: "",
    coccion: "",
    usuarioId: user?.id || null,
  });

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (selectedRecipe) {
      setRecipe(selectedRecipe);
    }
  }, [selectedRecipe]);

  useEffect(() => {
    setRecipe((prev) => ({
      ...prev,
      usuarioId: user?.id || null,
    }));
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe({ ...recipe, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleUploadFinish = (url) => {
    setRecipe({ ...recipe, imagen: url });
    setIsUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const {
        titulo,
        ingredientes,
        preparacion,
        tiempo,
        imagen,
        categoria,
        coccion,
        usuarioId,
      } = recipe;

      if (
        !titulo ||
        !ingredientes ||
        !preparacion ||
        !imagen ||
        !tiempo ||
        !categoria ||
        !coccion
      ) {
        Swal.fire("Por favor, completa todos los campos obligatorios.");
        return;
      }

      if (!usuarioId) {
        Swal.fire("Debes iniciar sesión para publicar una receta.");
        navigate("/login");
        return;
      }

      const recipeToSend = {
        titulo,
        ingredientes,
        preparacion,
        imagen,
        tiempo,
        categoria,
        coccion,
        usuarioId,
      };

      const response = await api.post("/recetas", recipeToSend);
      console.log("Receta guardada con éxito:", response.data);

      setRecipe({
        titulo: "",
        ingredientes: "",
        imagen: null,
        preparacion: "",
        tiempo: "",
        categoria: "",
        coccion: "",
        usuarioId: usuarioId,
      });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error al guardar receta:", error.response?.data || error.message);
      Swal.fire({
        title: `Error al guardar la receta: ${
          error.response?.data?.message || "Verifica los campos e intenta nuevamente"
        }`,
        icon: "error",
        draggable: true,
      });
    }
  };

  return (
    <>
      <div className="publication-navbar"></div>
      <Navbar />
      <section className="publication">
        <h2 className="publication-title">Publicar Nueva Receta</h2>

        <form className="publication-form" onSubmit={handleSubmit}>
          {/* resto de campos igual... */}

          <fieldset className="publication-recipe">
            <label htmlFor="titulo" className="publication-label">
              Título de la receta
            </label>
            <input
              type="text"
              id="titulo"
              className="publication-input"
              placeholder="Ej. Pastas Bolognesa"
              name="titulo"
              required
              value={recipe.titulo}
              onChange={handleChange}
            />
          </fieldset>

          {/* ... el resto igual */}

          <fieldset className="publication-recipe">
            <label htmlFor="upload" className="publication-label">
              Subir Foto
            </label>
            <Upload
              onUploadStart={() => setIsUploading(true)}
              onUploadFinish={handleUploadFinish}
            />
          </fieldset>

          {/* botones y demás */}
          <div className="publication-actions">
            <button
              type="button"
              className="publication-button publication-button--cancel"
              onClick={() => navigate("/")}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="publication-button publication-button--save"
              disabled={isUploading}
            >
              {isUploading ? "Subiendo imagen..." : "Publicar"}
            </button>
          </div>
        </form>

        {showSuccess && (
          <div className="xbox-achievement">
            <img src={FoodService} alt="icon" className="achievement-icon" />
            <div>
              <p className="achievement-title">¡Receta publicada!</p>
              <p className="achievement-subtitle">
                Tu receta se ha guardado con éxito
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
