import React, { useState } from 'react';
import { Calculator, Settings, RotateCcw, Type, Ruler, Lightbulb } from 'lucide-react';
import BasicCalculator from './components/BasicCalculator';
import ScientificCalculator from './components/ScientificCalculator';
import UnitConverter from './components/UnitConverter';
import TextGenerator from './components/TextGenerator';
import FormulaCalculator from './components/FormulaCalculator';

const App = () => {
  const [activeTab, setActiveTab] = useState('basic');

  const tabs = [
    {
      id: 'basic',
      name: 'Basic',
      icon: Calculator,
      component: BasicCalculator
    },
    {
      id: 'scientific',
      name: 'Scientific',
      icon: Settings,
      component: ScientificCalculator
    },
    {
      id: 'formula',
      name: 'Formula',
      icon: Lightbulb,
      component: FormulaCalculator
    },
    {
      id: 'converter',
      name: 'Converter',
      icon: Ruler,
      component: UnitConverter
    },
    {
      id: 'text',
      name: 'Text Gen',
      icon: Type,
      component: TextGenerator
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Advanced Calculator
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Complete calculation suite with conversions and text generation
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600'
                  }`}
                >
                  <Icon size={18} />
                  {tab.name}
                </button>
              );
            })}
          </div>

          {/* Calculator Content */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
            {ActiveComponent && <ActiveComponent />}
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-slate-500 dark:text-slate-400">
            <p>Built with React, Tailwind CSS, and Math.js</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;