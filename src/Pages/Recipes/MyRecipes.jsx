import React, { useState, useEffect, useContext } from "react";
import "./MyRecipes.css";
import { Navbar } from "../../components/Navbar/Navbar";
import { UserContext } from "../../Pages/context/UserContext";
import { Footer } from "../../components/footer/Footer";
import api from "../../api/axiosConfig.js";

const MyRecipes = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { user } = useContext(UserContext);
    const [userRecipes, setUserRecipes] = useState([]);
    const [loadingUserRecipes, setLoadingUserRecipes] = useState(false);


    useEffect(() => {
        if (user && user.id) {
            setLoadingUserRecipes(true);
            fetch(`https://pfv4sj6v-5000.use2.devtunnels.ms/api/usuarios/${user.id}/recetas`)
                .then((res) => res.json())
                .then((data) => {
                    // Ordenar por fecha de creación o ID descendente para obtener la más reciente
                    const sortedUserRecipes = data.sort((a, b) => b.id - a.id);
                    setUserRecipes(sortedUserRecipes);
                })
                .catch((err) => {
                    console.error("Error al cargar recetas del usuario:", err);
                    setUserRecipes([]);
                })
                .finally(() => {
                    setLoadingUserRecipes(false);
                });
        }
    }, [user]);

    const latestUserRecipe = userRecipes.length > 0 ? userRecipes[0] : null;
    const filteredRecipes = userRecipes.filter(userRecipes =>
    userRecipes.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

    return (
        <>
            <main className="my-recipes">
                <Navbar />

                <header className="my-recipes__header">

                    <h1 className="my-recipes__title">Mis Recetas</h1>
                    <p className="my-recipes__description">Organiza y gestiona todas tus recetas favoritas</p>
                </header>
                <section className="my-recipes__actions">
                    <form action="" className="my-recipes__search">
                        <input
                            type="text"
                            placeholder="Buscar recetas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoComplete="off"
                            className="my-recipes__search-input" />
                    </form>
                </section>

                <section className="my-recipes__list">
                    {user && (
                        <>
                            {loadingUserRecipes ? (
                                <article className="recipe-card recipe-card-loading">
                                    <p className="recipe-card__loading">Cargando recetas...</p>
                                </article>
                            ) : latestUserRecipe ? (
                                <article className="recipe-card recipe-card-new">
                                    <figure className="recipe-card__icon">
                                         <img 
                                         className="destacada-imagen" 
                                         src={latestUserRecipe.imagen} 
                                         alt={latestUserRecipe.titulo} />
                                    </figure>
                                    <h2 className="recipe-card__title">{latestUserRecipe.titulo}</h2>
                                    <button className="recipe-card__button-edit">Editar</button>
                                    <button className="recipe-card__button-delete">Eliminar</button>
                                </article>
                            ):(
                                <article className="recipe-card recipe-card-empty">
                                    <p className="recipe-card__empty">No tienes recetas guardadas</p>
                                </article>
                            )}
                            
                        </>
                    )}
                    {filteredRecipes.length > 0 ? (
                        filteredRecipes.map((recipe) => (
                            <article key={recipe.id} recipe={recipe} className="recipe-card">
                                <figure className="recipe-card__icon">
                                    <img 
                                     className="destacada-imagen" 
                                     src={recipe.imagen} 
                                     alt={recipe.titulo} />
                                </figure>
                                <h2 className="recipe-card__title">{recipe.titulo}</h2>
                                <button className="recipe-card__button-edit">Editar</button>
                                <button className="recipe-card__button-delete">Eliminar</button>
                            </article>
                        ))
                    ) : (
                        <p className="recipe-card__empty">No tienes recetas guardadas</p>
                    )}

                </section>

                <footer><Footer /></footer>
            </main>
        </>
    )

}
export default MyRecipes;





