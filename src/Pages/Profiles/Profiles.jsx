import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, UserPlus, UserCheck, Info } from "react-feather";
import { ChefHat } from "lucide-react";

// Components
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/footer/Footer";
import HeartIcon from "../../components/HearIcon/HeartIcon";
import RecipeTooltip from "../../components/RecipeCard/RecipeTooltip";

// Context
import { UserContext } from "../context/UserContext";
import { useFavorites } from "../context/FavoriteContext";

// Hooks
import { useRecipeDetails } from "../../hooks/useRecipeDetails";

// Utils
import { getAvatarUrl } from "../../lib/utils";
import api from "../../api/axiosConfig";

// Styles
import "./Profiles.css";

export default function Profiles() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const { toggleLike } = useFavorites();
    
    const [profileUser, setProfileUser] = useState(null);
    const [userRecipes, setUserRecipes] = useState([]);
    const [followStats, setFollowStats] = useState({
        followers: 0,
        following: 0,
        recipesCount: 0
    });
    const [activeTab, setActiveTab] = useState('recipes');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [checkingFollow, setCheckingFollow] = useState(false);

    const {
        hoveredRecipe,
        recipeDetails,
        loadingDetails,
        handleRecipeHover,
        handleRecipeLeave
    } = useRecipeDetails();

    // Cargar datos del perfil
    useEffect(() => {
        const fetchProfileData = async () => {
            console.log("=== PROFILES DEBUG ===");
            console.log("userId from params:", userId);
            console.log("typeof userId:", typeof userId);
            console.log("userId is truthy:", !!userId);
            console.log("userId === 'undefined':", userId === 'undefined');
            
            // Validación más estricta
            if (!userId || userId === 'undefined' || userId === 'null') {
                console.error("❌ Invalid userId:", userId);
                setError("ID de usuario inválido");
                setLoading(false);
                return;
            }
            
            // Validar que sea un número válido
            const numericUserId = parseInt(userId);
            if (isNaN(numericUserId) || numericUserId <= 0) {
                console.error("❌ Invalid numeric userId:", userId, "->", numericUserId);
                setError("ID de usuario debe ser un número válido");
                setLoading(false);
                return;
            }
            
            try {
                setLoading(true);
                setError(null);
                
                // 1. Cargar datos del usuario
                console.log(`🔄 Fetching user: /usuarios/${userId}`);
                const userResponse = await api.get(`/usuarios/${userId}`);
                console.log("✅ User response:", userResponse.data);
                
                if (!userResponse.data) {
                    throw new Error('Usuario no encontrado');
                }
                
                setProfileUser(userResponse.data);
                
                // 2. Cargar recetas del usuario (opcional)
                try {
                    console.log(`🔄 Fetching recipes: /usuarios/${userId}/recetas`);
                    const recipesResponse = await api.get(`/usuarios/${userId}/recetas`);
                    console.log("✅ Recipes response:", recipesResponse.data);
                    const sortedRecipes = Array.isArray(recipesResponse.data) 
                        ? recipesResponse.data.sort((a, b) => b.id - a.id)
                        : [];
                    setUserRecipes(sortedRecipes);
                    
                    // Actualizar conteo de recetas
                    setFollowStats(prev => ({
                        ...prev,
                        recipesCount: sortedRecipes.length
                    }));
                } catch (recipesError) {
                    console.log("⚠️ Error fetching recipes:", recipesError.response?.status, recipesError.message);
                    setUserRecipes([]);
                }
                
                // 3. Cargar estadísticas de seguimiento (opcional)
                try {
                    console.log(`🔄 Fetching stats: /usuarios/${userId}/stats`);
                    const statsResponse = await api.get(`/usuarios/${userId}/stats`);
                    console.log("✅ Stats response:", statsResponse.data);
                    
                    // Ajustar según la estructura real del backend
                    const statsData = statsResponse.data.stats || statsResponse.data;
                    setFollowStats(prev => ({
                        ...prev,
                        followers: statsData.seguidores || 0,
                        following: statsData.siguiendo || 0
                    }));
                } catch (statsError) {
                    console.log("⚠️ Error fetching stats:", statsError.response?.status, statsError.message);
                    // Mantener valores por defecto
                }
                
                // 4. Verificar si el usuario actual sigue a este perfil (opcional)
                if (user && user.id && user.id !== numericUserId) {
                    try {
                        console.log(`🔄 Checking follow: /usuarios/${user.id}/siguiendo/${userId}`);
                        setCheckingFollow(true);
                        const followResponse = await api.get(`/usuarios/${user.id}/siguiendo/${userId}`);
                        console.log("✅ Follow response:", followResponse.data);
                        setIsFollowing(followResponse.data.isFollowing || false);
                    } catch (followError) {
                        console.log("⚠️ Error checking follow status:", followError.response?.status, followError.message);
                        setIsFollowing(false);
                    } finally {
                        setCheckingFollow(false);
                    }
                }
                
            } catch (error) {
                console.error('❌ Error al cargar perfil:', error);
                console.error('❌ Error details:', error.response?.data);
                console.error('❌ Error status:', error.response?.status);
                
                if (error.response?.status === 404) {
                    setError('Usuario no encontrado');
                } else {
                    setError(error.response?.data?.message || error.message || 'Error al cargar el perfil');
                }
            } finally {
                setLoading(false);
                console.log("✅ Profile loading completed");
                console.log("=== END DEBUG ===");
            }
        };

        fetchProfileData();
    }, [userId, user?.id]);

    const handleFollowToggle = async () => {
        if (!user || !user.id || checkingFollow) return;
        
        try {
            setCheckingFollow(true);
            
            if (isFollowing) {
                // Dejar de seguir
                console.log(`🔄 Unfollowing: DELETE /usuarios/${user.id}/seguir/${userId}`);
                await api.delete(`/usuarios/${user.id}/seguir/${userId}`);
                setIsFollowing(false);
                setFollowStats(prev => ({
                    ...prev,
                    followers: Math.max(0, prev.followers - 1)
                }));
                console.log("✅ Unfollowed successfully");
            } else {
                // Seguir
                console.log(`🔄 Following: POST /usuarios/${user.id}/seguir`);
                await api.post(`/usuarios/${user.id}/seguir`, {
                    seguidoId: parseInt(userId)
                });
                setIsFollowing(true);
                setFollowStats(prev => ({
                    ...prev,
                    followers: prev.followers + 1
                }));
                console.log("✅ Followed successfully");
            }
        } catch (error) {
            console.error('❌ Error al seguir/dejar de seguir:', error);
            console.error('❌ Follow error details:', error.response?.data);
        } finally {
            setCheckingFollow(false);
        }
    };

    const handleUserClick = (clickedUserId) => {
        navigate(`/profiles/${clickedUserId}`);
    };

    // Estados de carga y error
    if (loading) {
        return (
            <>
                <Navbar />
                <div className="profiles-main">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Cargando perfil...</p>
                        <small style={{ color: '#9ca3af', marginTop: '0.5rem' }}>
                            ID: {userId}
                        </small>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="profiles-main">
                    <div className="error-container">
                        <h2>Error al cargar el perfil</h2>
                        <p>{error}</p>
                        <p><small>ID solicitado: {userId}</small></p>
                        <Link to="/" className="back-home-button">
                            Volver al inicio
                        </Link>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (!profileUser) {
        return (
            <>
                <Navbar />
                <div className="profiles-main">
                    <div className="error-container">
                        <h2>Usuario no encontrado</h2>
                        <p>El perfil que buscas no existe o ha sido eliminado.</p>
                        <Link to="/" className="back-home-button">
                            Volver al inicio
                        </Link>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <main className="profiles-main">
                
                <Link to="/" className="profiles-back__link">
                    <button className="profiles-back__button">
                        <ArrowLeft className="close-icon" />
                        Volver al inicio
                    </button>
                </Link>

                <section className="profiles-header">
                    <header className="profiles-header__info">
                        
                        <div className="profile-image-section">
                            <img
                                src={getAvatarUrl(profileUser)}
                                className="profile-header__image"
                                alt={profileUser.name || 'Usuario'}
                                onError={(e) => {
                                    e.target.src = getAvatarUrl({ name: 'Usuario' });
                                }}
                            />
                            {user && user.id && user.id !== parseInt(userId) && (
                                <div className="Follow">
                                    <button 
                                        className={`follow-button ${isFollowing ? 'following' : ''}`}
                                        onClick={handleFollowToggle}
                                        disabled={checkingFollow}
                                    >
                                        {checkingFollow ? (
                                            <div className="button-loading">
                                                <div className="mini-spinner"></div>
                                            </div>
                                        ) : (
                                            <>
                                                {isFollowing ? (
                                                    <>
                                                        <UserCheck size={16} />
                                                        Siguiendo
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserPlus size={16} />
                                                        Seguir
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="user-details">
                            <h1 className="profile-header__title">{profileUser.name || 'Usuario'}</h1>
                            
                            {profileUser.location && (
                                <div className="profile-header__location">
                                    <MapPin size={16} />
                                    <span>{profileUser.location}</span>
                                </div>
                            )}
                            
                            <p className="profile-header__description">
                                {profileUser.bio || `¡Hola! Soy ${profileUser.name || 'un usuario'}, apasionado de la cocina y me encanta compartir mis recetas favoritas. ¡Espero que disfrutes cocinando tanto como yo!`}
                            </p>
                            
                            <ul className="profile-header__stats">
                                <li>
                                    <strong>{followStats.recipesCount}</strong> 
                                    <span>Recetas</span>
                                </li>
                                <li>
                                    <strong>{followStats.followers}</strong> 
                                    <span>Seguidores</span>
                                </li>
                                <li>
                                    <strong>{followStats.following}</strong> 
                                    <span>Siguiendo</span>
                                </li>
                            </ul>
                            
                            <div className="user-tags">
                                {profileUser.specialties?.length > 0 ? (
                                    profileUser.specialties.map((specialty, index) => (
                                        <span key={index} className="user-tag">{specialty}</span>
                                    ))
                                ) : (
                                    <>
                                        <span className="user-tag">Cocina Casera</span>
                                        <span className="user-tag">Recetas Fáciles</span>
                                        <span className="user-tag">Comida Tradicional</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </header>
                </section>

                <nav className="tabs">
                    <button 
                        className={activeTab === 'recipes' ? 'tab-active' : 'tab'}
                        onClick={() => setActiveTab('recipes')}
                    >
                        <ChefHat size={18} />
                        Recetas
                    </button>
                    <button 
                        className={activeTab === 'about' ? 'tab-active' : 'tab'}
                        onClick={() => setActiveTab('about')}
                    >
                        <Info size={18} />
                        Acerca de
                    </button>
                </nav>

                {activeTab === 'recipes' && (
                    <section className="profiles-recipes">
                        {userRecipes.length > 0 ? (
                            userRecipes.map((recipe) => (
                                <div key={recipe.id} className="recipe-wrapper">
                                    <Link
                                        to={`/recipes/${recipe.id}`}
                                        className="recipe-card"
                                        onMouseEnter={() => handleRecipeHover(recipe.id)}
                                        onMouseLeave={handleRecipeLeave}
                                    >
                                        <div className="recipe-image-container">
                                            <img
                                                src={recipe.imagen}
                                                alt={recipe.titulo}
                                                className="recipe-image"
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.src = '/placeholder-recipe.jpg';
                                                }}
                                            />
                                            <div className="recipe-category-badge">
                                                {recipe.categoria}
                                            </div>
                                        </div>
                                        
                                        <div className="recipe-content">
                                            <h3 className="recipe-title">{recipe.titulo}</h3>
                                            {recipe.tiempo && (
                                                <div className="recipe-time">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <polyline points="12,6 12,12 16,14"/>
                                                    </svg>
                                                    <span>{recipe.tiempo}</span>
                                                </div>
                                            )}
                                            <p className="recipe-description">
                                                {recipe.descripcion || 'Una deliciosa receta que te encantará.'}
                                            </p>
                                        </div>
                                    </Link>
                                    
                                    {user && (
                                        <HeartIcon 
                                            recipeId={recipe.id} 
                                            recipe={recipe}
                                            className="recipe-heart"
                                        />
                                    )}
                                    
                                    {hoveredRecipe === recipe.id && (
                                        <RecipeTooltip 
                                            recipe={recipe}
                                            details={recipeDetails[recipe.id]}
                                            isLoading={loadingDetails[recipe.id]}
                                        />
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="recipe-placeholder">
                                <ChefHat size={48} color="#9ca3af" />
                                <h3>Sin recetas aún</h3>
                                <p>Este usuario aún no ha publicado ninguna receta.</p>
                            </div>
                        )}
                    </section>
                )}

                {activeTab === 'about' && (
                    <section className="profiles-about">
                        <div className="about-card">
                            <h2>Acerca de {profileUser.name || 'este usuario'}</h2>
                            <div className="about-content">
                                <p>
                                    {profileUser.bio || 
                                    `${profileUser.name || 'Este usuario'} es un apasionado cocinero que disfruta creando y compartiendo recetas deliciosas. Con ${followStats.recipesCount} recetas publicadas, demuestra su amor por la cocina y su compromiso con la comunidad culinaria.`}
                                </p>
                                
                                <div className="about-details">
                                    <div className="detail-item">
                                        <h4>🏠 Ubicación</h4>
                                        <p>{profileUser.location || 'No especificada'}</p>
                                    </div>
                                    
                                    <div className="detail-item">
                                        <h4>📅 Miembro desde</h4>
                                        <p>
                                            {profileUser.createdAt 
                                                ? new Date(profileUser.createdAt).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })
                                                : 'Fecha no disponible'
                                            }
                                        </p>
                                    </div>
                                    
                                    <div className="detail-item">
                                        <h4>👨‍🍳 Especialidades</h4>
                                        <div className="specialties-list">
                                            {profileUser.specialties?.length > 0 ? (
                                                profileUser.specialties.map((specialty, index) => (
                                                    <span key={index} className="specialty-tag">{specialty}</span>
                                                ))
                                            ) : (
                                                <p>Cocina variada y creativa</p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="detail-item">
                                        <h4>📊 Estadísticas</h4>
                                        <div className="stats-grid">
                                            <div className="stat-item">
                                                <span className="stat-number">{followStats.recipesCount}</span>
                                                <span className="stat-label">Recetas</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-number">{followStats.followers}</span>
                                                <span className="stat-label">Seguidores</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-number">{followStats.following}</span>
                                                <span className="stat-label">Siguiendo</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

            </main>
            <Footer />
        </>
    );
}