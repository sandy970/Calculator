import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { SolutionIcon } from '../components/Icons';

const SolutionDetailScreen = ({ route }) => {
  const { theme } = useTheme();
  const { solution } = route.params;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Problem Header */}
        <View style={[styles.problemHeader, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.problemType, { color: theme.colors.primary }]}>
            {solution.type.replace('_', ' ').toUpperCase()}
          </Text>
          <Text style={[styles.problemText, { color: theme.colors.text }]}>
            {solution.problem}
          </Text>
          <Text style={[styles.timestamp, { color: theme.colors.textSecondary }]}>
            Solved on {new Date(solution.timestamp).toLocaleDateString()} at{' '}
            {new Date(solution.timestamp).toLocaleTimeString()}
          </Text>
        </View>

        {/* Solution Steps */}
        <View style={[styles.solutionContainer, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.solutionHeader}>
            <SolutionIcon size={24} color={theme.colors.success} />
            <Text style={[styles.solutionTitle, { color: theme.colors.text }]}>
              Step-by-Step Solution
            </Text>
          </View>

          {solution.fullSteps?.map((step, index) => (
            <View key={index} style={styles.stepContainer}>
              <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={[styles.stepText, { color: theme.colors.text }]}>
                {step}
              </Text>
            </View>
          )) || solution.steps.map((step, index) => (
            <View key={index} style={styles.stepContainer}>
              <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={[styles.stepText, { color: theme.colors.text }]}>
                {step}
              </Text>
            </View>
          ))}
        </View>

        {/* Additional Info */}
        <View style={[styles.infoContainer, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
            Problem Information
          </Text>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
              Problem Type:
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {solution.type.replace('_', ' ')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
              Steps Count:
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {solution.steps.length}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
              Solution Type:
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {solution.isHint ? 'Hint' : 'Full Solution'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  problemHeader: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  problemType: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  problemText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    fontFamily: 'monospace',
  },
  timestamp: {
    fontSize: 14,
  },
  solutionContainer: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  solutionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  solutionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  infoContainer: {
    padding: 20,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SolutionDetailScreen;