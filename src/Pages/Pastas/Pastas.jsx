import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./pastas.css";
import { Navbar } from "../../components/Navbar/Navbar";
import FoodCategoryBar from "../../components/FoodCategoryBar/FoodCategoryBar";

const Pastas = () => {
  const [recetasPastas, setRecetasPastas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        const res = await fetch("https://crud-production-b855.up.railway.app/api/recetas");
        const data = await res.json();
        const pastas = data.filter((receta) => 
          receta.categoria.toLowerCase() === "pastas"
        );
        setRecetasPastas(pastas);
      } catch (error) {
        console.error("Error al cargar las recetas de pastas:", error);
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
        <h2 className="categoria__titulo">Recetas de Pastas</h2>
        <div className="categoria__lista">
          {recetasPastas.length === 0 ? (
            <p>No hay recetas de pastas disponibles.</p>
          ) : (
            recetasPastas.map((receta) => (
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

export default Pastas;
