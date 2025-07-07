import React, { createContext, useContext, useState, useReducer } from 'react';
import { evaluate } from 'mathjs';

const MathContext = createContext();

export const useMath = () => {
  const context = useContext(MathContext);
  if (!context) {
    throw new Error('useMath must be used within a MathProvider');
  }
  return context;
};

// Math subjects and topics database
const mathDatabase = {
  algebra: {
    name: 'Algebra',
    topics: {
      linear_equations: {
        name: 'Linear Equations',
        formulas: [
          { name: 'Slope-Intercept Form', formula: 'y = mx + b', description: 'Where m is slope and b is y-intercept' },
          { name: 'Point-Slope Form', formula: 'y - y₁ = m(x - x₁)', description: 'Using a point and slope' },
          { name: 'Standard Form', formula: 'Ax + By = C', description: 'General linear equation form' }
        ]
      },
      quadratic_equations: {
        name: 'Quadratic Equations',
        formulas: [
          { name: 'Quadratic Formula', formula: 'x = (-b ± √(b² - 4ac)) / 2a', description: 'Solves ax² + bx + c = 0' },
          { name: 'Vertex Form', formula: 'y = a(x - h)² + k', description: 'Where (h,k) is the vertex' },
          { name: 'Discriminant', formula: 'Δ = b² - 4ac', description: 'Determines number of solutions' }
        ]
      }
    }
  },
  geometry: {
    name: 'Geometry',
    topics: {
      area_perimeter: {
        name: 'Area and Perimeter',
        formulas: [
          { name: 'Rectangle Area', formula: 'A = l × w', description: 'Length times width' },
          { name: 'Circle Area', formula: 'A = πr²', description: 'Pi times radius squared' },
          { name: 'Triangle Area', formula: 'A = ½bh', description: 'Half base times height' },
          { name: 'Circle Circumference', formula: 'C = 2πr', description: 'Two pi times radius' }
        ]
      },
      pythagorean: {
        name: 'Pythagorean Theorem',
        formulas: [
          { name: 'Pythagorean Theorem', formula: 'a² + b² = c²', description: 'For right triangles' },
          { name: 'Distance Formula', formula: 'd = √[(x₂-x₁)² + (y₂-y₁)²]', description: 'Distance between two points' }
        ]
      }
    }
  },
  calculus: {
    name: 'Calculus',
    topics: {
      derivatives: {
        name: 'Derivatives',
        formulas: [
          { name: 'Power Rule', formula: 'd/dx[xⁿ] = nxⁿ⁻¹', description: 'Derivative of power functions' },
          { name: 'Product Rule', formula: 'd/dx[uv] = u\'v + uv\'', description: 'Derivative of products' },
          { name: 'Chain Rule', formula: 'd/dx[f(g(x))] = f\'(g(x)) × g\'(x)', description: 'Derivative of compositions' }
        ]
      }
    }
  },
  trigonometry: {
    name: 'Trigonometry',
    topics: {
      basic_functions: {
        name: 'Basic Functions',
        formulas: [
          { name: 'Sine', formula: 'sin(θ) = opposite/hypotenuse', description: 'Sine ratio' },
          { name: 'Cosine', formula: 'cos(θ) = adjacent/hypotenuse', description: 'Cosine ratio' },
          { name: 'Tangent', formula: 'tan(θ) = opposite/adjacent', description: 'Tangent ratio' }
        ]
      }
    }
  }
};

// Step-by-step solution generator
const generateSteps = (problem, type) => {
  const steps = [];
  
  try {
    switch (type) {
      case 'linear_equation':
        steps.push(`Given equation: ${problem}`);
        steps.push('Isolate the variable by moving constants to one side');
        steps.push('Simplify both sides');
        steps.push('Divide by the coefficient of the variable');
        break;
        
      case 'quadratic_equation':
        steps.push(`Given equation: ${problem}`);
        steps.push('Identify coefficients a, b, and c');
        steps.push('Apply quadratic formula: x = (-b ± √(b² - 4ac)) / 2a');
        steps.push('Calculate discriminant: b² - 4ac');
        steps.push('Substitute values and solve');
        break;
        
      case 'arithmetic':
        steps.push(`Expression: ${problem}`);
        steps.push('Follow order of operations (PEMDAS)');
        steps.push('Evaluate parentheses first');
        steps.push('Then exponents, multiplication/division, addition/subtraction');
        break;
        
      default:
        steps.push(`Problem: ${problem}`);
        steps.push('Analyze the problem type');
        steps.push('Apply appropriate mathematical principles');
        steps.push('Work through step by step');
    }
    
    // Try to calculate actual result
    const result = evaluate(problem.replace(/[^0-9+\-*/().^√]/g, ''));
    steps.push(`Final answer: ${result}`);
  } catch (error) {
    steps.push('Review the problem and try again');
  }
  
  return steps;
};

// Math problem classifier
const classifyProblem = (text) => {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('x²') || lowerText.includes('x^2') || lowerText.includes('quadratic')) {
    return 'quadratic_equation';
  } else if (lowerText.includes('x') && (lowerText.includes('=') || lowerText.includes('solve'))) {
    return 'linear_equation';
  } else if (/[+\-*/^√]/.test(text)) {
    return 'arithmetic';
  } else if (lowerText.includes('area') || lowerText.includes('perimeter')) {
    return 'geometry';
  } else if (lowerText.includes('sin') || lowerText.includes('cos') || lowerText.includes('tan')) {
    return 'trigonometry';
  } else if (lowerText.includes('derivative') || lowerText.includes('integral')) {
    return 'calculus';
  }
  
  return 'general';
};

const initialState = {
  currentProblem: null,
  solutions: [],
  history: [],
  favoriteFormulas: [],
  recentTopics: [],
};

const mathReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PROBLEM':
      return {
        ...state,
        currentProblem: action.payload,
      };
    case 'ADD_SOLUTION':
      return {
        ...state,
        solutions: [action.payload, ...state.solutions],
        history: [action.payload, ...state.history].slice(0, 50), // Keep last 50
      };
    case 'ADD_FAVORITE_FORMULA':
      return {
        ...state,
        favoriteFormulas: [...state.favoriteFormulas, action.payload],
      };
    case 'REMOVE_FAVORITE_FORMULA':
      return {
        ...state,
        favoriteFormulas: state.favoriteFormulas.filter(f => f.id !== action.payload),
      };
    case 'ADD_RECENT_TOPIC':
      return {
        ...state,
        recentTopics: [action.payload, ...state.recentTopics.filter(t => t !== action.payload)].slice(0, 10),
      };
    default:
      return state;
  }
};

export const MathProvider = ({ children }) => {
  const [state, dispatch] = useReducer(mathReducer, initialState);
  const [isLoading, setIsLoading] = useState(false);

  const solveProblem = async (problemText, showHint = false) => {
    setIsLoading(true);
    
    try {
      const problemType = classifyProblem(problemText);
      const steps = generateSteps(problemText, problemType);
      
      const solution = {
        id: Date.now(),
        problem: problemText,
        type: problemType,
        steps: showHint ? [steps[0], steps[1]] : steps,
        fullSteps: steps,
        timestamp: new Date(),
        isHint: showHint,
      };
      
      dispatch({ type: 'SET_PROBLEM', payload: solution });
      dispatch({ type: 'ADD_SOLUTION', payload: solution });
      
      return solution;
    } catch (error) {
      console.error('Error solving problem:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getFullSolution = (solutionId) => {
    const solution = state.solutions.find(s => s.id === solutionId);
    if (solution) {
      const updatedSolution = { ...solution, steps: solution.fullSteps, isHint: false };
      dispatch({ type: 'SET_PROBLEM', payload: updatedSolution });
      return updatedSolution;
    }
    return null;
  };

  const searchFormulas = (query) => {
    const results = [];
    const lowerQuery = query.toLowerCase();
    
    Object.entries(mathDatabase).forEach(([subjectKey, subject]) => {
      Object.entries(subject.topics).forEach(([topicKey, topic]) => {
        topic.formulas.forEach(formula => {
          if (
            formula.name.toLowerCase().includes(lowerQuery) ||
            formula.description.toLowerCase().includes(lowerQuery) ||
            subject.name.toLowerCase().includes(lowerQuery) ||
            topic.name.toLowerCase().includes(lowerQuery)
          ) {
            results.push({
              ...formula,
              subject: subject.name,
              topic: topic.name,
              subjectKey,
              topicKey,
            });
          }
        });
      });
    });
    
    return results;
  };

  const getSubjectFormulas = (subjectKey) => {
    return mathDatabase[subjectKey] || null;
  };

  const addToFavorites = (formula) => {
    dispatch({ type: 'ADD_FAVORITE_FORMULA', payload: { ...formula, id: Date.now() } });
  };

  const removeFromFavorites = (formulaId) => {
    dispatch({ type: 'REMOVE_FAVORITE_FORMULA', payload: formulaId });
  };

  const addRecentTopic = (topic) => {
    dispatch({ type: 'ADD_RECENT_TOPIC', payload: topic });
  };

  const value = {
    ...state,
    mathDatabase,
    isLoading,
    solveProblem,
    getFullSolution,
    searchFormulas,
    getSubjectFormulas,
    addToFavorites,
    removeFromFavorites,
    addRecentTopic,
    classifyProblem,
  };

  return (
    <MathContext.Provider value={value}>
      {children}
    </MathContext.Provider>
  );
};