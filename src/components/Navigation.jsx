import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

const Navigation = ({ 
  currentStep, 
  stepsLength, 
  completedSteps, 
  onPrevStep, 
  onNextStep 
}) => {
  return (
    <div className="navigation">
      <button
        onClick={onPrevStep}
        disabled={currentStep === 0}
        className={`nav-btn prev-btn ${currentStep === 0 ? 'disabled' : ''}`}
      >
        <ArrowLeft className="nav-icon" />
        Paso Anterior
      </button>

      {currentStep === stepsLength - 1 ? (
        <div className="nav-center">
          <div className="completion-indicator">
            <div className="completion-emoji">🎉</div>
            <p className="completion-text">¡Receta Completada!</p>
          </div>
        </div>
      ) : (
        <button
          onClick={onNextStep}
          className="nav-btn next-btn"
        >
          Siguiente Paso
          <ArrowRight className="nav-icon" />
        </button>
      )}
    </div>
  );
};

export default Navigation;