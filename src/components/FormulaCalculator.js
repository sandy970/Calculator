import React, { useState } from 'react';
import { evaluate } from 'mathjs';
import { InlineMath, BlockMath } from 'react-katex';
import { Calculator, BookOpen, Lightbulb } from 'lucide-react';

const FormulaCalculator = () => {
  const [formula, setFormula] = useState('');
  const [result, setResult] = useState('');
  const [variables, setVariables] = useState({});
  const [savedFormulas, setSavedFormulas] = useState([]);
  const [formulaName, setFormulaName] = useState('');

  const commonFormulas = [
    {
      name: 'Quadratic Formula',
      formula: '(-b + sqrt(b^2 - 4*a*c)) / (2*a)',
      latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
      variables: ['a', 'b', 'c']
    },
    {
      name: 'Distance Formula',
      formula: 'sqrt((x2-x1)^2 + (y2-y1)^2)',
      latex: 'd = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}',
      variables: ['x1', 'y1', 'x2', 'y2']
    },
    {
      name: 'Area of Circle',
      formula: 'pi * r^2',
      latex: 'A = \\pi r^2',
      variables: ['r']
    },
    {
      name: 'Compound Interest',
      formula: 'P * (1 + r/n)^(n*t)',
      latex: 'A = P(1 + \\frac{r}{n})^{nt}',
      variables: ['P', 'r', 'n', 't']
    },
    {
      name: 'Pythagorean Theorem',
      formula: 'sqrt(a^2 + b^2)',
      latex: 'c = \\sqrt{a^2 + b^2}',
      variables: ['a', 'b']
    },
    {
      name: 'Volume of Sphere',
      formula: '(4/3) * pi * r^3',
      latex: 'V = \\frac{4}{3}\\pi r^3',
      variables: ['r']
    }
  ];

  const extractVariables = (formula) => {
    const variables = formula.match(/[a-zA-Z]+/g) || [];
    return [...new Set(variables)].filter(v => !['pi', 'e', 'sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'abs', 'floor', 'ceil', 'round', 'exp'].includes(v));
  };

  const calculateFormula = () => {
    try {
      let processedFormula = formula;
      
      // Replace variables with their values
      Object.entries(variables).forEach(([variable, value]) => {
        if (value !== '') {
          processedFormula = processedFormula.replace(new RegExp(`\\b${variable}\\b`, 'g'), value);
        }
      });

      const calculatedResult = evaluate(processedFormula);
      setResult(calculatedResult.toString());
    } catch (error) {
      setResult('Error: ' + error.message);
    }
  };

  const handleVariableChange = (variable, value) => {
    setVariables(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  const loadFormula = (formulaData) => {
    setFormula(formulaData.formula);
    setVariables({});
    // Pre-populate variables with empty values
    formulaData.variables.forEach(variable => {
      setVariables(prev => ({
        ...prev,
        [variable]: ''
      }));
    });
  };

  const saveFormula = () => {
    if (formulaName && formula) {
      const newFormula = {
        name: formulaName,
        formula: formula,
        variables: extractVariables(formula)
      };
      setSavedFormulas([...savedFormulas, newFormula]);
      setFormulaName('');
    }
  };

  const formulaVariables = extractVariables(formula);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Formula Input */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Mathematical Formula</label>
            <textarea
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              placeholder="Enter your mathematical formula (e.g., a^2 + b^2)"
              className="w-full h-24 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 font-mono text-sm"
            />
          </div>

          {/* Variables Input */}
          {formulaVariables.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Variables</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {formulaVariables.map(variable => (
                  <div key={variable}>
                    <label className="block text-xs font-medium mb-1">{variable}</label>
                    <input
                      type="number"
                      value={variables[variable] || ''}
                      onChange={(e) => handleVariableChange(variable, e.target.value)}
                      className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-sm"
                      placeholder="Value"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Calculate Button */}
          <button
            onClick={calculateFormula}
            disabled={!formula}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            <Calculator className="inline-block mr-2" size={20} />
            Calculate
          </button>

          {/* Result */}
          {result && (
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
              <label className="block text-sm font-medium mb-2">Result</label>
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 font-mono">
                {result}
              </div>
            </div>
          )}

          {/* Save Formula */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
            <label className="block text-sm font-medium mb-2">Save Formula</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formulaName}
                onChange={(e) => setFormulaName(e.target.value)}
                placeholder="Formula name"
                className="flex-1 p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-sm"
              />
              <button
                onClick={saveFormula}
                disabled={!formulaName || !formula}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded transition-colors duration-200"
              >
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Formula Library */}
        <div className="space-y-6">
          {/* Common Formulas */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BookOpen className="mr-2" size={20} />
              Common Formulas
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {commonFormulas.map((formulaData, index) => (
                <div key={index} className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-2">{formulaData.name}</h4>
                  <div className="text-xs mb-2">
                    <BlockMath math={formulaData.latex} />
                  </div>
                  <button
                    onClick={() => loadFormula(formulaData)}
                    className="text-xs bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded transition-colors duration-200"
                  >
                    Load Formula
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Formulas */}
          {savedFormulas.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Lightbulb className="mr-2" size={20} />
                Saved Formulas
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {savedFormulas.map((formulaData, index) => (
                  <div key={index} className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                    <h4 className="font-medium text-sm mb-2">{formulaData.name}</h4>
                    <p className="text-xs font-mono text-slate-600 dark:text-slate-400 mb-2">
                      {formulaData.formula}
                    </p>
                    <button
                      onClick={() => loadFormula(formulaData)}
                      className="text-xs bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded transition-colors duration-200"
                    >
                      Load Formula
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormulaCalculator;