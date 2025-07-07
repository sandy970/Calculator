import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { evaluate } from 'mathjs';
import { ChevronRightIcon, FormulaIcon } from '../components/Icons';

const FormulaCalculatorScreen = () => {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [customFormula, setCustomFormula] = useState('');
  const [variables, setVariables] = useState({});
  const [result, setResult] = useState('');
  const [savedFormulas, setSavedFormulas] = useState([]);

  const formulaCategories = {
    basic: {
      name: 'Basic Formulas',
      icon: '🧮',
      formulas: {
        quadratic: {
          name: 'Quadratic Formula',
          formula: '(-b + sqrt(b^2 - 4*a*c)) / (2*a)',
          description: 'Solves ax² + bx + c = 0',
          variables: ['a', 'b', 'c'],
          example: 'a=1, b=-5, c=6'
        },
        distance: {
          name: 'Distance Formula',
          formula: 'sqrt((x2-x1)^2 + (y2-y1)^2)',
          description: 'Distance between two points',
          variables: ['x1', 'y1', 'x2', 'y2'],
          example: 'x1=0, y1=0, x2=3, y2=4'
        },
        pythagorean: {
          name: 'Pythagorean Theorem',
          formula: 'sqrt(a^2 + b^2)',
          description: 'Find hypotenuse of right triangle',
          variables: ['a', 'b'],
          example: 'a=3, b=4'
        }
      }
    },
    geometry: {
      name: 'Geometry',
      icon: '📐',
      formulas: {
        circleArea: {
          name: 'Circle Area',
          formula: 'pi * r^2',
          description: 'Area of a circle',
          variables: ['r'],
          example: 'r=5'
        },
        rectangleArea: {
          name: 'Rectangle Area',
          formula: 'length * width',
          description: 'Area of a rectangle',
          variables: ['length', 'width'],
          example: 'length=10, width=5'
        },
        triangleArea: {
          name: 'Triangle Area',
          formula: '0.5 * base * height',
          description: 'Area of a triangle',
          variables: ['base', 'height'],
          example: 'base=8, height=6'
        },
        sphereVolume: {
          name: 'Sphere Volume',
          formula: '(4/3) * pi * r^3',
          description: 'Volume of a sphere',
          variables: ['r'],
          example: 'r=3'
        },
        cylinderVolume: {
          name: 'Cylinder Volume',
          formula: 'pi * r^2 * h',
          description: 'Volume of a cylinder',
          variables: ['r', 'h'],
          example: 'r=2, h=10'
        }
      }
    },
    physics: {
      name: 'Physics',
      icon: '⚗️',
      formulas: {
        velocity: {
          name: 'Velocity',
          formula: 'distance / time',
          description: 'Average velocity',
          variables: ['distance', 'time'],
          example: 'distance=100, time=5'
        },
        acceleration: {
          name: 'Acceleration',
          formula: '(vf - vi) / time',
          description: 'Average acceleration',
          variables: ['vf', 'vi', 'time'],
          example: 'vf=20, vi=5, time=3'
        },
        force: {
          name: 'Force (Newton\'s 2nd Law)',
          formula: 'mass * acceleration',
          description: 'Force = mass × acceleration',
          variables: ['mass', 'acceleration'],
          example: 'mass=10, acceleration=9.8'
        },
        kineticEnergy: {
          name: 'Kinetic Energy',
          formula: '0.5 * mass * velocity^2',
          description: 'Kinetic energy of moving object',
          variables: ['mass', 'velocity'],
          example: 'mass=5, velocity=10'
        }
      }
    },
    finance: {
      name: 'Finance',
      icon: '💰',
      formulas: {
        simpleInterest: {
          name: 'Simple Interest',
          formula: 'principal * rate * time',
          description: 'Simple interest calculation',
          variables: ['principal', 'rate', 'time'],
          example: 'principal=1000, rate=0.05, time=2'
        },
        compoundInterest: {
          name: 'Compound Interest',
          formula: 'principal * (1 + rate)^time',
          description: 'Compound interest calculation',
          variables: ['principal', 'rate', 'time'],
          example: 'principal=1000, rate=0.05, time=2'
        },
        monthlyPayment: {
          name: 'Monthly Payment',
          formula: '(principal * rate * (1 + rate)^months) / ((1 + rate)^months - 1)',
          description: 'Monthly loan payment',
          variables: ['principal', 'rate', 'months'],
          example: 'principal=10000, rate=0.005, months=36'
        }
      }
    }
  };

  const extractVariables = (formula) => {
    // Extract variables from formula (simple regex for alphanumeric variables)
    const matches = formula.match(/\b[a-zA-Z][a-zA-Z0-9]*\b/g) || [];
    const constants = ['pi', 'e', 'sqrt', 'sin', 'cos', 'tan', 'log', 'ln', 'abs', 'floor', 'ceil', 'round'];
    return [...new Set(matches.filter(match => !constants.includes(match)))];
  };

  const evaluateFormula = (formula, vars) => {
    try {
      // Replace variables in formula with their values
      let processedFormula = formula;
      
      Object.entries(vars).forEach(([variable, value]) => {
        const regex = new RegExp(`\\b${variable}\\b`, 'g');
        processedFormula = processedFormula.replace(regex, value);
      });

      // Replace common mathematical functions and constants
      processedFormula = processedFormula.replace(/\bpi\b/g, 'pi');
      processedFormula = processedFormula.replace(/\be\b/g, 'e');
      
      const result = evaluate(processedFormula);
      return result;
    } catch (error) {
      throw new Error('Invalid formula or variables');
    }
  };

  const calculateResult = () => {
    const formula = selectedCategory === 'custom' ? customFormula : getSelectedFormula()?.formula;
    
    if (!formula) {
      Alert.alert('Error', 'Please enter a formula');
      return;
    }

    const requiredVars = extractVariables(formula);
    const missingVars = requiredVars.filter(v => !variables[v] || variables[v] === '');
    
    if (missingVars.length > 0) {
      Alert.alert('Error', `Please provide values for: ${missingVars.join(', ')}`);
      return;
    }

    try {
      const numericVars = {};
      Object.entries(variables).forEach(([key, value]) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          throw new Error(`Invalid value for ${key}: ${value}`);
        }
        numericVars[key] = numValue;
      });

      const calculatedResult = evaluateFormula(formula, numericVars);
      setResult(calculatedResult.toString());
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const getSelectedFormula = () => {
    if (selectedCategory === 'custom') return null;
    const [categoryKey, formulaKey] = selectedCategory.split('.');
    return formulaCategories[categoryKey]?.formulas[formulaKey];
  };

  const loadFormula = (categoryKey, formulaKey) => {
    const formula = formulaCategories[categoryKey].formulas[formulaKey];
    setSelectedCategory(`${categoryKey}.${formulaKey}`);
    
    // Parse example values
    const exampleVars = {};
    if (formula.example) {
      formula.example.split(', ').forEach(pair => {
        const [key, value] = pair.split('=');
        if (key && value) {
          exampleVars[key.trim()] = value.trim();
        }
      });
    }
    setVariables(exampleVars);
    setResult('');
  };

  const loadCustomFormula = () => {
    setSelectedCategory('custom');
    const vars = extractVariables(customFormula);
    const newVariables = {};
    vars.forEach(v => {
      newVariables[v] = variables[v] || '';
    });
    setVariables(newVariables);
    setResult('');
  };

  const saveFormula = () => {
    if (!customFormula.trim()) {
      Alert.alert('Error', 'Please enter a formula to save');
      return;
    }

    Alert.prompt(
      'Save Formula',
      'Enter a name for this formula:',
      (name) => {
        if (name && name.trim()) {
          const newFormula = {
            id: Date.now(),
            name: name.trim(),
            formula: customFormula,
            variables: extractVariables(customFormula)
          };
          setSavedFormulas([...savedFormulas, newFormula]);
          Alert.alert('Success', 'Formula saved successfully!');
        }
      }
    );
  };

  const loadSavedFormula = (savedFormula) => {
    setCustomFormula(savedFormula.formula);
    setSelectedCategory('custom');
    const newVariables = {};
    savedFormula.variables.forEach(v => {
      newVariables[v] = '';
    });
    setVariables(newVariables);
    setResult('');
  };

  const CategoryCard = ({ categoryKey, category }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
      onPress={() => setSelectedCategory(categoryKey)}
    >
      <Text style={styles.categoryIcon}>{category.icon}</Text>
      <Text style={[styles.categoryName, { color: theme.colors.text }]}>
        {category.name}
      </Text>
      <ChevronRightIcon size={20} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );

  const FormulaCard = ({ categoryKey, formulaKey, formula }) => (
    <TouchableOpacity
      style={[styles.formulaCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
      onPress={() => loadFormula(categoryKey, formulaKey)}
    >
      <View style={styles.formulaInfo}>
        <Text style={[styles.formulaName, { color: theme.colors.text }]}>
          {formula.name}
        </Text>
        <Text style={[styles.formulaEquation, { color: theme.colors.primary }]}>
          {formula.formula}
        </Text>
        <Text style={[styles.formulaDescription, { color: theme.colors.textSecondary }]}>
          {formula.description}
        </Text>
        <Text style={[styles.formulaExample, { color: theme.colors.textSecondary }]}>
          Example: {formula.example}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (!selectedCategory) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ScrollView contentContainerStyle={styles.mainContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Formula Calculator
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Calculate with mathematical formulas
          </Text>
          
          {/* Custom Formula Section */}
          <View style={[styles.customSection, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Custom Formula
            </Text>
            <TextInput
              style={[styles.formulaInput, { 
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                borderColor: theme.colors.border
              }]}
              value={customFormula}
              onChangeText={setCustomFormula}
              placeholder="Enter your formula (e.g., a*x^2 + b*x + c)"
              placeholderTextColor={theme.colors.textSecondary}
              multiline
            />
            <View style={styles.customButtonRow}>
              <TouchableOpacity
                style={[styles.customButton, { backgroundColor: theme.colors.primary }]}
                onPress={loadCustomFormula}
                disabled={!customFormula.trim()}
              >
                <Text style={styles.customButtonText}>Use Formula</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.customButton, { backgroundColor: theme.colors.accent }]}
                onPress={saveFormula}
                disabled={!customFormula.trim()}
              >
                <Text style={styles.customButtonText}>Save Formula</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Saved Formulas */}
          {savedFormulas.length > 0 && (
            <View style={[styles.savedSection, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Saved Formulas
              </Text>
              {savedFormulas.map((formula) => (
                <TouchableOpacity
                  key={formula.id}
                  style={[styles.savedFormulaCard, { borderColor: theme.colors.border }]}
                  onPress={() => loadSavedFormula(formula)}
                >
                  <Text style={[styles.savedFormulaName, { color: theme.colors.text }]}>
                    {formula.name}
                  </Text>
                  <Text style={[styles.savedFormulaEquation, { color: theme.colors.primary }]}>
                    {formula.formula}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          {/* Pre-built Categories */}
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Pre-built Formulas
          </Text>
          {Object.entries(formulaCategories).map(([key, category]) => (
            <CategoryCard key={key} categoryKey={key} category={category} />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (selectedCategory !== 'custom' && !selectedCategory.includes('.')) {
    // Show formulas in selected category
    const category = formulaCategories[selectedCategory];
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: theme.colors.surface }]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[styles.backButtonText, { color: theme.colors.primary }]}>
              ← Back
            </Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            {category.name}
          </Text>
        </View>

        <ScrollView style={styles.formulasList}>
          {Object.entries(category.formulas).map(([key, formula]) => (
            <FormulaCard 
              key={key} 
              categoryKey={selectedCategory} 
              formulaKey={key} 
              formula={formula} 
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Show calculator interface
  const currentFormula = selectedCategory === 'custom' ? 
    { formula: customFormula, variables: extractVariables(customFormula) } : 
    getSelectedFormula();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.colors.surface }]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[styles.backButtonText, { color: theme.colors.primary }]}>
            ← Back
          </Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {selectedCategory === 'custom' ? 'Custom Formula' : currentFormula?.name}
        </Text>
      </View>

      <ScrollView style={styles.calculatorContainer}>
        {/* Formula Display */}
        <View style={[styles.formulaDisplay, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.formulaLabel, { color: theme.colors.text }]}>
            Formula:
          </Text>
          <Text style={[styles.formulaText, { color: theme.colors.primary }]}>
            {currentFormula?.formula}
          </Text>
          {currentFormula?.description && (
            <Text style={[styles.formulaDesc, { color: theme.colors.textSecondary }]}>
              {currentFormula.description}
            </Text>
          )}
        </View>

        {/* Variables Input */}
        <View style={[styles.variablesSection, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.variablesTitle, { color: theme.colors.text }]}>
            Variable Values
          </Text>
          {currentFormula?.variables?.map((variable) => (
            <View key={variable} style={styles.variableRow}>
              <Text style={[styles.variableLabel, { color: theme.colors.text }]}>
                {variable}:
              </Text>
              <TextInput
                style={[styles.variableInput, { 
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.border
                }]}
                value={variables[variable] || ''}
                onChangeText={(value) => setVariables({...variables, [variable]: value})}
                placeholder="Enter value"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="numeric"
              />
            </View>
          ))}
        </View>

        {/* Calculate Button */}
        <TouchableOpacity
          style={[styles.calculateButton, { backgroundColor: theme.colors.primary }]}
          onPress={calculateResult}
        >
          <Text style={styles.calculateButtonText}>Calculate</Text>
        </TouchableOpacity>

        {/* Result */}
        {result ? (
          <View style={[styles.resultContainer, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.resultLabel, { color: theme.colors.text }]}>
              Result:
            </Text>
            <Text style={[styles.resultValue, { color: theme.colors.success }]}>
              {result}
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  customSection: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  formulaInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  customButtonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  customButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  customButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  savedSection: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  savedFormulaCard: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  savedFormulaName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  savedFormulaEquation: {
    fontSize: 14,
    fontFamily: 'monospace',
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  formulasList: {
    flex: 1,
    padding: 16,
  },
  formulaCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  formulaInfo: {
    flex: 1,
  },
  formulaName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  formulaEquation: {
    fontSize: 16,
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  formulaDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  formulaExample: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  calculatorContainer: {
    flex: 1,
    padding: 16,
  },
  formulaDisplay: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  formulaLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  formulaText: {
    fontSize: 18,
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  formulaDesc: {
    fontSize: 14,
  },
  variablesSection: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  variablesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  variableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  variableLabel: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 40,
    marginRight: 12,
  },
  variableInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  calculateButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  calculateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
});

export default FormulaCalculatorScreen;