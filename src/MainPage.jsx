import { useState } from "react";
import { Button } from "./components/Button";
import { Card, CardContent } from "./components/Card";
import { Navbar } from "./components/Navbar/Navbar";
import { Footer } from "./components/footer/Footer";
import "./components/Mp.css";

export default function MainPage() {
  const [content, setContent] = useState("Bienvenido a nuestra página");

  return (
    <div className="main-container">
      <Navbar />
      <main className="main-content">
        <Card className="card">
          <CardContent>
            <h1 className="title">Página Principal</h1>
            <p className="description">{content}</p>
            <div className="button-container">
              <Button onClick={() => setContent("Contenido actualizado!")}>Registrarse</Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
