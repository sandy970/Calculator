import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useMath } from '../context/MathContext';
import { FormulaIcon, HeartIcon } from '../components/Icons';

const SubjectDetailScreen = ({ route }) => {
  const { theme } = useTheme();
  const { getSubjectFormulas, addToFavorites } = useMath();
  const { subjectKey, subjectName } = route.params;
  
  const subjectData = getSubjectFormulas(subjectKey);

  const FormulaCard = ({ formula, topicName }) => (
    <View style={[styles.formulaCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={styles.formulaHeader}>
        <Text style={[styles.formulaName, { color: theme.colors.text }]}>
          {formula.name}
        </Text>
        <TouchableOpacity onPress={() => addToFavorites({ ...formula, subject: subjectName, topic: topicName })}>
          <HeartIcon size={20} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
      <Text style={[styles.formulaEquation, { color: theme.colors.primary }]}>
        {formula.formula}
      </Text>
      <Text style={[styles.formulaDescription, { color: theme.colors.textSecondary }]}>
        {formula.description}
      </Text>
    </View>
  );

  const TopicSection = ({ topicKey, topic }) => (
    <View style={styles.topicSection}>
      <Text style={[styles.topicTitle, { color: theme.colors.text }]}>
        {topic.name}
      </Text>
      {topic.formulas.map((formula, index) => (
        <FormulaCard 
          key={index} 
          formula={formula} 
          topicName={topic.name}
        />
      ))}
    </View>
  );

  if (!subjectData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorState}>
          <Text style={[styles.errorText, { color: theme.colors.text }]}>
            Subject not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Subject Header */}
        <View style={[styles.subjectHeader, { backgroundColor: theme.colors.surface }]}>
          <FormulaIcon size={32} color={theme.colors.primary} />
          <View style={styles.subjectInfo}>
            <Text style={[styles.subjectTitle, { color: theme.colors.text }]}>
              {subjectData.name}
            </Text>
            <Text style={[styles.subjectStats, { color: theme.colors.textSecondary }]}>
              {Object.keys(subjectData.topics).length} topics • {' '}
              {Object.values(subjectData.topics).reduce((total, topic) => total + topic.formulas.length, 0)} formulas
            </Text>
          </View>
        </View>

        {/* Topics and Formulas */}
        {Object.entries(subjectData.topics).map(([topicKey, topic]) => (
          <TopicSection 
            key={topicKey} 
            topicKey={topicKey} 
            topic={topic} 
          />
        ))}
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
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    gap: 16,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subjectStats: {
    fontSize: 14,
  },
  topicSection: {
    marginBottom: 32,
  },
  topicTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  formulaCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  formulaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  formulaName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  formulaEquation: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  formulaDescription: {
    fontSize: 14,
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
  },
});

export default SubjectDetailScreen;