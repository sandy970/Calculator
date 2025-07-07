import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useMath } from '../context/MathContext';
import { evaluate, pi, e } from 'mathjs';

const { width } = Dimensions.get('window');

const CalculatorScreen = () => {
  const { theme } = useTheme();
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [history, setHistory] = useState([]);
  const [isScientific, setIsScientific] = useState(false);
  const [angleMode, setAngleMode] = useState('deg'); // 'deg' or 'rad'

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
      
      // Add to history
      const calculation = `${currentValue} ${operation} ${inputValue} = ${newValue}`;
      setHistory(prev => [calculation, ...prev].slice(0, 20));
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
      case '×':
        return firstValue * secondValue;
      case '÷':
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

  const handleScientificFunction = (func) => {
    try {
      let value = parseFloat(display);
      let result;
      
      switch (func) {
        case 'sin':
          result = angleMode === 'deg' ? Math.sin(value * Math.PI / 180) : Math.sin(value);
          break;
        case 'cos':
          result = angleMode === 'deg' ? Math.cos(value * Math.PI / 180) : Math.cos(value);
          break;
        case 'tan':
          result = angleMode === 'deg' ? Math.tan(value * Math.PI / 180) : Math.tan(value);
          break;
        case 'asin':
          result = angleMode === 'deg' ? Math.asin(value) * 180 / Math.PI : Math.asin(value);
          break;
        case 'acos':
          result = angleMode === 'deg' ? Math.acos(value) * 180 / Math.PI : Math.acos(value);
          break;
        case 'atan':
          result = angleMode === 'deg' ? Math.atan(value) * 180 / Math.PI : Math.atan(value);
          break;
        case 'log':
          result = Math.log10(value);
          break;
        case 'ln':
          result = Math.log(value);
          break;
        case 'sqrt':
          result = Math.sqrt(value);
          break;
        case 'x²':
          result = value * value;
          break;
        case 'x³':
          result = value * value * value;
          break;
        case '1/x':
          result = 1 / value;
          break;
        case 'x!':
          result = factorial(value);
          break;
        case '10^x':
          result = Math.pow(10, value);
          break;
        case 'e^x':
          result = Math.exp(value);
          break;
        case 'π':
          result = Math.PI;
          break;
        case 'e':
          result = Math.E;
          break;
        default:
          result = value;
      }

      const calculation = `${func}(${value}) = ${result}`;
      setHistory(prev => [calculation, ...prev].slice(0, 20));
      setDisplay(result.toString());
      setWaitingForNewValue(true);
    } catch (error) {
      setDisplay('Error');
      setWaitingForNewValue(true);
    }
  };

  const factorial = (n) => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const handleExpression = () => {
    try {
      const result = evaluate(display);
      const calculation = `${display} = ${result}`;
      setHistory(prev => [calculation, ...prev].slice(0, 20));
      setDisplay(result.toString());
      setWaitingForNewValue(true);
    } catch (error) {
      setDisplay('Error');
      setWaitingForNewValue(true);
    }
  };

  const Button = ({ onPress, style, textStyle, children, type = 'default' }) => {
    const getButtonStyle = () => {
      switch (type) {
        case 'operator':
          return {
            backgroundColor: theme.colors.primary,
          };
        case 'secondary':
          return {
            backgroundColor: theme.colors.secondary,
          };
        case 'accent':
          return {
            backgroundColor: theme.colors.accent,
          };
        case 'scientific':
          return {
            backgroundColor: theme.colors.success,
          };
        default:
          return {
            backgroundColor: theme.colors.surface,
          };
      }
    };

    const getTextColor = () => {
      return type === 'operator' || type === 'accent' || type === 'scientific' ? 'white' : theme.colors.text;
    };

    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.button,
          getButtonStyle(),
          {
            borderColor: theme.colors.border,
            ...theme.shadows.sm,
          },
          style,
        ]}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.buttonText,
            { 
              color: getTextColor(),
              fontSize: type === 'scientific' ? 12 : 18,
            },
            textStyle,
          ]}
        >
          {children}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Display Section */}
        <View style={[styles.displayContainer, { backgroundColor: theme.colors.surface }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.displayScroll}
          >
            <Text
              style={[
                styles.display,
                { color: theme.colors.text },
                theme.typography.h1,
              ]}
              numberOfLines={1}
            >
              {display}
            </Text>
          </ScrollView>
          
          {/* Operation indicator */}
          {operation && (
            <Text style={[styles.operation, { color: theme.colors.textSecondary }]}>
              {previousValue} {operation}
            </Text>
          )}
        </View>

        {/* Mode Toggle */}
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              {
                backgroundColor: !isScientific ? theme.colors.primary : theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
            onPress={() => setIsScientific(false)}
          >
            <Text style={[styles.toggleText, { color: !isScientific ? 'white' : theme.colors.text }]}>
              Basic
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              {
                backgroundColor: isScientific ? theme.colors.primary : theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
            onPress={() => setIsScientific(true)}
          >
            <Text style={[styles.toggleText, { color: isScientific ? 'white' : theme.colors.text }]}>
              Scientific
            </Text>
          </TouchableOpacity>
          {isScientific && (
            <TouchableOpacity
              style={[
                styles.angleButton,
                { backgroundColor: theme.colors.accent, borderColor: theme.colors.border },
              ]}
              onPress={() => setAngleMode(angleMode === 'deg' ? 'rad' : 'deg')}
            >
              <Text style={[styles.toggleText, { color: 'white' }]}>
                {angleMode.toUpperCase()}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Button Grid */}
        <ScrollView style={styles.buttonContainer}>
          {!isScientific ? (
            // Basic Calculator Layout
            <View style={styles.buttonGrid}>
              {/* Row 1 */}
              <View style={styles.buttonRow}>
                <Button onPress={clear} type="secondary" style={styles.wideButton}>
                  Clear
                </Button>
                <Button onPress={deleteLast} type="secondary">
                  ⌫
                </Button>
                <Button onPress={() => handleOperation('÷')} type="operator">
                  ÷
                </Button>
              </View>

              {/* Row 2 */}
              <View style={styles.buttonRow}>
                <Button onPress={() => inputNumber(7)}>7</Button>
                <Button onPress={() => inputNumber(8)}>8</Button>
                <Button onPress={() => inputNumber(9)}>9</Button>
                <Button onPress={() => handleOperation('×')} type="operator">
                  ×
                </Button>
              </View>

              {/* Row 3 */}
              <View style={styles.buttonRow}>
                <Button onPress={() => inputNumber(4)}>4</Button>
                <Button onPress={() => inputNumber(5)}>5</Button>
                <Button onPress={() => inputNumber(6)}>6</Button>
                <Button onPress={() => handleOperation('-')} type="operator">
                  −
                </Button>
              </View>

              {/* Row 4 */}
              <View style={styles.buttonRow}>
                <Button onPress={() => inputNumber(1)}>1</Button>
                <Button onPress={() => inputNumber(2)}>2</Button>
                <Button onPress={() => inputNumber(3)}>3</Button>
                <Button onPress={() => handleOperation('+')} type="operator">
                  +
                </Button>
              </View>

              {/* Row 5 */}
              <View style={styles.buttonRow}>
                <Button onPress={() => inputNumber(0)} style={styles.wideButton}>
                  0
                </Button>
                <Button onPress={inputDecimal}>.</Button>
                <Button onPress={() => handleOperation('=')} type="accent">
                  =
                </Button>
              </View>
            </View>
          ) : (
            // Scientific Calculator Layout
            <View style={styles.scientificGrid}>
              {/* Row 1 - Functions */}
              <View style={styles.buttonRow}>
                <Button onPress={() => handleScientificFunction('sin')} type="scientific">sin</Button>
                <Button onPress={() => handleScientificFunction('cos')} type="scientific">cos</Button>
                <Button onPress={() => handleScientificFunction('tan')} type="scientific">tan</Button>
                <Button onPress={clear} type="secondary">C</Button>
                <Button onPress={deleteLast} type="secondary">⌫</Button>
              </View>

              {/* Row 2 - Inverse Functions */}
              <View style={styles.buttonRow}>
                <Button onPress={() => handleScientificFunction('asin')} type="scientific">asin</Button>
                <Button onPress={() => handleScientificFunction('acos')} type="scientific">acos</Button>
                <Button onPress={() => handleScientificFunction('atan')} type="scientific">atan</Button>
                <Button onPress={() => setDisplay(display + '(')}>(</Button>
                <Button onPress={() => setDisplay(display + ')')}>)</Button>
              </View>

              {/* Row 3 - Log and Power */}
              <View style={styles.buttonRow}>
                <Button onPress={() => handleScientificFunction('log')} type="scientific">log</Button>
                <Button onPress={() => handleScientificFunction('ln')} type="scientific">ln</Button>
                <Button onPress={() => handleScientificFunction('x²')} type="scientific">x²</Button>
                <Button onPress={() => handleScientificFunction('x³')} type="scientific">x³</Button>
                <Button onPress={() => handleScientificFunction('sqrt')} type="scientific">√</Button>
              </View>

              {/* Row 4 - Constants and Operations */}
              <View style={styles.buttonRow}>
                <Button onPress={() => handleScientificFunction('π')} type="scientific">π</Button>
                <Button onPress={() => handleScientificFunction('e')} type="scientific">e</Button>
                <Button onPress={() => handleScientificFunction('x!')} type="scientific">x!</Button>
                <Button onPress={() => handleScientificFunction('1/x')} type="scientific">1/x</Button>
                <Button onPress={() => handleOperation('÷')} type="operator">÷</Button>
              </View>

              {/* Row 5 - Numbers */}
              <View style={styles.buttonRow}>
                <Button onPress={() => inputNumber(7)}>7</Button>
                <Button onPress={() => inputNumber(8)}>8</Button>
                <Button onPress={() => inputNumber(9)}>9</Button>
                <Button onPress={() => handleOperation('×')} type="operator">×</Button>
                <Button onPress={() => handleScientificFunction('10^x')} type="scientific">10^x</Button>
              </View>

              {/* Row 6 */}
              <View style={styles.buttonRow}>
                <Button onPress={() => inputNumber(4)}>4</Button>
                <Button onPress={() => inputNumber(5)}>5</Button>
                <Button onPress={() => inputNumber(6)}>6</Button>
                <Button onPress={() => handleOperation('-')} type="operator">−</Button>
                <Button onPress={() => handleScientificFunction('e^x')} type="scientific">e^x</Button>
              </View>

              {/* Row 7 */}
              <View style={styles.buttonRow}>
                <Button onPress={() => inputNumber(1)}>1</Button>
                <Button onPress={() => inputNumber(2)}>2</Button>
                <Button onPress={() => inputNumber(3)}>3</Button>
                <Button onPress={() => handleOperation('+')} type="operator">+</Button>
                <Button onPress={handleExpression} type="accent">EXP</Button>
              </View>

              {/* Row 8 */}
              <View style={styles.buttonRow}>
                <Button onPress={() => inputNumber(0)} style={styles.wideButton}>0</Button>
                <Button onPress={inputDecimal}>.</Button>
                <Button onPress={() => handleOperation('=')} type="accent">=</Button>
              </View>
            </View>
          )}
        </ScrollView>

        {/* History Section */}
        {history.length > 0 && (
          <View style={[styles.historyContainer, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.historyTitle, { color: theme.colors.text }]}>
              Recent Calculations
            </Text>
            <ScrollView style={styles.historyScroll} showsVerticalScrollIndicator={false}>
              {history.slice(0, 5).map((calc, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.historyItem, { borderBottomColor: theme.colors.border }]}
                  onPress={() => {
                    const result = calc.split(' = ')[1];
                    setDisplay(result);
                  }}
                >
                  <Text style={[styles.historyText, { color: theme.colors.textSecondary }]}>
                    {calc}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  displayContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    minHeight: 100,
    justifyContent: 'center',
  },
  displayScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  display: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  operation: {
    fontSize: 16,
    textAlign: 'right',
    marginTop: 8,
  },
  modeToggle: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  angleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    flex: 1,
  },
  buttonGrid: {
    gap: 12,
  },
  scientificGrid: {
    gap: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    minHeight: 50,
    paddingHorizontal: 4,
  },
  wideButton: {
    flex: 2,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  historyContainer: {
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    maxHeight: 120,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  historyScroll: {
    flex: 1,
  },
  historyItem: {
    paddingVertical: 6,
    borderBottomWidth: 1,
  },
  historyText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
});

export default CalculatorScreen;