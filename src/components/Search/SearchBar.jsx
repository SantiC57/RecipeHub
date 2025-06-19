import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchResults from "./SearchResults";
import "./SearchBar.css";

const SearchBar = ({
    searchTerm,
    onSearchChange,
    searchResults,
    isSearching,
    hasResults,
    getFirstResult
}) => {
    const navigate = useNavigate();
    const searchRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            const firstResult = getFirstResult();
            if (firstResult) {
                // Determinar el tipo y navegar apropiadamente
                if (firstResult.id) {
                    // Es una receta
                    navigate(`/recipes/${firstResult.id}`);
                } else if (typeof firstResult === 'string') {
                    // Es una categoría
                    navigate(`/${firstResult}`);
                }
                // Limpiar búsqueda después de navegar
                onSearchChange("");
            } else {
                // Si no hay resultados, mostrar mensaje
                console.log("No se encontraron resultados");
            }
        }

        // Escape para cerrar resultados
        if (e.key === "Escape") {
            onSearchChange("");
        }
    };

    // Cerrar resultados al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                onSearchChange("");
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onSearchChange]);

    return (
        <div className="search-container" ref={searchRef}>
            <div className="search-input-wrapper">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    viewBox="0 0 24 24"
                    className="search-icon"
                >
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                </svg>
                
                <input
                    type="text"
                    placeholder="Buscar recetas, categorías o usuarios..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    className="search-input"
                />
                
                {searchTerm && (
                    <button 
                        className="clear-search"
                        onClick={() => onSearchChange("")}
                        aria-label="Limpiar búsqueda"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                )}
            </div>

            {/* Resultados de búsqueda */}
            {searchTerm && isSearching && (
                <SearchResults
                    searchResults={searchResults}
                    onResultClick={() => onSearchChange("")}
                    hasResults={hasResults}
                />
            )}
        </div>
    );
};

export default SearchBar;