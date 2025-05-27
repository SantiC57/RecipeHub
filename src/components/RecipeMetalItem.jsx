import React from 'react';
import { Clock, Users, Star, Tag } from 'lucide-react';

const RecipeMetaItem = ({ type, value }) => {
  const getIcon = () => {
    switch (type) {
      case 'time':
        return <Clock className="meta-icon clock-icon" />;
      case 'servings':
        return <Users className="meta-icon users-icon" />;
      case 'difficulty':
        return <Star className="meta-icon star-icon" />;
      case 'category':
        return <Tag className="meta-icon category-icon" />;
      default:
        return null;
    }
  };

  return (
    <div className="meta-item">
      {getIcon()}
      <span>{value}</span>
    </div>
  );
};

export default RecipeMetaItem;