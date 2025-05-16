import React, { useEffect, useState } from "react";;
import { Card, CardContent } from "../../components/Card/Card.jsx";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/footer/Footer";
import "./Mp.css";
import { Link } from "react-router-dom";
import Spaghetti from "../../assets/spaghetti.jpg";
import CoctelCamaron from "../../assets/coctel-camaron.jpg";
import CarneAsada from "../../assets/carne-asada.jpg";

export default function MainPage() {
  const categories = [
    { id: 1, title: "Pastas", image: Spaghetti, path: "/pastas" },
    { id: 2, title: "Mariscos", image: CoctelCamaron, path: "/mariscos" },
    { id: 3, title: "Carnes", image: CarneAsada, path: "/carnes" },
  ];

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
      <div className="main-container">
        <main className="main-content">
          <h1 className="title">Categorías Disponibles</h1>
          <div className="recipes-grid">
            {categories.map((recipe) => (
              <Card key={recipe.id} className="recipe-card">
                <Link to={recipe.path} className="recipe-link">
                  <CardContent>
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="recipe-image"
                    />
                    <h2 className="recipe-title">{recipe.title}</h2>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>

          <h1 className="title">Recetas Publicadas</h1>
          <div className="recipes-grid">
            {recetasPublicadas.map((receta) => (
              <Card key={receta.id} className="recipe-card">
                <Link to={`/receta/${receta.id}`} className="recipe-link">
                  <CardContent>
                    <img
                      src={receta.image}
                      alt={receta.title}
                      className="recipe-image"
                    />
                    <h2 className="recipe-title">{receta.title}</h2>
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
