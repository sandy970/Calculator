import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';

// Import icons (we'll create simple icon components)
import { CameraIcon, BookIcon, HistoryIcon, CalculatorIcon, SettingsIcon } from '../components/Icons';

// Import screens (we'll create these)
import CameraScreen from '../screens/CameraScreen';
import CalculatorScreen from '../screens/CalculatorScreen';
import FormulasScreen from '../screens/FormulasScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SolutionDetailScreen from '../screens/SolutionDetailScreen';
import SubjectDetailScreen from '../screens/SubjectDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigator for Formulas section
const FormulasStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="FormulasList" 
        component={FormulasScreen} 
        options={{ title: 'Math Formulas' }}
      />
      <Stack.Screen 
        name="SubjectDetail" 
        component={SubjectDetailScreen} 
        options={({ route }) => ({ title: route.params?.subjectName || 'Subject' })}
      />
    </Stack.Navigator>
  );
};

// Stack navigator for History section
const HistoryStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="HistoryList" 
        component={HistoryScreen} 
        options={{ title: 'Solution History' }}
      />
      <Stack.Screen 
        name="SolutionDetail" 
        component={SolutionDetailScreen} 
        options={{ title: 'Solution Details' }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let IconComponent;

          switch (route.name) {
            case 'Camera':
              IconComponent = CameraIcon;
              break;
            case 'Calculator':
              IconComponent = CalculatorIcon;
              break;
            case 'Formulas':
              IconComponent = BookIcon;
              break;
            case 'History':
              IconComponent = HistoryIcon;
              break;
            case 'Settings':
              IconComponent = SettingsIcon;
              break;
            default:
              IconComponent = () => <View />;
          }

          return <IconComponent size={size} color={color} focused={focused} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingVertical: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 5,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
          shadowColor: theme.colors.border,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen 
        name="Camera" 
        component={CameraScreen} 
        options={{ 
          title: 'Scan Problem',
          headerTitle: 'Math Solver Pro'
        }} 
      />
      <Tab.Screen 
        name="Calculator" 
        component={CalculatorScreen} 
        options={{ 
          title: 'Calculator',
          headerTitle: 'Calculator'
        }} 
      />
      <Tab.Screen 
        name="Formulas" 
        component={FormulasStack} 
        options={{ 
          title: 'Formulas',
          headerShown: false
        }} 
      />
      <Tab.Screen 
        name="History" 
        component={HistoryStack} 
        options={{ 
          title: 'History',
          headerShown: false
        }} 
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ 
          title: 'Settings',
          headerTitle: 'Settings'
        }} 
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;