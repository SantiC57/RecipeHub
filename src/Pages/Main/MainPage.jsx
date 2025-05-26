import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../../components/Card/Card.jsx";
import FoodCategoryBar from "../../components/FoodCategoryBar/FoodCategoryBar";
import FloatingButton from "../../components/FloatingButton/FloatingButton.jsx";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/footer/Footer";
import "./Mp.css";
import { Link } from "react-router-dom";
import Spaghetti from "../../assets/spaghetti.jpg";
import CoctelCamaron from "../../assets/coctel-camaron.jpg";
import CarneAsada from "../../assets/carne-asada.jpg";

export default function MainPage() {
  const [recetasPublicadas, setRecetasPublicadas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Featured recipes data
  const featuredRecipe = {
    title: "Lasagna",
    image: Spaghetti,
    alt: "Receta destacada - Lasagna"
  };

  // Sample recipes for the grid
  const sampleRecipes = [
    { id: 1, title: "Spaghetti", image: Spaghetti, alt: "Spaghetti" },
    { id: 2, title: "Coctel Camaron", image: CoctelCamaron, alt: "Coctel Camaron" },
    { id: 3, title: "Carne Asada", image: CarneAsada, alt: "Carne Asada" },
    { id: 4, title: "Lasaña tradicional", image: Spaghetti, alt: "Lasaña tradicional" }
  ];

  const categories = ["Categoría 1", "Categoría 2"];

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
          <FoodCategoryBar />
          
          <div className="parent">
            {/* Filter Section */}
            <div className="div1">
              <input 
                type="text" 
                placeholder="🔍 Buscar..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <h3>Categorías</h3>
              {categories.map((category, index) => (
                <button key={index} className="category-button">
                  {category}
                </button>
              ))}
            </div>

            {/* Featured Recipe */}
            <div className="div2">
              <h3 className="destacada-titulo">Receta destacada</h3>
              <img 
                className="destacada-imagen" 
                src={featuredRecipe.image} 
                alt={featuredRecipe.alt} 
              />
              <div className="destacada-info">{featuredRecipe.title}</div>
            </div>

            {/* Sample Recipes Grid */}
            {sampleRecipes.map((receta, index) => (
              <div key={receta.id} className="receta">
                <img 
                  className="imagen-circular" 
                  src={receta.image} 
                  alt={receta.alt} 
                />
                <p>{receta.title}</p>
              </div>
            ))}
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
        
        <FloatingButton supportPageUrl="/support" />
      </div>
      
      <Footer />
    </div>
  );
}