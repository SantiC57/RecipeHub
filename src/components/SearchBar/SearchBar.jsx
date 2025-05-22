// src/components/SearchBar/SearchBar.jsx
import React from "react";

export function SearchBar({ searchTerm, setSearchTerm, onSearchSubmit }) { // Añadimos onSearchSubmit

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Previene el comportamiento por defecto (ej. recargar la página)
      if (onSearchSubmit) {
        onSearchSubmit(); // Llama a la función proporcionada por el padre
      }
    }
  };

  return (
    <input
      type="text"
      placeholder="Buscar recetas..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyDown={handleKeyDown} // Ya está aquí
      style={{
        padding: "0.5em 1em",
        borderRadius: "20px",
        border: "1px solid #ccc",
        width: "100%",
        maxWidth: "300px",
        marginBottom: "1.5em",
      }}
    />
  );
}