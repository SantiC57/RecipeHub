import React from "react";
import { useNavigate } from "react-router-dom";
import SopaPollo from "../../assets/sopa_pollo.jpg";
import SopaPescado from "../../assets/sopa_pescado.jpg";
import SopaGarbanzo from "../../assets/sopa_garbanzo.jpg";
import { Navbar } from "../../components/Navbar/Navbar";
import FoodCategoryBar from "../../components/FoodCategoryBar/FoodCategoryBar";

const Sopas = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <h1 class="titulo" >Categorias Disponibles</h1>
      <FoodCategoryBar />
      <div className="categoria">
        <h2 className="categoria__titulo">Recetas de Sopas</h2>
        <div className="categoria__lista">
          <div
            className="receta"
            onClick={() => navigate("/recipe/:id")}
            style={{ cursor: "pointer" }}
          >
            <img src={SopaPollo} alt="Sopa de Pollo" />
            <h3>Sopa de Pollo</h3>
          </div>
          <div className="receta">
            <img src={SopaPescado} alt="Sopa de Pescado" />
            <h3>Sopa de Pescado</h3>
          </div>
          <div className="receta">
            <img src={SopaGarbanzo} alt="Sopa de Garbanzo" />
            <h3>Sopa de Garbanzo</h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sopas;
