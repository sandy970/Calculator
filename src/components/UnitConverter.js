import React, { useState } from 'react';
import { ArrowLeftRight, Thermometer, Ruler, Weight, Clock, Zap } from 'lucide-react';

const UnitConverter = () => {
  const [selectedCategory, setSelectedCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');

  const conversionCategories = {
    length: {
      name: 'Length',
      icon: Ruler,
      units: {
        meter: { name: 'Meter', factor: 1 },
        kilometer: { name: 'Kilometer', factor: 1000 },
        centimeter: { name: 'Centimeter', factor: 0.01 },
        millimeter: { name: 'Millimeter', factor: 0.001 },
        inch: { name: 'Inch', factor: 0.0254 },
        foot: { name: 'Foot', factor: 0.3048 },
        yard: { name: 'Yard', factor: 0.9144 },
        mile: { name: 'Mile', factor: 1609.344 },
        nautical_mile: { name: 'Nautical Mile', factor: 1852 }
      }
    },
    weight: {
      name: 'Weight',
      icon: Weight,
      units: {
        kilogram: { name: 'Kilogram', factor: 1 },
        gram: { name: 'Gram', factor: 0.001 },
        pound: { name: 'Pound', factor: 0.453592 },
        ounce: { name: 'Ounce', factor: 0.0283495 },
        ton: { name: 'Ton', factor: 1000 },
        stone: { name: 'Stone', factor: 6.35029 }
      }
    },
    temperature: {
      name: 'Temperature',
      icon: Thermometer,
      units: {
        celsius: { name: 'Celsius' },
        fahrenheit: { name: 'Fahrenheit' },
        kelvin: { name: 'Kelvin' }
      }
    },
    volume: {
      name: 'Volume',
      icon: Zap,
      units: {
        liter: { name: 'Liter', factor: 1 },
        milliliter: { name: 'Milliliter', factor: 0.001 },
        gallon_us: { name: 'Gallon (US)', factor: 3.78541 },
        gallon_uk: { name: 'Gallon (UK)', factor: 4.54609 },
        quart: { name: 'Quart', factor: 0.946353 },
        pint: { name: 'Pint', factor: 0.473176 },
        cup: { name: 'Cup', factor: 0.236588 },
        fluid_ounce: { name: 'Fluid Ounce', factor: 0.0295735 }
      }
    },
    area: {
      name: 'Area',
      icon: Ruler,
      units: {
        square_meter: { name: 'Square Meter', factor: 1 },
        square_kilometer: { name: 'Square Kilometer', factor: 1000000 },
        square_centimeter: { name: 'Square Centimeter', factor: 0.0001 },
        square_inch: { name: 'Square Inch', factor: 0.00064516 },
        square_foot: { name: 'Square Foot', factor: 0.092903 },
        square_yard: { name: 'Square Yard', factor: 0.836127 },
        acre: { name: 'Acre', factor: 4046.86 },
        hectare: { name: 'Hectare', factor: 10000 }
      }
    },
    time: {
      name: 'Time',
      icon: Clock,
      units: {
        second: { name: 'Second', factor: 1 },
        minute: { name: 'Minute', factor: 60 },
        hour: { name: 'Hour', factor: 3600 },
        day: { name: 'Day', factor: 86400 },
        week: { name: 'Week', factor: 604800 },
        month: { name: 'Month', factor: 2592000 },
        year: { name: 'Year', factor: 31536000 }
      }
    }
  };

  const convertTemperature = (value, from, to) => {
    let celsius;
    
    // Convert to Celsius first
    switch (from) {
      case 'celsius':
        celsius = value;
        break;
      case 'fahrenheit':
        celsius = (value - 32) * 5/9;
        break;
      case 'kelvin':
        celsius = value - 273.15;
        break;
      default:
        celsius = value;
    }
    
    // Convert from Celsius to target unit
    switch (to) {
      case 'celsius':
        return celsius;
      case 'fahrenheit':
        return celsius * 9/5 + 32;
      case 'kelvin':
        return celsius + 273.15;
      default:
        return celsius;
    }
  };

  const convertUnits = () => {
    if (!inputValue || !fromUnit || !toUnit) return;

    const value = parseFloat(inputValue);
    if (isNaN(value)) return;

    const category = conversionCategories[selectedCategory];
    
    if (selectedCategory === 'temperature') {
      const convertedValue = convertTemperature(value, fromUnit, toUnit);
      setResult(convertedValue.toFixed(6));
    } else {
      const fromFactor = category.units[fromUnit].factor;
      const toFactor = category.units[toUnit].factor;
      const convertedValue = (value * fromFactor) / toFactor;
      setResult(convertedValue.toFixed(6));
    }
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    if (result) {
      setInputValue(result);
      setResult('');
    }
  };

  const currentCategory = conversionCategories[selectedCategory];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Category Selection */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <div className="space-y-2">
            {Object.entries(conversionCategories).map(([key, category]) => {
              const Icon = category.icon;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedCategory(key);
                    setFromUnit('');
                    setToUnit('');
                    setInputValue('');
                    setResult('');
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors duration-200 ${
                    selectedCategory === key
                      ? 'bg-primary-500 text-white'
                      : 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={20} />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Conversion Interface */}
        <div className="lg:col-span-3 space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              {React.createElement(currentCategory.icon, { size: 24, className: "mr-2" })}
              {currentCategory.name} Converter
            </h2>
          </div>

          {/* From Unit */}
          <div>
            <label className="block text-sm font-medium mb-2">From</label>
            <div className="flex gap-3">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value"
                className="flex-1 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 min-w-[150px]"
              >
                <option value="">Select unit</option>
                {Object.entries(currentCategory.units).map(([key, unit]) => (
                  <option key={key} value={key}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={swapUnits}
              className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 p-3 rounded-full transition-colors duration-200"
            >
              <ArrowLeftRight size={20} />
            </button>
          </div>

          {/* To Unit */}
          <div>
            <label className="block text-sm font-medium mb-2">To</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={result}
                readOnly
                placeholder="Result"
                className="flex-1 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 font-mono text-lg"
              />
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 min-w-[150px]"
              >
                <option value="">Select unit</option>
                {Object.entries(currentCategory.units).map(([key, unit]) => (
                  <option key={key} value={key}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Convert Button */}
          <button
            onClick={convertUnits}
            disabled={!inputValue || !fromUnit || !toUnit}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Convert
          </button>

          {/* Common Conversions */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
            <h4 className="font-medium text-sm mb-3">Quick Conversions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {selectedCategory === 'length' && (
                <>
                  <div className="flex justify-between">
                    <span>1 meter =</span>
                    <span className="font-mono">3.28084 feet</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1 kilometer =</span>
                    <span className="font-mono">0.621371 miles</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1 inch =</span>
                    <span className="font-mono">2.54 cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1 foot =</span>
                    <span className="font-mono">30.48 cm</span>
                  </div>
                </>
              )}
              {selectedCategory === 'weight' && (
                <>
                  <div className="flex justify-between">
                    <span>1 kg =</span>
                    <span className="font-mono">2.20462 pounds</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1 pound =</span>
                    <span className="font-mono">16 ounces</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1 ton =</span>
                    <span className="font-mono">1000 kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1 stone =</span>
                    <span className="font-mono">14 pounds</span>
                  </div>
                </>
              )}
              {selectedCategory === 'temperature' && (
                <>
                  <div className="flex justify-between">
                    <span>0°C =</span>
                    <span className="font-mono">32°F</span>
                  </div>
                  <div className="flex justify-between">
                    <span>100°C =</span>
                    <span className="font-mono">212°F</span>
                  </div>
                  <div className="flex justify-between">
                    <span>0°C =</span>
                    <span className="font-mono">273.15K</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Room temp =</span>
                    <span className="font-mono">20°C / 68°F</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;