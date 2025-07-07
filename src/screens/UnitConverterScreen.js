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
import { ChevronRightIcon } from '../components/Icons';

const UnitConverterScreen = () => {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [inputValue, setInputValue] = useState('1');
  const [fromUnit, setFromUnit] = useState(null);
  const [toUnit, setToUnit] = useState(null);
  const [result, setResult] = useState('');

  const categories = {
    length: {
      name: 'Length',
      icon: '📏',
      units: {
        meter: { name: 'Meter', symbol: 'm', factor: 1 },
        kilometer: { name: 'Kilometer', symbol: 'km', factor: 1000 },
        centimeter: { name: 'Centimeter', symbol: 'cm', factor: 0.01 },
        millimeter: { name: 'Millimeter', symbol: 'mm', factor: 0.001 },
        inch: { name: 'Inch', symbol: 'in', factor: 0.0254 },
        foot: { name: 'Foot', symbol: 'ft', factor: 0.3048 },
        yard: { name: 'Yard', symbol: 'yd', factor: 0.9144 },
        mile: { name: 'Mile', symbol: 'mi', factor: 1609.34 },
        nauticalMile: { name: 'Nautical Mile', symbol: 'nmi', factor: 1852 },
      }
    },
    weight: {
      name: 'Weight',
      icon: '⚖️',
      units: {
        kilogram: { name: 'Kilogram', symbol: 'kg', factor: 1 },
        gram: { name: 'Gram', symbol: 'g', factor: 0.001 },
        pound: { name: 'Pound', symbol: 'lb', factor: 0.453592 },
        ounce: { name: 'Ounce', symbol: 'oz', factor: 0.0283495 },
        ton: { name: 'Metric Ton', symbol: 't', factor: 1000 },
        stone: { name: 'Stone', symbol: 'st', factor: 6.35029 },
        shortTon: { name: 'Short Ton', symbol: 'ton', factor: 907.185 },
        longTon: { name: 'Long Ton', symbol: 'long ton', factor: 1016.05 },
      }
    },
    temperature: {
      name: 'Temperature',
      icon: '🌡️',
      units: {
        celsius: { name: 'Celsius', symbol: '°C' },
        fahrenheit: { name: 'Fahrenheit', symbol: '°F' },
        kelvin: { name: 'Kelvin', symbol: 'K' },
        rankine: { name: 'Rankine', symbol: '°R' },
      }
    },
    volume: {
      name: 'Volume',
      icon: '🥤',
      units: {
        liter: { name: 'Liter', symbol: 'L', factor: 1 },
        milliliter: { name: 'Milliliter', symbol: 'mL', factor: 0.001 },
        gallon: { name: 'Gallon (US)', symbol: 'gal', factor: 3.78541 },
        gallonUK: { name: 'Gallon (UK)', symbol: 'gal (UK)', factor: 4.54609 },
        quart: { name: 'Quart', symbol: 'qt', factor: 0.946353 },
        pint: { name: 'Pint', symbol: 'pt', factor: 0.473176 },
        cup: { name: 'Cup', symbol: 'cup', factor: 0.236588 },
        fluidOunce: { name: 'Fluid Ounce', symbol: 'fl oz', factor: 0.0295735 },
        cubicMeter: { name: 'Cubic Meter', symbol: 'm³', factor: 1000 },
      }
    },
    area: {
      name: 'Area',
      icon: '🔲',
      units: {
        squareMeter: { name: 'Square Meter', symbol: 'm²', factor: 1 },
        squareKilometer: { name: 'Square Kilometer', symbol: 'km²', factor: 1000000 },
        squareCentimeter: { name: 'Square Centimeter', symbol: 'cm²', factor: 0.0001 },
        squareInch: { name: 'Square Inch', symbol: 'in²', factor: 0.00064516 },
        squareFoot: { name: 'Square Foot', symbol: 'ft²', factor: 0.092903 },
        squareYard: { name: 'Square Yard', symbol: 'yd²', factor: 0.836127 },
        acre: { name: 'Acre', symbol: 'ac', factor: 4046.86 },
        hectare: { name: 'Hectare', symbol: 'ha', factor: 10000 },
      }
    },
    time: {
      name: 'Time',
      icon: '⏰',
      units: {
        second: { name: 'Second', symbol: 's', factor: 1 },
        minute: { name: 'Minute', symbol: 'min', factor: 60 },
        hour: { name: 'Hour', symbol: 'h', factor: 3600 },
        day: { name: 'Day', symbol: 'd', factor: 86400 },
        week: { name: 'Week', symbol: 'wk', factor: 604800 },
        month: { name: 'Month', symbol: 'mo', factor: 2629746 },
        year: { name: 'Year', symbol: 'yr', factor: 31556952 },
        decade: { name: 'Decade', symbol: 'decade', factor: 315569520 },
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
      case 'rankine':
        celsius = (value - 491.67) * 5/9;
        break;
      default:
        celsius = value;
    }
    
    // Convert from Celsius to target
    switch (to) {
      case 'celsius':
        return celsius;
      case 'fahrenheit':
        return celsius * 9/5 + 32;
      case 'kelvin':
        return celsius + 273.15;
      case 'rankine':
        return celsius * 9/5 + 491.67;
      default:
        return celsius;
    }
  };

  const convertUnits = () => {
    if (!fromUnit || !toUnit || !inputValue) {
      Alert.alert('Error', 'Please select units and enter a value');
      return;
    }

    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      Alert.alert('Error', 'Please enter a valid number');
      return;
    }

    let convertedValue;

    if (selectedCategory === 'temperature') {
      convertedValue = convertTemperature(value, fromUnit, toUnit);
    } else {
      const category = categories[selectedCategory];
      const fromFactor = category.units[fromUnit].factor;
      const toFactor = category.units[toUnit].factor;
      
      // Convert to base unit, then to target unit
      const baseValue = value * fromFactor;
      convertedValue = baseValue / toFactor;
    }

    setResult(convertedValue.toString());
  };

  const swapUnits = () => {
    if (fromUnit && toUnit) {
      const tempUnit = fromUnit;
      setFromUnit(toUnit);
      setToUnit(tempUnit);
      
      if (result) {
        setInputValue(result);
        convertUnits();
      }
    }
  };

  const CategoryCard = ({ categoryKey, category }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
      onPress={() => {
        setSelectedCategory(categoryKey);
        setFromUnit(null);
        setToUnit(null);
        setResult('');
      }}
    >
      <Text style={styles.categoryIcon}>{category.icon}</Text>
      <Text style={[styles.categoryName, { color: theme.colors.text }]}>
        {category.name}
      </Text>
      <ChevronRightIcon size={20} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );

  const UnitSelector = ({ label, selectedUnit, onSelect }) => (
    <View style={styles.unitSelector}>
      <Text style={[styles.unitLabel, { color: theme.colors.text }]}>
        {label}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.unitScroll}
      >
        {Object.entries(categories[selectedCategory].units).map(([key, unit]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.unitButton,
              {
                backgroundColor: selectedUnit === key ? theme.colors.primary : theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
            onPress={() => onSelect(key)}
          >
            <Text
              style={[
                styles.unitButtonText,
                { color: selectedUnit === key ? 'white' : theme.colors.text },
              ]}
            >
              {unit.name}
            </Text>
            <Text
              style={[
                styles.unitSymbol,
                { color: selectedUnit === key ? 'white' : theme.colors.textSecondary },
              ]}
            >
              {unit.symbol}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  if (!selectedCategory) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ScrollView contentContainerStyle={styles.categoriesContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Unit Converter
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Select a category to convert units
          </Text>
          
          {Object.entries(categories).map(([key, category]) => (
            <CategoryCard key={key} categoryKey={key} category={category} />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

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
          {categories[selectedCategory].name} Converter
        </Text>
      </View>

      <ScrollView style={styles.converterContainer}>
        {/* Input Section */}
        <View style={[styles.inputSection, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
            Enter Value
          </Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.colors.background,
              color: theme.colors.text,
              borderColor: theme.colors.border
            }]}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="Enter value to convert"
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        {/* From Unit Selector */}
        <UnitSelector
          label="From"
          selectedUnit={fromUnit}
          onSelect={setFromUnit}
        />

        {/* Swap Button */}
        <View style={styles.swapContainer}>
          <TouchableOpacity
            style={[styles.swapButton, { backgroundColor: theme.colors.accent }]}
            onPress={swapUnits}
          >
            <Text style={styles.swapButtonText}>⇅ Swap</Text>
          </TouchableOpacity>
        </View>

        {/* To Unit Selector */}
        <UnitSelector
          label="To"
          selectedUnit={toUnit}
          onSelect={setToUnit}
        />

        {/* Convert Button */}
        <TouchableOpacity
          style={[styles.convertButton, { backgroundColor: theme.colors.primary }]}
          onPress={convertUnits}
        >
          <Text style={styles.convertButtonText}>Convert</Text>
        </TouchableOpacity>

        {/* Result */}
        {result ? (
          <View style={[styles.resultContainer, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.resultLabel, { color: theme.colors.textSecondary }]}>
              Result
            </Text>
            <Text style={[styles.resultValue, { color: theme.colors.text }]}>
              {result}
            </Text>
            <Text style={[styles.resultUnit, { color: theme.colors.textSecondary }]}>
              {categories[selectedCategory].units[toUnit]?.name || ''}
            </Text>
          </View>
        ) : null}

        {/* Quick Reference */}
        <View style={[styles.referenceContainer, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.referenceTitle, { color: theme.colors.text }]}>
            Quick Reference
          </Text>
          {Object.entries(categories[selectedCategory].units).slice(0, 4).map(([key, unit]) => (
            <View key={key} style={styles.referenceItem}>
              <Text style={[styles.referenceName, { color: theme.colors.text }]}>
                {unit.name}
              </Text>
              <Text style={[styles.referenceSymbol, { color: theme.colors.textSecondary }]}>
                {unit.symbol}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoriesContainer: {
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
  converterContainer: {
    flex: 1,
    padding: 16,
  },
  inputSection: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
  },
  unitSelector: {
    marginBottom: 16,
  },
  unitLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  unitScroll: {
    flexDirection: 'row',
  },
  unitButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 100,
  },
  unitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  unitSymbol: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  swapContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  swapButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  swapButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  convertButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 16,
  },
  convertButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  resultLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultUnit: {
    fontSize: 16,
  },
  referenceContainer: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  referenceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  referenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  referenceName: {
    fontSize: 16,
  },
  referenceSymbol: {
    fontSize: 16,
    fontFamily: 'monospace',
  },
});

export default UnitConverterScreen;