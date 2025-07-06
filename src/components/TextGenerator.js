import React, { useState } from 'react';
import { Copy, RefreshCw, Hash, Type, Key, Dice1, AlignLeft, BarChart3 } from 'lucide-react';

const TextGenerator = () => {
  const [activeFunction, setActiveFunction] = useState('password');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [passwordLength, setPasswordLength] = useState(12);
  const [passwordOptions, setPasswordOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  });

  const functions = {
    password: {
      name: 'Password Generator',
      icon: Key,
      description: 'Generate secure passwords'
    },
    hash: {
      name: 'Hash Generator',
      icon: Hash,
      description: 'Generate simple hashes'
    },
    case: {
      name: 'Case Converter',
      icon: Type,
      description: 'Convert text case'
    },
    lorem: {
      name: 'Lorem Ipsum',
      icon: AlignLeft,
      description: 'Generate placeholder text'
    },
    random: {
      name: 'Random Text',
      icon: Dice1,
      description: 'Generate random text'
    },
    analysis: {
      name: 'Text Analysis',
      icon: BarChart3,
      description: 'Analyze text properties'
    }
  };

  const generatePassword = () => {
    const charset = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    let availableChars = '';
    Object.keys(passwordOptions).forEach(key => {
      if (passwordOptions[key]) {
        availableChars += charset[key];
      }
    });

    if (availableChars.length === 0) {
      setOutputText('Please select at least one character type');
      return;
    }

    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      password += availableChars.charAt(Math.floor(Math.random() * availableChars.length));
    }

    setOutputText(password);
  };

  const generateHash = () => {
    if (!inputText) {
      setOutputText('Please enter text to hash');
      return;
    }

    // Simple hash function (not cryptographically secure)
    let hash = 0;
    for (let i = 0; i < inputText.length; i++) {
      const char = inputText.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    const hashString = Math.abs(hash).toString(16).padStart(8, '0');
    setOutputText(`Simple Hash: ${hashString}\nMD5-like: ${hashString.repeat(4).substring(0, 32)}`);
  };

  const convertCase = (type) => {
    if (!inputText) {
      setOutputText('Please enter text to convert');
      return;
    }

    let converted = '';
    switch (type) {
      case 'upper':
        converted = inputText.toUpperCase();
        break;
      case 'lower':
        converted = inputText.toLowerCase();
        break;
      case 'title':
        converted = inputText.replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
        break;
      case 'camel':
        converted = inputText.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
          return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
        break;
      case 'snake':
        converted = inputText.toLowerCase().replace(/\s+/g, '_');
        break;
      case 'kebab':
        converted = inputText.toLowerCase().replace(/\s+/g, '-');
        break;
      default:
        converted = inputText;
    }

    setOutputText(converted);
  };

  const generateLorem = (paragraphs = 3) => {
    const loremWords = [
      'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
      'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
      'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
      'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
      'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
      'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
      'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
      'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
    ];

    const generateSentence = () => {
      const sentenceLength = Math.floor(Math.random() * 15) + 5;
      let sentence = '';
      for (let i = 0; i < sentenceLength; i++) {
        const word = loremWords[Math.floor(Math.random() * loremWords.length)];
        sentence += (i === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word) + ' ';
      }
      return sentence.trim() + '.';
    };

    const generateParagraph = () => {
      const paragraphLength = Math.floor(Math.random() * 8) + 3;
      let paragraph = '';
      for (let i = 0; i < paragraphLength; i++) {
        paragraph += generateSentence() + ' ';
      }
      return paragraph.trim();
    };

    let lorem = '';
    for (let i = 0; i < paragraphs; i++) {
      lorem += generateParagraph() + '\n\n';
    }

    setOutputText(lorem.trim());
  };

  const generateRandomText = () => {
    const types = ['words', 'sentences', 'numbers', 'mixed'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    switch (type) {
      case 'words':
        const randomWords = ['apple', 'banana', 'cherry', 'dog', 'elephant', 'forest', 'guitar', 'house', 'ice', 'jungle'];
        const wordCount = Math.floor(Math.random() * 10) + 5;
        const words = Array.from({ length: wordCount }, () => 
          randomWords[Math.floor(Math.random() * randomWords.length)]
        );
        setOutputText(words.join(' '));
        break;
      
      case 'sentences':
        const sentences = [
          'The quick brown fox jumps over the lazy dog.',
          'A journey of a thousand miles begins with a single step.',
          'To be or not to be, that is the question.',
          'All that glitters is not gold.',
          'Actions speak louder than words.'
        ];
        const sentenceCount = Math.floor(Math.random() * 3) + 2;
        const selectedSentences = Array.from({ length: sentenceCount }, () => 
          sentences[Math.floor(Math.random() * sentences.length)]
        );
        setOutputText(selectedSentences.join(' '));
        break;
      
      case 'numbers':
        const numbers = Array.from({ length: 10 }, () => Math.floor(Math.random() * 1000));
        setOutputText(numbers.join(', '));
        break;
      
      case 'mixed':
        const mixed = `Random ID: ${Math.random().toString(36).substring(2, 15)}
Random Color: #${Math.floor(Math.random()*16777215).toString(16)}
Random Date: ${new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString()}
Random Number: ${Math.floor(Math.random() * 1000000)}`;
        setOutputText(mixed);
        break;
    }
  };

  const analyzeText = () => {
    if (!inputText) {
      setOutputText('Please enter text to analyze');
      return;
    }

    const words = inputText.trim().split(/\s+/);
    const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = inputText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const chars = inputText.length;
    const charsNoSpaces = inputText.replace(/\s/g, '').length;
    
    const wordFrequency = {};
    words.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      if (cleanWord) {
        wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
      }
    });

    const mostCommon = Object.entries(wordFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word, count]) => `${word}: ${count}`)
      .join(', ');

    const analysis = `Text Analysis:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Basic Statistics:
   Characters: ${chars}
   Characters (no spaces): ${charsNoSpaces}
   Words: ${words.length}
   Sentences: ${sentences.length}
   Paragraphs: ${paragraphs.length}

📈 Averages:
   Words per sentence: ${(words.length / sentences.length).toFixed(1)}
   Characters per word: ${(charsNoSpaces / words.length).toFixed(1)}

🔤 Most common words:
   ${mostCommon}

⏱️ Reading time: ~${Math.ceil(words.length / 200)} minutes`;

    setOutputText(analysis);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
  };

  const renderFunctionInterface = () => {
    switch (activeFunction) {
      case 'password':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Password Length</label>
              <input
                type="range"
                min="4"
                max="50"
                value={passwordLength}
                onChange={(e) => setPasswordLength(parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-slate-600">{passwordLength} characters</span>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Character Types</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(passwordOptions).map(([key, value]) => (
                  <label key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setPasswordOptions(prev => ({
                        ...prev,
                        [key]: e.target.checked
                      }))}
                    />
                    <span className="text-sm capitalize">{key}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <button
              onClick={generatePassword}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Generate Password
            </button>
          </div>
        );

      case 'hash':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Text to Hash</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to generate hash..."
                className="w-full h-24 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
              />
            </div>
            
            <button
              onClick={generateHash}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Generate Hash
            </button>
          </div>
        );

      case 'case':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Text to Convert</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to convert case..."
                className="w-full h-24 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <button
                onClick={() => convertCase('upper')}
                className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                UPPER
              </button>
              <button
                onClick={() => convertCase('lower')}
                className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                lower
              </button>
              <button
                onClick={() => convertCase('title')}
                className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Title Case
              </button>
              <button
                onClick={() => convertCase('camel')}
                className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                camelCase
              </button>
              <button
                onClick={() => convertCase('snake')}
                className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                snake_case
              </button>
              <button
                onClick={() => convertCase('kebab')}
                className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                kebab-case
              </button>
            </div>
          </div>
        );

      case 'lorem':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => generateLorem(1)}
                className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                1 Paragraph
              </button>
              <button
                onClick={() => generateLorem(3)}
                className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                3 Paragraphs
              </button>
              <button
                onClick={() => generateLorem(5)}
                className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                5 Paragraphs
              </button>
            </div>
          </div>
        );

      case 'random':
        return (
          <div className="space-y-4">
            <button
              onClick={generateRandomText}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              <RefreshCw className="inline-block mr-2" size={16} />
              Generate Random Text
            </button>
          </div>
        );

      case 'analysis':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Text to Analyze</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to analyze..."
                className="w-full h-32 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
              />
            </div>
            
            <button
              onClick={analyzeText}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Analyze Text
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Function Selection */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4">Functions</h3>
          <div className="space-y-2">
            {Object.entries(functions).map(([key, func]) => {
              const Icon = func.icon;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setActiveFunction(key);
                    setInputText('');
                    setOutputText('');
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors duration-200 ${
                    activeFunction === key
                      ? 'bg-primary-500 text-white'
                      : 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={20} />
                  <div>
                    <div className="font-medium">{func.name}</div>
                    <div className="text-xs opacity-70">{func.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Function Interface */}
        <div className="lg:col-span-3 space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              {React.createElement(functions[activeFunction].icon, { size: 24, className: "mr-2" })}
              {functions[activeFunction].name}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {functions[activeFunction].description}
            </p>
          </div>

          {renderFunctionInterface()}

          {/* Output */}
          {outputText && (
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Output</label>
                <button
                  onClick={copyToClipboard}
                  className="text-primary-500 hover:text-primary-600 transition-colors duration-200"
                >
                  <Copy size={16} />
                </button>
              </div>
              <pre className="whitespace-pre-wrap text-sm font-mono bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700 max-h-96 overflow-y-auto">
                {outputText}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextGenerator;