import React, { useEffect, useState } from "react";;
import { Card, CardContent } from "../../components/Card/Card.jsx";
import  FoodCategoryBar  from "../../components/FoodCategoryBar/FoodCategoryBar";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/footer/Footer";
import "./Mp.css";
import { Link } from "react-router-dom";
import Spaghetti from "../../assets/spaghetti.jpg";
import CoctelCamaron from "../../assets/coctel-camaron.jpg";
import CarneAsada from "../../assets/carne-asada.jpg";

export default function MainPage() {

  const [recetasPublicadas, setRecetasPublicadas] = useState([]);

  useEffect(() => {
    fetch("https://pfv4sj6v-5000.use2.devtunnels.ms/api/recetas")
      .then((res) => res.json())
      .then((data) => setRecetasPublicadas(data))
      .catch((err) => console.error("Error al cargar recetas:", err));
  }, []);

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="FCB">
      </div>
      <div className="main-container">
        <main className="main-content">
          <h1 className="title">Categorías Disponibles</h1>
        <FoodCategoryBar />
        
      <div class="parent">
    <img class="div1" src= {Spaghetti} ></img>
    <div class="div2">Filtro</div>
    <img class="div3" src= {Spaghetti} ></img>
    <img class="div4" src= {Spaghetti} ></img>
    <img class="div5" src= {Spaghetti} ></img>
    <img class="div6" src= {Spaghetti} ></img>
    <img class="div7" src= {Spaghetti} ></img>
    <img class="div8" src= {Spaghetti} ></img>

</div>
    

          <h1 className="title">Recetas Publicadas</h1>
          <div className="recipes-grid">
            {recetasPublicadas.map((receta) => (
              <Card key={receta.id} className="recipe-card">
                <Link to={`/receta/${receta.id}`} className="recipe-link">
                  <CardContent>
                    <img
                      src={receta.imagen}
                      alt={receta.titulo}
                      className="recipe-image"
                    />
                    <h2 className="recipe-title">{receta.titulo}</h2>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
