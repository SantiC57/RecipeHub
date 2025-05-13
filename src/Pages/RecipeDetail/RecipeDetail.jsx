import React from "react";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/footer/Footer";
import "./RecipeDetail.css";
import Spaghetti from "../../Images/Spaghetti-Boloñesa.jpg";

export default function RecipeDetail() {
  const recipe = {
    title: "Espaguetis a la Boloñesa",
    image: Spaghetti, // Asegúrate de tener esta imagen en tu carpeta de assets
    description:
      "Clásica receta italiana de espaguetis con salsa boloñesa, elaborada con carne molida, tomate y hierbas aromáticas. Un plato delicioso y nutritivo, ideal para disfrutar en familia o con amigos.",
    prepTime: 20,
    cookTime: 30,
    servings: 4,
    difficulty: "Fácil",
    author: "John Doe",
    ingredients: [
      "400g de espaguetis",
      "300g de carne molida de res",
      "1 cebolla picada",
      "2 dientes de ajo",
      "400g de tomate triturado",
      "2 cucharadas de pasta de tomate",
      "1 zanahoria rallada",
      "1 hoja de laurel",
      "1 cucharadita de orégano seco",
      "Aceite de oliva virgen extra",
      "Sal y pimienta al gusto",
      "Queso parmesano rallado (opcional)",
      "Agua para cocer la pasta"
    ],
    steps: [
      "Cocina los espaguetis en agua con sal hirviendo según las instrucciones del paquete. Escúrrelos y reserva.",
      "Sofríe la cebolla y el ajo en una sartén con aceite de oliva hasta que estén dorados.",
      "Agrega la carne molida y cocina hasta que esté bien dorada.",
      "Añade la zanahoria rallada y cocina 2 minutos más.",
      "Incorpora el tomate triturado, la pasta de tomate, laurel, orégano, sal y pimienta. Cocina a fuego medio-bajo durante 20-25 minutos.",
      "Rectifica la sazón si es necesario.",
      "Sirve los espaguetis calientes con la salsa boloñesa por encima.",
      "Opcionalmente, espolvorea con queso parmesano rallado al gusto."
    ],
    tips: [
      "Usa carne molida magra para una opción más ligera.",
      "Puedes añadir un chorrito de vino tinto a la salsa para intensificar el sabor.",
      "Para una versión vegetariana, sustituye la carne por lentejas cocidas o carne vegetal."
    ],
    nutritionalInfo: {
      calories: 450,
      protein: 22,
      carbs: 60,
      fat: 14,
      fiber: 4
    }
  };

  return (
    <div className="recipe-page-wrapper">
      <Navbar />
      <div className="recipe-container">
        <div className="recipe-header">
          <h1 className="recipe-title">{recipe.title}</h1>
          <div className="recipe-meta">
            <div className="meta-item">
              <span className="meta-icon">⏱️</span>
              <span>Prep: {recipe.prepTime} min</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">🍳</span>
              <span>Cocción: {recipe.cookTime} min</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">👥</span>
              <span>Porciones: {recipe.servings}</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">📊</span>
              <span>Dificultad: {recipe.difficulty}</span>
            </div>
          </div>
        </div>

        <div className="recipe-content">
          <div className="recipe-image-container">
            <img src={recipe.image} alt={recipe.title} className="recipe-image" />
            <div className="recipe-author">Receta de: {recipe.author}</div>
          </div>

          <div className="recipe-description">
            <h2>Descripción</h2>
            <p>{recipe.description}</p>
          </div>

          <div className="recipe-main-content">
            <div className="ingredients-section">
              <h2>Ingredientes</h2>
              <ul className="ingredients-list">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div className="instructions-section">
              <h2>Preparación</h2>
              <ol className="instructions-list">
                {recipe.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </div>

          <div className="recipe-tips">
            <h2>Consejos</h2>
            <ul className="tips-list">
              {recipe.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>

          <div className="nutritional-info">
            <h2>Información Nutricional</h2>
            <div className="nutrition-grid">
              <div className="nutrition-item">
                <span className="nutrition-value">{recipe.nutritionalInfo.calories}</span>
                <span className="nutrition-label">Calorías</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-value">{recipe.nutritionalInfo.protein}g</span>
                <span className="nutrition-label">Proteínas</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-value">{recipe.nutritionalInfo.carbs}g</span>
                <span className="nutrition-label">Carbohidratos</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-value">{recipe.nutritionalInfo.fat}g</span>
                <span className="nutrition-label">Grasas</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-value">{recipe.nutritionalInfo.fiber}g</span>
                <span className="nutrition-label">Fibra</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
