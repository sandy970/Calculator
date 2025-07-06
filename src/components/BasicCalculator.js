import React, { useState } from 'react';
import { Delete, RotateCcw } from 'lucide-react';

const BasicCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const inputNumber = (num) => {
    if (waitingForNewValue) {
      setDisplay(String(num));
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const deleteLast = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const handleOperation = (op) => {
    if (op === '=') {
      performOperation('=');
      setOperation(null);
      setPreviousValue(null);
      setWaitingForNewValue(true);
    } else {
      performOperation(op);
    }
  };

  const Button = ({ onClick, className = '', children, ...props }) => (
    <button
      onClick={onClick}
      className={`calculator-button rounded-lg p-4 text-lg font-medium ${className}`}
      {...props}
    >
      {children}
    </button>
  );

  return (
    <div className="max-w-md mx-auto">
      {/* Display */}
      <div className="calculator-display mb-4 text-3xl">
        {display}
      </div>

      {/* Button Grid */}
      <div className="grid grid-cols-4 gap-3">
        {/* Row 1 */}
        <Button onClick={clear} className="calculator-button-secondary col-span-2">
          Clear
        </Button>
        <Button onClick={deleteLast} className="calculator-button-secondary">
          <Delete size={20} />
        </Button>
        <Button onClick={() => handleOperation('/')} className="calculator-button-primary">
          ÷
        </Button>

        {/* Row 2 */}
        <Button onClick={() => inputNumber(7)}>7</Button>
        <Button onClick={() => inputNumber(8)}>8</Button>
        <Button onClick={() => inputNumber(9)}>9</Button>
        <Button onClick={() => handleOperation('*')} className="calculator-button-primary">
          ×
        </Button>

        {/* Row 3 */}
        <Button onClick={() => inputNumber(4)}>4</Button>
        <Button onClick={() => inputNumber(5)}>5</Button>
        <Button onClick={() => inputNumber(6)}>6</Button>
        <Button onClick={() => handleOperation('-')} className="calculator-button-primary">
          −
        </Button>

        {/* Row 4 */}
        <Button onClick={() => inputNumber(1)}>1</Button>
        <Button onClick={() => inputNumber(2)}>2</Button>
        <Button onClick={() => inputNumber(3)}>3</Button>
        <Button onClick={() => handleOperation('+')} className="calculator-button-primary">
          +
        </Button>

        {/* Row 5 */}
        <Button onClick={() => inputNumber(0)} className="col-span-2">
          0
        </Button>
        <Button onClick={inputDecimal}>.</Button>
        <Button onClick={() => handleOperation('=')} className="calculator-button-primary">
          =
        </Button>
      </div>
    </div>
  );
};

export default BasicCalculator;