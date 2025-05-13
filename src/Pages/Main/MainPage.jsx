import React from "react";
import { Button } from "../../components/Button";
import { Card, CardContent } from "../../components/Card";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/footer/Footer";
import "./Mp.css";
import { Link } from "react-router-dom";
import Spaghetti from "../../Images/spaghetti.jpg";
import CoctelCamaron from "../../Images/coctel-camaron.jpg";
import CarneAsada from "../../Images/carne-asada.jpg";

export default function MainPage() {
  const recipes = [
    { id: 1, title: "Pastas", image: Spaghetti, path: "/pastas" },
    { id: 2, title: "Mariscos", image: CoctelCamaron, path: "/mariscos" },
    { id: 3, title: "Carnes", image: CarneAsada, path: "/carnes" },
  ];

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="main-container">
        <main className="main-content">
          <h1 className="title">Categorias Disponibles</h1>
          <div className="recipes-grid">
            {recipes.map((recipe) => (
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
        </main>
      </div>
    </div>
  );
}
