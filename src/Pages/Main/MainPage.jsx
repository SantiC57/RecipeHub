import { useState } from "react"; // <-- Puedes eliminar esta línea si no usas useState en otro lugar
import { Button } from "../../components/Button";
import { Card, CardContent } from "../../components/Card";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/footer/Footer";
import "../../components/Mp.css";
import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div className="main-container">
        <main className="main-content">
          <Card>
            <CardContent>
              <h1 className="title">Bienvenid@ a RecipeHub</h1>
              <p className="content">
                <Card>
                  <CardContent></CardContent>
                </Card></p> 
              <div className="button-container">
                <Button onClick={() => navigate("/signup")}>Registrarse</Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}