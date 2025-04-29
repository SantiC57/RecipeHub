import React from "react";
import { Button } from "../../components/Button";
import { Card, CardContent } from "../../components/Card";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/footer/Footer";
import "./Mp.css";
import { useNavigate } from "react-router-dom";
import Spaghetti from "../../Images/spaghetti.jpg";
import Lasagna from "../../Images/lasaña.jpg";
import Carbonara from "../../Images/pasta-carbonara.jpg";
import Paella from "../../Images/paella.jpg";
import CoctelCamaron from "../../Images/coctel-camaron.jpg";
import ChupeCentolla from "../../Images/chupe-centolla.jpg";

export default function MainPage() {
  const navigate = useNavigate();

  // Datos para las recetas con imágenes asignadas
  const recipes = [
    { id: 1, title: "Spaghetti Bolognese", image: Spaghetti },
    { id: 2, title: "Lasagna Tradicional", image: Lasagna },
    { id: 3, title: "Pasta Carbonara", image: Carbonara },
    { id: 4, title: "Paella Valenciana", image: Paella },
    { id: 5, title: "Coctel de Camarones", image: CoctelCamaron },
    { id: 6, title: "Chupe de Centolla", image: ChupeCentolla },
    { id: 7, title: "Risotto de Champiñones", image: Spaghetti }, // Usando imagen de Spaghetti temporalmente
    { id: 8, title: "Tacos de Pescado", image: Carbonara }, // Usando imagen de Carbonara temporalmente
  ];

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="main-container">
        <main className="main-content">
          <h1 className="title">Recetas Disponibles</h1>
          <div className="recipes-grid">
            {recipes.map((recipe) => (
              <Card key={recipe.id} className="recipe-card">
                <CardContent>
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="recipe-image"
                  />
                  <h2 className="recipe-title">{recipe.title}</h2>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
