import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useMath } from '../context/MathContext';
import { SearchIcon, ChevronRightIcon, FormulaIcon, HeartIcon } from '../components/Icons';

const FormulasScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { mathDatabase, searchFormulas, favoriteFormulas, addToFavorites } = useMath();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchFormulas(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const SubjectCard = ({ subjectKey, subject }) => (
    <TouchableOpacity
      style={[styles.subjectCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
      onPress={() => navigation.navigate('SubjectDetail', { 
        subjectKey, 
        subjectName: subject.name 
      })}
    >
      <View style={styles.subjectHeader}>
        <FormulaIcon size={24} color={theme.colors.primary} />
        <Text style={[styles.subjectTitle, { color: theme.colors.text }]}>
          {subject.name}
        </Text>
        <ChevronRightIcon size={20} color={theme.colors.textSecondary} />
      </View>
      <Text style={[styles.subjectTopics, { color: theme.colors.textSecondary }]}>
        {Object.keys(subject.topics).length} topics
      </Text>
    </TouchableOpacity>
  );

  const FormulaCard = ({ formula }) => (
    <View style={[styles.formulaCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={styles.formulaHeader}>
        <Text style={[styles.formulaName, { color: theme.colors.text }]}>
          {formula.name}
        </Text>
        <TouchableOpacity onPress={() => addToFavorites(formula)}>
          <HeartIcon size={20} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
      <Text style={[styles.formulaEquation, { color: theme.colors.primary }]}>
        {formula.formula}
      </Text>
      <Text style={[styles.formulaDescription, { color: theme.colors.textSecondary }]}>
        {formula.description}
      </Text>
      <Text style={[styles.formulaSubject, { color: theme.colors.textSecondary }]}>
        {formula.subject} • {formula.topic}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
        <SearchIcon size={20} color={theme.colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Search formulas..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {searchQuery.trim() ? (
          // Search Results
          <View>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Search Results ({searchResults.length})
            </Text>
            {searchResults.map((formula, index) => (
              <FormulaCard key={index} formula={formula} />
            ))}
            {searchResults.length === 0 && (
              <Text style={[styles.noResults, { color: theme.colors.textSecondary }]}>
                No formulas found for "{searchQuery}"
              </Text>
            )}
          </View>
        ) : (
          // Browse by Subject
          <View>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Browse by Subject
            </Text>
            {Object.entries(mathDatabase).map(([subjectKey, subject]) => (
              <SubjectCard 
                key={subjectKey} 
                subjectKey={subjectKey} 
                subject={subject} 
              />
            ))}

            {/* Favorites Section */}
            {favoriteFormulas.length > 0 && (
              <View style={styles.favoritesSection}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  Favorite Formulas
                </Text>
                {favoriteFormulas.map((formula, index) => (
                  <FormulaCard key={`fav-${index}`} formula={formula} />
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  subjectCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  subjectTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  subjectTopics: {
    fontSize: 14,
    marginTop: 8,
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
    marginBottom: 8,
  },
  formulaSubject: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  noResults: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 40,
  },
  favoritesSection: {
    marginTop: 32,
  },
});

export default FormulasScreen;