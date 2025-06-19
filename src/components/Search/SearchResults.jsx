import React from "react";
import { useNavigate } from "react-router-dom";
import { getAvatarUrl } from "../../lib/utils";

const SearchResults = ({ searchResults, onResultClick, hasResults }) => {
    const navigate = useNavigate();
    const { categorias, recetas, usuarios } = searchResults;

    const handleResultClick = (path) => {
        navigate(path);
        onResultClick();
    };

    // Si no hay resultados y se está buscando
    if (!hasResults) {
        return (
            <div className="search-results">
                <div className="no-results">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                    </svg>
                    <p>No se encontraron resultados</p>
                    <span>Intenta con otras palabras clave</span>
                </div>
            </div>
        );
    }

    return (
        <div className="search-results">
            {/* Recetas */}
            {recetas && recetas.length > 0 && (
                <div className="result-section">
                    <h4>Recetas</h4>
                    {recetas.map(recipe => (
                        <button
                            key={recipe.id}
                            className="result-item recipe-result"
                            onClick={() => handleResultClick(`/recipes/${recipe.id}`)}
                        >
                            <img
                                src={recipe.imagen}
                                alt={recipe.titulo}
                                className="result-image"
                                onError={(e) => {
                                    e.target.src = '/placeholder-recipe.jpg';
                                }}
                            />
                            <div className="result-content">
                                <span className="result-title">{recipe.titulo}</span>
                                <span className="result-category">en {recipe.categoria}</span>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Categorías */}
            {categorias && categorias.length > 0 && (
                <div className="result-section">
                    <h4>Categorías</h4>
                    {categorias.map((cat, index) => (
                        <button
                            key={index}
                            className="result-item category-result"
                            onClick={() => handleResultClick(`/${cat}`)}
                        >
                            <div className="category-icon">🍽️</div>
                            <div className="result-content">
                                <span className="result-title">
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </span>
                                <span className="result-category">Categoría</span>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Usuarios */}
            {usuarios && usuarios.length > 0 && (
                <div className="result-section">
                    <h4>Usuarios</h4>
                    {usuarios.map(user => (
                        <button
                            key={user.id}
                            className="result-item user-result"
                            onClick={() => handleResultClick(`/profile/${user.id}`)}
                        >
                            <img
                                src={getAvatarUrl(user)}
                                alt={user.name}
                                className="result-avatar"
                                onError={(e) => {
                                    e.target.src = getAvatarUrl({ name: 'Usuario' });
                                }}
                            />
                            <div className="result-content">
                                <span className="result-title">{user.name}</span>
                                <span className="result-category">Usuario</span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchResults;