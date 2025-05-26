import React from "react";
import { useNavigate } from "react-router-dom";
import Spaghetti from "../../assets/Spaghetti-Boloñesa.jpg";
import Lasagna from "../../assets/lasaña.jpg";
import Carbonara from "../../assets/pasta-carbonara.jpg";
import { Navbar } from "../../components/Navbar/Navbar";

const Sopas = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="categoria">
        <h2 className="categoria__titulo">Recetas de Pastas</h2>
        <div className="categoria__lista">
          <div
            className="receta"
            onClick={() => navigate("/recipe/:id")}
            style={{ cursor: "pointer" }}
          >
            <img src={Spaghetti} alt="Spaghetti" />
            <h3>Spaghetti</h3>
          </div>
          <div className="receta">
            <img src={Lasagna} alt="Lasaña" />
            <h3>Lasaña</h3>
          </div>
          <div className="receta">
            <img src={Carbonara} alt="Pasta Carbonara" />
            <h3>Pasta Carbonara</h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sopas;
