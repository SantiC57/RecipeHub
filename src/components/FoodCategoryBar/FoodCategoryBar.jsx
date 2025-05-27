import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './FoodCategoryBar.css';

import Pasta from '../../assets/Spaghetti.ico';
import Mariscos from '../../assets/ShrimpLobster.ico';
import Carne from '../../assets/Meat.ico';
import Postres from '../../assets/Dessert.ico';
import Sopas from '../../assets/Soup.ico';

const FoodCategoryBar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 👈 Para saber la ruta actual

  const categories = [
    { id: 1, name: 'Pastas', imageUrl: Pasta, route: '/pastas' },
    { id: 2, name: 'Mariscos', imageUrl: Mariscos, route: '/mariscos' },
    { id: 3, name: 'Carnes', imageUrl: Carne, route: '/carnes' },
    { id: 4, name: 'Postres', imageUrl: Postres, route: '/postres' },
    { id: 5, name: 'Sopas', imageUrl: Sopas, route: '/sopas' },
  ];

  const handleCategoryClick = (category) => {
    navigate(category.route); 
  };

  return (
    <div className="categories-bar">
      <div className="categories-wrapper">
        {categories.map((category) => {
          const isActive = location.pathname === category.route; // 
          return (
            <div
              key={category.id}
              className="category-item"
              onClick={() => handleCategoryClick(category)}
            >
              <div className={`category-icon ${isActive ? 'active' : 'inactive'}`}>
                <img src={category.imageUrl} alt={category.name} className="category-image" />
              </div>
              <span className="category-name">{category.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FoodCategoryBar;
