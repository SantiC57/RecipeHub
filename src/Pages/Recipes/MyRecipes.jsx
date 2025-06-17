import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MyRecipes.css";
import { Navbar } from "../../components/Navbar/Navbar";
import { UserContext } from "../../Pages/context/UserContext";
import { Footer } from "../../components/footer/Footer";
import api from "../../api/axiosConfig.js";
import Swal from "sweetalert2";

const MyRecipes = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { user } = useContext(UserContext);
    const [userRecipes, setUserRecipes] = useState([]);
    const [loadingUserRecipes, setLoadingUserRecipes] = useState(false);
    const [deletingRecipeId, setDeletingRecipeId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserRecipes();
    }, [user]);

    const fetchUserRecipes = async () => {
        if (user && user.id) {
            setLoadingUserRecipes(true);
            try {
                const response = await api.get(`/usuarios/${user.id}/recetas`);
                const sortedUserRecipes = response.data.sort((a, b) => b.id - a.id);
                setUserRecipes(sortedUserRecipes);
            } catch (error) {
                console.error("Error al cargar recetas del usuario:", error);
                setUserRecipes([]);
                Swal.fire({
                    title: "Error",
                    text: "No se pudieron cargar tus recetas. Intenta recargar la página.",
                    icon: "error",
                    confirmButtonColor: "var(--color-primary)"
                });
            } finally {
                setLoadingUserRecipes(false);
            }
        }
    };

    const handleDeleteRecipe = async (recipeId, recipeTitle) => {
        const result = await Swal.fire({
            title: "¿Eliminar receta?",
            text: `¿Estás seguro de que deseas eliminar "${recipeTitle}"? Esta acción no se puede deshacer.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "var(--color-destacado)",
            cancelButtonColor: "var(--color-primary)",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            reverseButtons: true
        });

        if (result.isConfirmed) {
            setDeletingRecipeId(recipeId);
            try {
                await api.delete(`/recetas/${recipeId}`);
                
                // Actualizar el estado local removiendo la receta eliminada
                setUserRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== recipeId));
                
                Swal.fire({
                    title: "¡Eliminada!",
                    text: "Tu receta ha sido eliminada exitosamente.",
                    icon: "success",
                    confirmButtonColor: "var(--color-primary)",
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (error) {
                console.error("Error al eliminar receta:", error);
                let errorMessage = "Error al eliminar la receta. Intenta nuevamente.";
                
                if (error.response) {
                    switch (error.response.status) {
                        case 403:
                            errorMessage = "No tienes permisos para eliminar esta receta.";
                            break;
                        case 404:
                            errorMessage = "La receta no existe o ya fue eliminada.";
                            break;
                        case 500:
                            errorMessage = "Error del servidor. Intenta más tarde.";
                            break;
                        default:
                            errorMessage = error.response.data?.message || errorMessage;
                    }
                }
                
                Swal.fire({
                    title: "Error",
                    text: errorMessage,
                    icon: "error",
                    confirmButtonColor: "var(--color-primary)"
                });
            } finally {
                setDeletingRecipeId(null);
            }
        }
    };

    const handleEditRecipe = (recipe) => {
        // Navegar a la página de edición con los datos de la receta
        navigate("/publication", { 
            state: { 
                recipe: recipe,
                isEditing: true 
            } 
        });
    };

    // Filtrar recetas basado en el término de búsqueda
    const filteredRecipes = userRecipes.filter(recipe =>
        recipe.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // SVG Icons
    const ViewIcon = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
        </svg>
    );

    const EditIcon = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
    );

    const DeleteIcon = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3,6 5,6 21,6"/>
            <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1 2-2h4a2,2 0 0,1 2,2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/>
            <line x1="14" y1="11" x2="14" y2="17"/>
        </svg>
    );

    const LoadingSpinner = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="loading-spinner">
        </svg>
    );

    return (
        <>
            <main className="my-recipes">
            <Navbar />
                <header className="my-recipes__header">
                    <div className="my-recipes__header-content">
                        <div className="my-recipes__title-section">
                            <h1 className="my-recipes__title">Mis Recetas</h1>
                            <p className="my-recipes__description">
                                Organiza y gestiona todas tus recetas favoritas
                                {userRecipes.length > 0 && (
                                    <span className="recipes-count"> • {userRecipes.length} receta{userRecipes.length !== 1 ? 's' : ''}</span>
                                )}
                            </p>
                        </div>
                        
                        <div className="my-recipes__actions">
                            <form className="my-recipes__form" onSubmit={(e) => e.preventDefault()}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M21 21l-4.35-4.35M16.65 16.65a7.5 7.5 0 11-10.6-10.6 7.5 7.5 0 0110.6 10.6z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Buscar por título o categoría..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    autoComplete="off"
                                    className="my-recipes__search-input"
                                />
                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchTerm("")}
                                        className="search-clear-button"
                                        aria-label="Limpiar búsqueda"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="18" y1="6" x2="6" y2="18"/>
                                            <line x1="6" y1="6" x2="18" y2="18"/>
                                        </svg>
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>
                </header>

                <div className="my-recipes__content">
                    <section className="my-recipes__list">
                        {user && (
                            <>
                                {loadingUserRecipes ? (
                                    <article className="recipe-card recipe-card-loading">
                                        <div className="recipe-card__loading">
                                            <LoadingSpinner />
                                            <span>Cargando recetas...</span>
                                        </div>
                                    </article>
                                ) : filteredRecipes.length > 0 ? (
                                    filteredRecipes.map((recipe) => (
                                        <article key={recipe.id} className="recipes-card recipe-card-news">
                                            <figure className="recipe-cards__icon">
                                                <img
                                                    className="destacada-imagen"
                                                    src={recipe.imagen}
                                                    alt={recipe.titulo}
                                                    loading="lazy"
                                                />
                                                <div className="recipe-category-badge">
                                                    {recipe.categoria}
                                                </div>
                                            </figure>
                                            
                                            <div className="recipe-card__content">
                                                <h2 className="recipe-card__title">{recipe.titulo}</h2>
                                                
                                                <div className="recipe-card__meta">
                                                    <span className="recipe-meta-item">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <circle cx="12" cy="12" r="10"/>
                                                            <polyline points="12,6 12,12 16,14"/>
                                                        </svg>
                                                        {recipe.tiempo}
                                                    </span>
                                                    {recipe.coccion && (
                                                        <span className="recipe-meta-item">
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M6.13 1L6 16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V1"/>
                                                                <path d="M10 18v3"/>
                                                                <path d="M14 18v3"/>
                                                                <path d="M4 18h16"/>
                                                            </svg>
                                                            {recipe.coccion}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <nav className="recipe-card__buttons">
                                                <Link 
                                                    to={`/recipes/${recipe.id}`}
                                                    className="recipe-card__button recipe-card__button--view"
                                                    title="Ver receta"
                                                >
                                                    <ViewIcon />
                                                    <span>Ver</span>
                                                </Link>
                                                
                                                <button 
                                                    className="recipe-card__button recipe-card__button--edit"
                                                    onClick={() => handleEditRecipe(recipe)}
                                                    title="Editar receta"
                                                    disabled={deletingRecipeId === recipe.id}
                                                >
                                                    <EditIcon />
                                                    <span>Editar</span>
                                                </button>
                                                
                                                <button 
                                                    className="recipe-card__button recipe-card__button--delete"
                                                    onClick={() => handleDeleteRecipe(recipe.id, recipe.titulo)}
                                                    title="Eliminar receta"
                                                    disabled={deletingRecipeId === recipe.id}
                                                >
                                                    {deletingRecipeId === recipe.id ? (
                                                        <LoadingSpinner />
                                                    ) : (
                                                        <DeleteIcon />
                                                    )}
                                                    <span>Eliminar</span>
                                                </button>
                                            </nav>
                                        </article>
                                    ))
                                ) : (
                                    <article className="recipe-card recipe-card-empty">
                                        <div className="empty-state">
                                            <div className="empty-state__icon">
                                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                                                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                                                </svg>
                                            </div>
                                            <h3 className="empty-state__title">
                                                {searchTerm ? "No se encontraron recetas" : "No tienes recetas guardadas"}
                                            </h3>
                                            <p className="empty-state__description">
                                                {searchTerm 
                                                    ? "Intenta con otros términos de búsqueda" 
                                                    : "¡Comienza creando tu primera receta!"
                                                }
                                            </p>
                                            {!searchTerm && (
                                                <Link to="/publication" className="empty-state__button">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <line x1="12" y1="5" x2="12" y2="19"/>
                                                        <line x1="5" y1="12" x2="19" y2="12"/>
                                                    </svg>
                                                    Crear primera receta
                                                </Link>
                                            )}
                                        </div>
                                    </article>
                                )}
                            </>
                        )}
                    </section>
                </div>

                <Footer />
            </main>
        </>
    );
};

export default MyRecipes;