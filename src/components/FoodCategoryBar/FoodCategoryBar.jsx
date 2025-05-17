import React, { useState } from 'react';
import './FoodCategoryBar.css';
import Pasta from '../../assets/Spaghetti.ico';
import Mariscos from '../../assets/ShrimpLobster.ico';
import Carne from '../../assets/Meat.ico';
import Postres from '../../assets/Dessert.ico';
import Sopas from '../../assets/Soup.ico';

const FoodCategoryBar = () => {
  const categories = [
    { id: 1, name: 'Pastas', imageUrl: Pasta },
    { id: 2, name: 'Mariscos', imageUrl: Mariscos },
    { id: 3, name: 'Carnes', imageUrl: Carne },
    { id: 4, name: 'Postres', imageUrl: Postres },
    { id: 5, name: 'Sopas', imageUrl: Sopas },
  ];

  const [selectedCategory, setSelectedCategory] = useState(1);

  return (
    <div className="categories-bar">
      <div className="categories-wrapper">
        {categories.map((category) => (
          <div
            key={category.id}
            className="category-item"
            onClick={() => setSelectedCategory(category.id)}
          >
            <div className={`category-icon ${selectedCategory === category.id ? 'active' : 'inactive'}`}>
              <img 
                src={category.imageUrl} 
                alt={category.name}
                className="category-image" 
              />
            </div>
            <span className="category-name">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodCategoryBar;