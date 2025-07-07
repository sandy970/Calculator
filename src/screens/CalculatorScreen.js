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

const { width } = Dimensions.get('window');

const CalculatorScreen = () => {
  const { theme } = useTheme();
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [history, setHistory] = useState([]);

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
        default:
          return {
            backgroundColor: theme.colors.surface,
          };
      }
    };

    const getTextColor = () => {
      return type === 'operator' || type === 'accent' ? 'white' : theme.colors.text;
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
            { color: getTextColor() },
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

        {/* Button Grid */}
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
    marginBottom: 20,
    minHeight: 120,
    justifyContent: 'center',
  },
  displayScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  display: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  operation: {
    fontSize: 16,
    textAlign: 'right',
    marginTop: 8,
  },
  buttonGrid: {
    flex: 1,
    gap: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  button: {
    flex: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    minHeight: 60,
  },
  wideButton: {
    flex: 2,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '600',
  },
  historyContainer: {
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    maxHeight: 150,
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
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  historyText: {
    fontSize: 14,
    fontFamily: 'monospace',
  },
});

export default CalculatorScreen;