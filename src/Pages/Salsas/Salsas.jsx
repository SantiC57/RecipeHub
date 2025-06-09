import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar";
import FoodCategoryBar from "../../components/FoodCategoryBar/FoodCategoryBar";

const Salsas = () => {
  const [recetasSalsas, setRecetasSalsas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        const res = await fetch("https://pfv4sj6v-5000.use2.devtunnels.ms/api/recetas");
        const data = await res.json();
        const salsas = data.filter((receta) =>
          receta.categoria.toLowerCase() === "salsas"
        );
        setRecetasSalsas(salsas);
      } catch (error) {
        console.error("Error al cargar las recetas de salsas:", error);
      }
    };

    fetchRecetas();
  }, []);

  return (
    <>
      <Navbar />
      <h1 className="titulo">Categorías Disponibles</h1>
      <FoodCategoryBar />

      <div className="categoria">
        <h2 className="categoria__titulo">Recetas de Salsas</h2>
        <div className="categoria__lista">
          {recetasSalsas.length === 0 ? (
            <p>No hay recetas de salsas disponibles.</p>
          ) : (
            recetasSalsas.map((receta) => (
              <div
                className="receta"
                key={receta.id}
                onClick={() => navigate(`/recipes/${receta.id}`)}
                style={{ cursor: "pointer" }}
              >
                <img src={receta.imagen} alt={receta.titulo} />
                <h3>{receta.titulo}</h3>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Salsas;
