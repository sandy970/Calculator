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
import { HistoryIcon, ChevronRightIcon } from '../components/Icons';

const HistoryScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { history } = useMath();

  const HistoryItem = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.historyItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
      onPress={() => navigation.navigate('SolutionDetail', { solution: item })}
    >
      <View style={styles.historyHeader}>
        <Text style={[styles.problemType, { color: theme.colors.primary }]}>
          {item.type.replace('_', ' ').toUpperCase()}
        </Text>
        <Text style={[styles.timestamp, { color: theme.colors.textSecondary }]}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </View>
      
      <Text style={[styles.problemText, { color: theme.colors.text }]} numberOfLines={2}>
        {item.problem}
      </Text>
      
      <View style={styles.historyFooter}>
        <Text style={[styles.stepsCount, { color: theme.colors.textSecondary }]}>
          {item.steps.length} steps
        </Text>
        <ChevronRightIcon size={16} color={theme.colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  if (history.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.emptyState}>
          <HistoryIcon size={64} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            No History Yet
          </Text>
          <Text style={[styles.emptyMessage, { color: theme.colors.textSecondary }]}>
            Start solving math problems to see your solution history here
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => <HistoryItem item={item} index={index} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  historyItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  problemType: {
    fontSize: 12,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
  },
  problemText: {
    fontSize: 16,
    marginBottom: 12,
    fontFamily: 'monospace',
  },
  historyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepsCount: {
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default HistoryScreen;