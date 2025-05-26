import React from "react";
import { useNavigate } from "react-router-dom";
import PostreLimon from "../../assets/postre_limon.jpg";
import Flan from "../../assets/flan.jpg";
import PostreMaracuya from "../../assets/postre_maracuya.jpg";
import { Navbar } from "../../components/Navbar/Navbar";
import FoodCategoryBar from "../../components/FoodCategoryBar/FoodCategoryBar";

const Postres = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <h1 class="titulo" >Categorias Disponibles</h1>
      <FoodCategoryBar />
      <div className="categoria">
        <h2 className="categoria__titulo">Recetas de Postres</h2>
        <div className="categoria__lista">
          <div
            className="receta"
            onClick={() => navigate("/recipe/:id")}
            style={{ cursor: "pointer" }}
          >
            <img src={Flan} alt="Spaghetti" />
            <h3>Flan</h3>
          </div>
          <div className="receta">
            <img src={PostreLimon} alt="Lasaña" />
            <h3>Postre de Limon</h3>
          </div>
          <div className="receta">
            <img src={PostreMaracuya} alt="Pasta Carbonara" />
            <h3>Postre de Maracuya</h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default Postres;
