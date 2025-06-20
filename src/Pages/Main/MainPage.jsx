import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

// Components
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/footer/Footer";
import SearchBar from "../../components/Search/SearchBar.jsx";
import FoodCategoryBar from "../../components/FoodCategoryBar/FoodCategoryBar";
import FloatingButton from "../../components/FloatingButton/FloatingButton.jsx";
import AuthModal from "../../components/Modal/AuthModal.jsx";
import RecipeCard from "../../components/RecipeCard/RecipeCard.jsx";
import RecipeTooltip from "../../components/RecipeCard/RecipeTooltip.jsx";
import HeartIcon from "../../components/HearIcon/HeartIcon.jsx";

// Hooks
import { useSearch } from "../../hooks/useSearch.js";
import { useRecipes } from "../../hooks/useRecipes.js";
import { useRecipeDetails } from "../../hooks/useRecipeDetails.js";

// Context
import { UserContext } from "../../Pages/context/UserContext"; 
import { useFavorites } from "../context/FavoriteContext";

// Styles
import "./Mp.css";

function MainPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { user } = useContext(UserContext);
  const { toggleLike, isLiked } = useFavorites();

  // Custom hooks
  const {
    recetasPublicadas,
    allUsers,
    allCategories,
    loadingUserRecipes,
    getLatestUserRecipe,
    getFeaturedRecipe,
    getRecentRecipes
  } = useRecipes(user);

  const {
    searchTerm,
    searchResults,
    isSearching,
    handleSearch,
    hasResults,
    getFirstResult
  } = useSearch(recetasPublicadas, allCategories, allUsers);

  const {
    hoveredRecipe,
    recipeDetails,
    loadingDetails,
    handleRecipeHover,
    handleRecipeLeave
  } = useRecipeDetails();


  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  const showAuthRequired = () => {
    setShowAuthModal(true);
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="main-container">
        <main className="main-content">
          <h1 className="title">Categorías Principales</h1>
          <FoodCategoryBar />

          <div className="content-grid">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={handleSearch}
              searchResults={searchResults}
              isSearching={isSearching}
              hasResults={hasResults}
              getFirstResult={getFirstResult}
            />

            <RecipeCard
              user={user}
              userRecipe={getLatestUserRecipe}
              featuredRecipe={getFeaturedRecipe}
              loadingUserRecipes={loadingUserRecipes}
              hoveredRecipe={hoveredRecipe}
              recipeDetails={recipeDetails}
              loadingDetails={loadingDetails}
              onRecipeHover={handleRecipeHover}
              onRecipeLeave={handleRecipeLeave}
              onAuthRequired={showAuthRequired}
            />
          </div>
          
          <div className="recent-section">
            {user ? (
              <> 
                <h2 className="recent-title">Otras Recetas Recientes</h2>
                <div className="recetas-grid">
                  {getRecentRecipes.length > 0 ? (
                    getRecentRecipes.slice(0, 7).map((receta) => (
                      <div key={receta.id} className="recipe-wrapper">
                        <Link
                          to={`/recipes/${receta.id}`}
                          className="receta"
                          onMouseEnter={() => handleRecipeHover(receta.id)}
                          onMouseLeave={handleRecipeLeave}
                        >
                          <img
                            className="imagen-circular"
                            src={receta.imagen}
                            alt={receta.titulo}
                            loading="lazy"
                          />
                          <p>{receta.titulo}</p>
                        </Link>
                        
                        <HeartIcon 
                          recipeId={receta.id} 
                          recipe={receta}
                          className="grid-heart" 
                          onAuthRequired={showAuthRequired}
                        />
                        
                        {hoveredRecipe === receta.id && (
                          <RecipeTooltip 
                            recipe={receta}
                            details={recipeDetails[receta.id]}
                            isLoading={loadingDetails[receta.id]}
                          />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="no-recipes-message">
                      <p>No hay más recetas disponibles</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <h2 className="recent-title">Recetas Recientes</h2>
                <div className="recetas-grid">
                  {getRecentRecipes.length > 0 ? (
                    getRecentRecipes.slice(1, 7).map((receta) => (
                      <div key={receta.id} className="recipe-wrapper">
                        <Link
                          to={`/recipes/${receta.id}`}
                          className="receta"
                          onMouseEnter={() => handleRecipeHover(receta.id)}
                          onMouseLeave={handleRecipeLeave}
                        >
                          <img
                            className="imagen-circular"
                            src={receta.imagen}
                            alt={receta.titulo}
                            loading="lazy"
                          />
                          <p>{receta.titulo}</p>
                        </Link>
                        
                        <HeartIcon 
                          recipeId={receta.id} 
                          recipe={receta}
                          className="grid-heart" 
                          onAuthRequired={showAuthRequired}
                        />
                        
                        {hoveredRecipe === receta.id && (
                          <RecipeTooltip 
                            recipe={receta}
                            details={recipeDetails[receta.id]}
                            isLoading={loadingDetails[receta.id]}
                          />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="no-recipes-message">
                      <p>No hay más recetas disponibles</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </main>

        <FloatingButton supportPageUrl="/support" />
      </div>

      <Footer />
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={closeAuthModal} 
      />
    </div>
  );
}

export default MainPage;