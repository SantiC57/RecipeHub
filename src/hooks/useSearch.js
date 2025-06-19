import { slugify } from '../lib/utils';
import { useState, useEffect } from 'react';

export const useSearch = (recetas = [], categorias = [], usuarios = []) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState({
        recetas: [],
        categorias: [],
        usuarios: []
    });
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = (value) => {
        setSearchTerm(value);
        if (!value.trim()) {
            setIsSearching(false);
            setSearchResults({
                recetas: [],
                categorias: [],
                usuarios: []
            });
        }
    }

    const clearSearch = () => {
        setSearchTerm("");
        setSearchResults({
            recetas: [],
            categorias: [],
            usuarios: []
        });
        setIsSearching(false);
    }

    const hasResults = () => {
        return (
            searchResults.recetas.length > 0 ||
            searchResults.categorias.length > 0 ||
            searchResults.usuarios.length > 0
        );
    }

    const getFirstResult = () => {
        if (searchResults.recetas && searchResults.recetas.length > 0) {
            return searchResults.recetas[0];
        }

        if (searchResults.categorias && searchResults.categorias.length > 0) {
            return searchResults.categorias[0];
        }

        if (searchResults.usuarios && searchResults.usuarios.length > 0) {
            return searchResults.usuarios[0];
        }

        return null;
    }

    const performSearch = (term) => {
        if (!term.trim()) {
            clearSearch();
            return null;
        }
        setIsSearching(true);

        const searchLower = term.toLowerCase();
        
        const matchCategorias = categorias.filter(cat => 
            cat.toLowerCase().includes(searchLower)
        );
        
        const matchRecetas = recetas.filter(rec => 
            rec.titulo.toLowerCase().includes(searchLower) ||
            rec.categoria.toLowerCase().includes(searchLower)
        );
        
        const matchUsuarios = usuarios.filter(user => 
            user.name.toLowerCase().includes(searchLower)
        );

        setSearchResults({
            recetas: matchRecetas.slice(0, 5),
            usuarios: matchUsuarios.slice(0, 2),
            categorias: matchCategorias.slice(0, 3)
        });
    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            performSearch(searchTerm);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, recetas, categorias, usuarios]);

    return {
        searchTerm,
        setSearchTerm,
        searchResults,
        isSearching,
        handleSearch,
        clearSearch,
        hasResults: hasResults(),
        getFirstResult
    }
}
