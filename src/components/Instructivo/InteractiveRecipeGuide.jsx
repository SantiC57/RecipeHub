import { useState, useEffect } from 'react';
import { ChefHat, Clock, Users, Star, CheckCircle, Loader2, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RecipeMetaItem from '../RecipeMetalItem';
import Navigation from '../Navigation';
import './InteractiveRecipeGuide.css';

const InteractiveRecipeGuide = ({ recipeId, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const handleCloseRecipe = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/');
    }
  };

  const transformRecipeData = (backendRecipe) => {
    const ingredientsList = backendRecipe.ingredientes.split('\n').filter(item => item.trim());
    
    const preparationSteps = backendRecipe.preparacion.split('\n').filter(step => step.trim());
    
    const steps = preparationSteps.map((step, index) => ({
      id: index + 1,
      title: `Paso ${index + 1}: ${generateStepTitle(step, index)}`,
      content: addPersonalityToStep(step),
      tip: generateTip(step, index),
      visual: getStepEmoji(step, index, backendRecipe.categoria),
      color: getStepColor(index),
      ...(index === 0 && { ingredients: ingredientsList })
    }));

    return {
      title: `✨ ${backendRecipe.titulo}`,
      description: generateDescription(backendRecipe.titulo, backendRecipe.categoria),
      cookTime: backendRecipe.tiempo || "15 min",
      servings: backendRecipe.porciones || "2-4 personas",
      difficulty: getDifficulty(preparationSteps.length),
      image: backendRecipe.imagen,
      category: backendRecipe.categoria,
      steps: steps
    };
  };

  const generateStepTitle = (step, index) => {
    const keywords = {
      'corta': '¡A cortar como un chef!',
      'mezcla': '¡Mezclando sabores!',
      'cocina': '¡Fuego en la cocina!',
      'hierve': '¡Agua burbujeante!',
      'sazona': '¡El toque mágico!',
      'sirve': '¡Momento de brillar!'
    };
    
    for (const [key, title] of Object.entries(keywords)) {
      if (step.toLowerCase().includes(key)) return title;
    }
    
    return index === 0 ? '¡Preparemos todo!' : `¡Vamos paso ${index + 1}!`;
  };

  const addPersonalityToStep = (step) => {
    const personalities = [
      'Como un verdadero chef profesional: ',
      '¡Aquí viene lo divertido! ',
      'Con mucho amor y cariño: ',
      'El momento que estabas esperando: ',
      '¡Dale que ya casi terminamos! '
    ];
    
    const randomPersonality = personalities[Math.floor(Math.random() * personalities.length)];
    return randomPersonality + step;
  };

  const generateTip = (step, index) => {
    const tips = [
      '💡 Tip de chef: La organización es clave para el éxito',
      '🔥 Recuerda: fuego medio para mejores resultados',
      '⏰ La paciencia es el ingrediente secreto',
      '👨‍🍳 Un chef siempre prueba mientras cocina',
      '✨ ¡El amor se siente en cada bocado!',
      '🎯 La presentación también entra por los ojos'
    ];
    
    return tips[index % tips.length];
  };

  const getStepEmoji = (step, index, category) => {
    const categoryEmojis = {
      'ensaladas': ['🥗', '🍅', '🧄', '🫒', '🌿', '✨'],
      'pasta': ['🍝', '🧄', '🧀', '🍅', '🌿', '✨'],
      'carnes': ['🥩', '🔥', '🧄', '🌿', '🍷', '✨'],
      'postres': ['🍰', '🍓', '🍫', '🥛', '🍯', '✨'],
      'sopas': ['🍲', '🥕', '🌿', '🧄', '🔥', '✨']
    };
    
    const emojis = categoryEmojis[category] || ['👨‍🍳', '🔪', '🍳', '🌿', '🔥', '✨'];
    return emojis[index % emojis.length];
  };

  const getStepColor = (index) => {
    const colors = [
      'step-color-1',
      'step-color-2', 
      'step-color-3',
      'step-color-4',
      'step-color-5',
      'step-color-6'
    ];
    
    return colors[index % colors.length];
  };

  const generateDescription = (title, category) => {
    const descriptions = {
      'ensaladas': `¡Prepárate para crear la ${title.toLowerCase()} más fresca y deliciosa!`,
      'pasta': `¡Vamos a hacer una ${title.toLowerCase()} que te hará viajar a Italia!`,
      'carnes': `¡Esta ${title.toLowerCase()} será el plato estrella de tu mesa!`,
      'postres': `¡Dulce tentación! Tu ${title.toLowerCase()} perfecta te espera!`,
      'sopas': `¡Comfort food al máximo! Esta ${title.toLowerCase()} te va a encantar!`
    };
    
    return descriptions[category] || `¡Prepárate para cocinar algo increíble!`;
  };

  const getDifficulty = (stepsCount) => {
    if (stepsCount <= 3) return 'Súper Fácil';
    if (stepsCount <= 5) return 'Fácil';
    if (stepsCount <= 7) return 'Intermedio';
    return 'Chef Level';
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!recipeId) {
        setError('Se requiere un ID de receta para mostrar el instructivo');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`https://crud-production-b855.up.railway.app/api/recetas/${recipeId}`);
        
        if (!response.ok) {
          throw new Error('Error al cargar la receta');
        }
        
        const backendRecipe = await response.json();
        const transformedRecipe = transformRecipeData(backendRecipe);
        setRecipe(transformedRecipe);
        
      } catch (err) {
        setError(err.message);
        console.error('Error fetching recipe:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  const getExampleRecipe = () => ({
    title: "🥗 Ensalada Caprese Mágica",
    description: "¡Prepárate para crear la ensalada caprese más fresca y deliciosa!",
    cookTime: "10 min",
    servings: "2-4 personas", 
    difficulty: "Súper Fácil",
    image: "https://firebasestorage.googleapis.com/v0/b/recipehub-97175.firebasestorage.app/o/recetas%2F1747436200795-ensalada-caprese-tomates-maduros-queso-mozzarella-hojas-albahaca-fresca-166116-3714.jpg?alt=media&token=d3d60d92-f913-44d0-a85d-bac8be10b6e4",
    steps: [
      {
        id: 1,
        title: "¡Preparemos los ingredientes frescos!",
        content: "Como un verdadero chef profesional: Reúne todos los ingredientes y lávalos con cariño. ¡La frescura es la clave de una caprese perfecta!",
        ingredients: [
          "2 tomates grandes y maduros",
          "250g de queso mozzarella fresco (en rodajas)", 
          "Hojas frescas de albahaca",
          "Aceite de oliva extra virgen",
          "Sal y pimienta negra recién molida al gusto"
        ],
        tip: "💡 Tip de chef: Elige tomates bien maduros y mozzarella fresca del día",
        visual: "🥗",
        color: "step-color-4"
      },
      {
        id: 2, 
        title: "¡A cortar como un chef!",
        content: "¡Aquí viene lo divertido! Lava y corta los tomates en rodajas de aproximadamente 1 cm de grosor. La uniformidad es tu mejor amiga aquí.",
        tip: "🔪 Usa un cuchillo bien afilado para cortes perfectos",
        visual: "🍅",
        color: "step-color-3"
      },
      {
        id: 3,
        title: "¡Mozzarella perfecta!",
        content: "Con mucho amor y cariño: Corta la mozzarella fresca en rodajas del mismo grosor que los tomates. ¡La simetría hace la diferencia!",
        tip: "🧀 La mozzarella fresca es más fácil de cortar si está fría",
        visual: "🧀",
        color: "step-color-1"
      },
      {
        id: 4,
        title: "¡El arte del montaje!",
        content: "El momento que estabas esperando: En un plato bonito, alterna las rodajas de tomate y mozzarella creando un patrón hermoso.",
        tip: "🎨 Piensa como un artista, cada rodaja es un pincelaza",
        visual: "🎨",
        color: "step-color-5"
      },
      {
        id: 5,
        title: "¡Albahaca aromática!",
        content: "¡Dale que ya casi terminamos! Coloca hojas frescas de albahaca entre las rodajas. ¡Ese aroma te va a volver loco!",
        tip: "🌿 No cortes la albahaca, rómpela con los dedos para más aroma",
        visual: "🌿",
        color: "step-color-4"
      },
      {
        id: 6,
        title: "¡El toque final dorado!",
        content: "✨ ¡El amor se siente en cada bocado! Rocía generosamente con aceite de oliva extra virgen y sazona con sal y pimienta al gusto.",
        tip: "🫒 Un buen aceite de oliva hace toda la diferencia",
        visual: "✨",
        color: "step-color-1"
      }
    ]
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <Loader2 className="loading-spinner" />
          <h2 className="loading-title">Preparando tu receta...</h2>
          <p className="loading-subtitle">¡Ya casi está lista la magia culinaria!</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-emoji">😕</div>
          <h2 className="error-title">¡Oops! Algo salió mal</h2>
          <p className="error-message">{error}</p>
          {!recipeId ? (
            <p className="error-helper">
              Este componente necesita un ID de receta para funcionar.<br/>
              Ejemplo: &lt;InteractiveRecipeGuide recipeId={1} /&gt;
            </p>
          ) : (
            <button 
              onClick={() => window.location.reload()} 
              className="error-retry-btn"
            >
              Intentar de nuevo
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!recipe) return null;

  const completeStep = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    
    if (currentStep === recipe.steps.length - 1) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const nextStep = () => {
    if (currentStep < recipe.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentStepData = recipe.steps[currentStep];
  const progressPercentage = ((currentStep + 1) / recipe.steps.length) * 100;

  return (
    <div className="recipe-container">
      <button 
        onClick={handleCloseRecipe}
        className="close-recipe-button"
        aria-label="Cerrar receta y volver al inicio"
      >
        <ArrowLeft className="close-icon" />
        <span className="close-text">Volver al Inicio</span>
      </button>

      <button 
        onClick={handleCloseRecipe}
        className="close-recipe-x-button"
        aria-label="Cerrar receta"
      >
        <X className="x-icon" />
      </button>

      {showCelebration && (
        <div className="celebration-overlay">
          <div className="celebration-modal">
            <div className="celebration-emoji">🎉</div>
            <h2 className="celebration-title">¡Felicidades!</h2>
            <p className="celebration-text">¡Tu receta está lista para conquistar corazones!</p>
            <button 
              onClick={handleCloseRecipe}
              className="celebration-close-btn"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      )}

      <div className="recipe-content">
        <div className="recipe-header">
          <div className="chef-badge">
            <ChefHat className="chef-icon" />
            <span className="chef-text">Modo Chef Activado</span>
          </div>
          
          {recipe.image && (
            <div className="recipe-image-container">
              <img 
                src={recipe.image} 
                alt={recipe.title}
                className="recipe-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          
          <h1 className="recipe-title">
            {recipe.title}
          </h1>
          <p className="recipe-description">{recipe.description}</p>
          
          <div className="recipe-meta">
            <RecipeMetaItem type="time" value={recipe.cookTime} />
            {recipe.servings && <RecipeMetaItem type="servings" value={recipe.servings} />}
            <RecipeMetaItem type="difficulty" value={recipe.difficulty} />
            {recipe.category && <RecipeMetaItem type="category" value={recipe.category} />}
          </div>
        </div>

        <div className="progress-section">
          <div className="progress-info">
            <span className="progress-text">
              Paso {currentStep + 1} de {recipe.steps.length}
            </span>
            <span className="progress-text">
              {Math.round(progressPercentage)}% completado
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          <div className="step-indicators">
            {recipe.steps.map((_, index) => (
              <div 
                key={index}
                className={`step-indicator ${
                  completedSteps.has(index) 
                    ? 'completed' 
                    : index === currentStep 
                      ? 'current' 
                      : 'pending'
                }`}
              >
                {completedSteps.has(index) ? <CheckCircle className="check-icon" /> : index + 1}
              </div>
            ))}
          </div>
        </div>

        <div className="step-card">
          <div className={`step-header ${currentStepData.color}`}>
            <div className="step-header-content">
              <div className="step-visual">
                {currentStepData.visual}
              </div>
              <h2 className="step-title">
                {currentStepData.title}
              </h2>
            </div>
            <div className="decoration decoration-1"></div>
            <div className="decoration decoration-2"></div>
          </div>

          <div className="step-content">
            <p className="step-text">
              {currentStepData.content}
            </p>

            {currentStepData.ingredients && (
              <div className="ingredients-section">
                <h3 className="ingredients-title">
                  <span>🛒</span> Necesitas:
                </h3>
                <ul className="ingredients-list">
                  {currentStepData.ingredients.map((ingredient, index) => (
                    <li key={index} className="ingredient-item">
                      <div className="ingredient-bullet"></div>
                      <span className="ingredient-text">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="tip-section">
              <p className="tip-text">{currentStepData.tip}</p>
            </div>

            <div className="button-container">
              <button
                onClick={completeStep}
                disabled={completedSteps.has(currentStep)}
                className={`complete-btn ${
                  completedSteps.has(currentStep) ? 'completed' : 'pending'
                }`}
              >
                {completedSteps.has(currentStep) ? (
                  <>
                    <CheckCircle className="btn-icon" />
                    ¡Paso Completado!
                  </>
                ) : (
                  <>
                    <CheckCircle className="btn-icon" />
                    ¡Listo, lo hice!
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <Navigation
          currentStep={currentStep}
          stepsLength={recipe.steps.length}
          completedSteps={completedSteps}
          onPrevStep={prevStep}
          onNextStep={nextStep}
        />

        <div className="footer">
          <p className="footer-text">
            Hecho con 💖 para cocineros aventureros como tú
          </p>
        </div>
      </div>
    </div>
  );
};

export default InteractiveRecipeGuide;