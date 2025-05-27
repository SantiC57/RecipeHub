import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/footer/Footer";
import api from "../../api/axiosConfig"; // Tu instancia de axios
import "./RecipeDetail.css";

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { data } = await api.get(`/recetas/${id}`);

        // Aquí convertimos los strings en arrays, si vienen como strings
const ingredientes = typeof data.ingredientes === "string"
  ? data.ingredientes.split(/\n|;|,/).map(i => i.trim()).filter(i => i.length > 0)
  : Array.isArray(data.ingredientes)
  ? data.ingredientes
  : [];


        // Supongo que preparacion viene como texto separado por puntos o saltos de línea
        // Ajusta según el formato exacto de tu string
        const preparacion = typeof data.preparacion === "string"
          ? data.preparacion.split(/\.|\n/).map(p => p.trim()).filter(p => p.length > 0)
          : Array.isArray(data.preparacion)
          ? data.preparacion
          : [];

        setRecipe({
          ...data,
          ingredientes,
          preparacion
        });
      } catch (err) {
        setError("No se pudo cargar la receta.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <p>Cargando receta...</p>;
  if (error) return <p>{error}</p>;
  if (!recipe) return <p>Receta no encontrada</p>;

  return (
    <div className="recipe-page-wrapper">
      <Navbar />
      <div className="recipe-container">
        <div className="recipe-header">
          <h1 className="recipe-title">{recipe.titulo}</h1>
          <div className="recipe-meta">
            <div className="meta-item"><span>⏱️</span> Prep: {recipe.tiempo}</div>
            <div className="meta-item"><span>🍳</span> Cocción: {recipe.coccion}</div>
            <div className="meta-item"><span>🏷️</span> Categoría: {recipe.categoria}</div>
          </div>
        </div>

        <div className="recipe-content">
          <div className="recipe-image-container">
            <img src={recipe.imagen} alt={recipe.titulo} className="recipe-image" />
          </div>

          <div className="recipe-main-content">
            <div className="ingredients-section">
              <h2>Ingredientes</h2>
              <ul>
                {recipe.ingredientes.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>

            <div className="instructions-section">
              <h2>Preparación</h2>
              <ol>
                {recipe.preparacion.map((paso, i) => (
                  <li key={i}>{paso}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
