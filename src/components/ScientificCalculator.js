import React, { useState } from 'react';
import { evaluate } from 'mathjs';
import { Delete, RotateCcw } from 'lucide-react';

const ScientificCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState([]);

  const addToExpression = (value) => {
    if (display === '0' && !isNaN(value)) {
      setDisplay(value);
      setExpression(value);
    } else {
      setDisplay(display + value);
      setExpression(expression + value);
    }
  };

  const addFunction = (func) => {
    const newExpression = expression + func + '(';
    setExpression(newExpression);
    setDisplay(newExpression);
  };

  const calculate = () => {
    try {
      const result = evaluate(expression);
      const calculation = `${expression} = ${result}`;
      setHistory([...history, calculation]);
      setDisplay(String(result));
      setExpression(String(result));
    } catch (error) {
      setDisplay('Error');
      setExpression('');
    }
  };

  const clear = () => {
    setDisplay('0');
    setExpression('');
  };

  const deleteLast = () => {
    if (expression.length > 1) {
      const newExpression = expression.slice(0, -1);
      setExpression(newExpression);
      setDisplay(newExpression || '0');
    } else {
      clear();
    }
  };

  const addConstant = (constant) => {
    const value = constant === 'π' ? 'pi' : constant === 'e' ? 'e' : constant;
    addToExpression(value);
  };

  const Button = ({ onClick, className = '', children, ...props }) => (
    <button
      onClick={onClick}
      className={`calculator-button rounded-lg p-3 text-sm font-medium ${className}`}
      {...props}
    >
      {children}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Calculator */}
        <div className="lg:col-span-3">
          {/* Display */}
          <div className="calculator-display mb-4 text-xl">
            {display}
          </div>

          {/* Button Grid */}
          <div className="grid grid-cols-6 gap-2">
            {/* Row 1 - Functions */}
            <Button onClick={() => addFunction('sin')} className="calculator-button-secondary">
              sin
            </Button>
            <Button onClick={() => addFunction('cos')} className="calculator-button-secondary">
              cos
            </Button>
            <Button onClick={() => addFunction('tan')} className="calculator-button-secondary">
              tan
            </Button>
            <Button onClick={() => addFunction('log')} className="calculator-button-secondary">
              log
            </Button>
            <Button onClick={() => addFunction('ln')} className="calculator-button-secondary">
              ln
            </Button>
            <Button onClick={() => addFunction('sqrt')} className="calculator-button-secondary">
              √
            </Button>

            {/* Row 2 - More Functions */}
            <Button onClick={() => addFunction('asin')} className="calculator-button-secondary">
              asin
            </Button>
            <Button onClick={() => addFunction('acos')} className="calculator-button-secondary">
              acos
            </Button>
            <Button onClick={() => addFunction('atan')} className="calculator-button-secondary">
              atan
            </Button>
            <Button onClick={() => addToExpression('^')} className="calculator-button-secondary">
              x^y
            </Button>
            <Button onClick={() => addConstant('π')} className="calculator-button-secondary">
              π
            </Button>
            <Button onClick={() => addConstant('e')} className="calculator-button-secondary">
              e
            </Button>

            {/* Row 3 - Controls */}
            <Button onClick={clear} className="calculator-button-secondary">
              Clear
            </Button>
            <Button onClick={deleteLast} className="calculator-button-secondary">
              <Delete size={16} />
            </Button>
            <Button onClick={() => addToExpression('(')} className="calculator-button-secondary">
              (
            </Button>
            <Button onClick={() => addToExpression(')')} className="calculator-button-secondary">
              )
            </Button>
            <Button onClick={() => addToExpression('/')} className="calculator-button-primary">
              ÷
            </Button>
            <Button onClick={() => addToExpression('*')} className="calculator-button-primary">
              ×
            </Button>

            {/* Row 4 - Numbers */}
            <Button onClick={() => addToExpression('7')}>7</Button>
            <Button onClick={() => addToExpression('8')}>8</Button>
            <Button onClick={() => addToExpression('9')}>9</Button>
            <Button onClick={() => addToExpression('-')} className="calculator-button-primary">
              −
            </Button>
            <Button onClick={() => addToExpression('!')}>!</Button>
            <Button onClick={() => addToExpression('%')}>%</Button>

            {/* Row 5 */}
            <Button onClick={() => addToExpression('4')}>4</Button>
            <Button onClick={() => addToExpression('5')}>5</Button>
            <Button onClick={() => addToExpression('6')}>6</Button>
            <Button onClick={() => addToExpression('+')} className="calculator-button-primary">
              +
            </Button>
            <Button onClick={() => addToExpression('abs(')} className="calculator-button-secondary">
              |x|
            </Button>
            <Button onClick={() => addToExpression('floor(')} className="calculator-button-secondary">
              floor
            </Button>

            {/* Row 6 */}
            <Button onClick={() => addToExpression('1')}>1</Button>
            <Button onClick={() => addToExpression('2')}>2</Button>
            <Button onClick={() => addToExpression('3')}>3</Button>
            <Button onClick={calculate} className="calculator-button-primary row-span-2">
              =
            </Button>
            <Button onClick={() => addToExpression('ceil(')} className="calculator-button-secondary">
              ceil
            </Button>
            <Button onClick={() => addToExpression('round(')} className="calculator-button-secondary">
              round
            </Button>

            {/* Row 7 */}
            <Button onClick={() => addToExpression('0')} className="col-span-2">
              0
            </Button>
            <Button onClick={() => addToExpression('.')}>.</Button>
            <Button onClick={() => addToExpression('exp(')} className="calculator-button-secondary">
              exp
            </Button>
            <Button onClick={() => addToExpression('mod(')} className="calculator-button-secondary">
              mod
            </Button>
          </div>
        </div>

        {/* History Panel */}
        <div className="lg:col-span-1">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 h-96 overflow-y-auto">
            <h3 className="font-semibold text-sm mb-3 text-slate-700 dark:text-slate-300">
              History
            </h3>
            <div className="space-y-2">
              {history.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  No calculations yet
                </p>
              ) : (
                history.slice(-10).reverse().map((calc, index) => (
                  <div
                    key={index}
                    className="text-xs font-mono bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700"
                  >
                    {calc}
                  </div>
                ))
              )}
            </div>
            {history.length > 0 && (
              <button
                onClick={() => setHistory([])}
                className="mt-3 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Clear History
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScientificCalculator;