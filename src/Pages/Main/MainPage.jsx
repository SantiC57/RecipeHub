import { Button } from "../../components/Button";
import { Card, CardContent } from "../../components/Card";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/footer/Footer";
import "../../components/Mp.css";
import { useNavigate } from "react-router-dom";
import Spaghetti from "../../Images/spaghetti.jpg";
import Lasagna from "../../Images/lasaña.jpg";
import Carbonara from "../../Images/pasta-carbonara.jpg";
import Paella from "../../images/paella.jpg"; // Ruta corregida
import CoctelCamaron from "../../images/coctel-camaron.jpg"; // Ruta corregida
import ChupeCentolla from "../../images/chupe-centolla.jpg"; // Ruta corregida


export default function MainPage() {
  const navigate = useNavigate();

  // Datos de ejemplo para las recetas
  const recipes = [
    { id: 1, title: "Receta 1", image: "" },
    { id: 2, title: "Receta 2", image: "" },
    { id: 3, title: "Receta 3", image: "" },
    { id: 4, title: "Receta 4", image: "" },
    { id: 5, title: "Receta 5", image: "" },
  ];

  return (
    <>
      <Navbar />
      <div className="main-container">
        <main className="main-content">
          <h1 className="title">Recetas Disponibles</h1>
          <div className="recipes-grid">
            {recipes.map((recipe) => (
              <Card key={recipe.id} className="recipe-card">
                <CardContent>
                  <img
                    src={recipe.image || Carbonara || Paella}
                    alt={recipe.title}
                    className="recipe-image"
                  />
                  <h2 className="recipe-title">{recipe.title}</h2>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="button-container">
            <Button onClick={() => navigate("/signup")}>Registrarse</Button>
          </div>
        </main>
      </div>
    </>
  );
}