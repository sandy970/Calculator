import React from 'react';
import { 
  createBottomTabNavigator 
} from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

// Import icons
import { 
  CameraIcon, 
  BookIcon, 
  HistoryIcon, 
  CalculatorIcon, 
  SettingsIcon,
  ConvertIcon,
  TextIcon,
  ScienceIcon,
  ChevronRightIcon
} from '../components/Icons';

// Import screens (we'll create these)
import CameraScreen from '../screens/CameraScreen';
import CalculatorScreen from '../screens/CalculatorScreen';
import FormulasScreen from '../screens/FormulasScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SolutionDetailScreen from '../screens/SolutionDetailScreen';
import SubjectDetailScreen from '../screens/SubjectDetailScreen';
import UnitConverterScreen from '../screens/UnitConverterScreen';
import TextGeneratorScreen from '../screens/TextGeneratorScreen';
import FormulaCalculatorScreen from '../screens/FormulaCalculatorScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Tools main screen component
const ToolsMainScreen = ({ navigation }) => {
  const { theme } = useTheme();
  
  const tools = [
    {
      name: 'Unit Converter',
      icon: <ConvertIcon size={24} color={theme.colors.primary} />,
      description: 'Convert between different units',
      screen: 'UnitConverter',
    },
    {
      name: 'Text Generator',
      icon: <TextIcon size={24} color={theme.colors.primary} />,
      description: 'Generate and manipulate text',
      screen: 'TextGenerator',
    },
    {
      name: 'Formula Calculator',
      icon: <ScienceIcon size={24} color={theme.colors.primary} />,
      description: 'Interactive formula calculator',
      screen: 'FormulaCalculator',
    },
  ];

  const ToolCard = ({ tool }) => (
    <TouchableOpacity
      style={[
        styles.toolCard,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={() => navigation.navigate(tool.screen)}
    >
      {tool.icon}
      <View style={styles.toolInfo}>
        <Text style={[styles.toolName, { color: theme.colors.text }]}>
          {tool.name}
        </Text>
        <Text style={[styles.toolDescription, { color: theme.colors.textSecondary }]}>
          {tool.description}
        </Text>
      </View>
      <ChevronRightIcon size={20} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.toolsContainer}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Math Tools
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Choose from our collection of math tools
        </Text>
        
        {tools.map((tool, index) => (
          <ToolCard key={index} tool={tool} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

// Stack navigator for Tools section
const ToolsStack = () => {
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
        name="ToolsList" 
        component={ToolsMainScreen} 
        options={{ title: 'Math Tools' }}
      />
      <Stack.Screen 
        name="UnitConverter" 
        component={UnitConverterScreen} 
        options={{ title: 'Unit Converter' }}
      />
      <Stack.Screen 
        name="TextGenerator" 
        component={TextGeneratorScreen} 
        options={{ title: 'Text Generator' }}
      />
      <Stack.Screen 
        name="FormulaCalculator" 
        component={FormulaCalculatorScreen} 
        options={{ title: 'Formula Calculator' }}
      />
    </Stack.Navigator>
  );
};

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
            case 'Tools':
              IconComponent = ScienceIcon;
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
        name="Tools" 
        component={ToolsStack} 
        options={{ 
          title: 'Tools',
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolsContainer: {
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
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  toolInfo: {
    flex: 1,
    marginLeft: 16,
  },
  toolName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  toolDescription: {
    fontSize: 14,
  },
});

export default AppNavigator;