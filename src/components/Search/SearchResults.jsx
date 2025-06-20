import React from "react";
import { useNavigate } from "react-router-dom";
import { getAvatarUrl } from "../../lib/utils";

const SearchResults = ({ searchResults, onResultClick, hasResults }) => {
    const navigate = useNavigate();
    
    // Verificar que searchResults existe y tiene la estructura correcta
    if (!searchResults) {
        return null;
    }
    
    const { categorias, recetas, usuarios } = searchResults;

    const handleResultClick = (path) => {
        console.log("🔄 SearchResults: Navigating to:", path);
        navigate(path);
        onResultClick?.(); // Usar optional chaining
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

            {/* Usuarios - ARREGLADO */}
            {usuarios && usuarios.length > 0 && (
                <div className="result-section">
                    <h4>Usuarios</h4>
                    {usuarios.map(user => {
                        console.log("🔍 SearchResults: Processing user:", user);
                        
                        // Detectar diferentes campos de ID que puede tener el usuario
                        const userId = user.id || user.user_id || user.usuario_id || user.userId;
                        const userName = user.name || user.nombre || user.username || 'Usuario';
                        
                        console.log("🔍 SearchResults: Extracted userId:", userId, "userName:", userName);
                        
                        if (!userId) {
                            console.warn("⚠️ SearchResults: Usuario sin ID válido:", user);
                            return null;
                        }

                        return (
                            <button
                                key={userId}
                                className="result-item user-result"
                                onClick={() => {
                                    console.log("👤 SearchResults: Clicking user with ID:", userId);
                                    handleResultClick(`/profiles/${userId}`);
                                }}
                            >
                                <img
                                    src={getAvatarUrl(user)}
                                    alt={userName}
                                    className="result-avatar"
                                    onError={(e) => {
                                        e.target.src = getAvatarUrl({ name: 'Usuario' });
                                    }}
                                />
                                <div className="result-content">
                                    <span className="result-title">{userName}</span>
                                    <span className="result-category">Usuario (ID: {userId})</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SearchResults;