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
import { SearchBar } from "../../components/SearchBar/SearchBar.jsx";

export default function MainPage() {
  const [recetasPublicadas, setRecetasPublicadas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false); // <--- NUEVO ESTADO: Para saber si ya se hizo una búsqueda

  const recetasFiltradas = recetasPublicadas.filter((receta) =>
    receta.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetch("https://pfv4sj6v-5000.use2.devtunnels.ms/api/recetas")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error HTTP! Estado: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setRecetasPublicadas(data))
      .catch((err) => console.error("Error al cargar recetas:", err));
  }, []);

  // Función para manejar la acción de búsqueda confirmada (ej. al presionar Enter)
  const handleSearchSubmit = () => {
    // Cuando el usuario presiona Enter, marcamos que se ha intentado una búsqueda.
    setHasSearched(true);
    // Nota: El filtro ya se aplica automáticamente por el `onChange` en el SearchBar.
    // Aquí podrías, opcionalmente, hacer un fetch si el filtro fuera solo al presionar Enter.
  };

  // Resetea 'hasSearched' cuando el searchTerm se vacía, para que el mensaje desaparezca.
  useEffect(() => {
    if (searchTerm === "") {
      setHasSearched(false);
    }
  }, [searchTerm]); // Se ejecuta cada vez que 'searchTerm' cambia


  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="FCB">
        {/* Este div está vacío, puedes agregar contenido de FoodCategoryBar aquí si es necesario */}
      </div>
      <div className="main-container">
        <main className="main-content">
          {/* Pasamos la nueva prop onSearchSubmit a SearchBar */}
          <SearchBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            onSearchSubmit={handleSearchSubmit} // <--- NUEVA PROP
          />

          <h1 className="title">Categorías Disponibles</h1>
          <FoodCategoryBar />

          <div className="parent">
            <img className="div1" src={Spaghetti} alt="Imagen de receta 1" />
            <div className="div2">Filtro</div>
            <img className="div3" src={Spaghetti} alt="Imagen de receta 2" />
            <img className="div4" src={Spaghetti} alt="Imagen de receta 3" />
            <img className="div5" src={Spaghetti} alt="Imagen de receta 4" />
            <img className="div6" src={Spaghetti} alt="Imagen de receta 5" />
            <img className="div7" src={Spaghetti} alt="Imagen de receta 6" />
            <img className="div8" src={Spaghetti} alt="Imagen de receta 7" />
          </div>

          <h1 className="title">Recetas Publicadas</h1>
          <div className="recipes-grid">
            {/* Lógica de renderizado condicional con el nuevo estado 'hasSearched' */}
            {recetasFiltradas.length > 0 ? (
              // Si hay recetas filtradas, las mostramos
              recetasFiltradas.map((receta) => (
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
              ))
            ) : (
              // Si no hay recetas filtradas Y el usuario ya intentó buscar (presionó Enter y el campo no está vacío)
              searchTerm !== "" && hasSearched && (
                <p className="no-recipes-message">
                  No se encontró ninguna receta que coincida con "{searchTerm}".
                </p>
              )
            )}
          </div>
        </main>
        <FloatingButton supportPageUrl="/support" />
      </div>
      <Footer />
    </div>
  );
}