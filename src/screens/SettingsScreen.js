import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { SettingsIcon, ChevronRightIcon } from '../components/Icons';

const SettingsScreen = () => {
  const { theme, isDark, toggleTheme } = useTheme();

  const SettingItem = ({ title, subtitle, onPress, rightComponent, showChevron = true }) => (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightComponent || (showChevron && onPress && (
        <ChevronRightIcon size={20} color={theme.colors.textSecondary} />
      ))}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Appearance
          </Text>
          <SettingItem
            title="Dark Mode"
            subtitle="Toggle between light and dark themes"
            rightComponent={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={isDark ? theme.colors.primaryLight : theme.colors.surface}
              />
            }
            showChevron={false}
          />
        </View>

        {/* Math Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Math Settings
          </Text>
          <SettingItem
            title="Decimal Places"
            subtitle="Number of decimal places in results"
          />
          <SettingItem
            title="Angle Units"
            subtitle="Degrees or Radians for trigonometry"
          />
          <SettingItem
            title="Step-by-Step Detail"
            subtitle="How detailed solution steps should be"
          />
        </View>

        {/* Camera Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Camera
          </Text>
          <SettingItem
            title="Auto-Capture"
            subtitle="Automatically capture when math problem detected"
          />
          <SettingItem
            title="Image Quality"
            subtitle="Higher quality for better OCR accuracy"
          />
        </View>

        {/* Help & Support */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Help & Support
          </Text>
          <SettingItem
            title="Tutorial"
            subtitle="Learn how to use MathSolver Pro"
          />
          <SettingItem
            title="Feedback"
            subtitle="Send us your feedback and suggestions"
          />
          <SettingItem
            title="Report a Bug"
            subtitle="Help us improve the app"
          />
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            About
          </Text>
          <SettingItem
            title="Version"
            subtitle="1.0.0"
            showChevron={false}
          />
          <SettingItem
            title="Privacy Policy"
            subtitle="How we handle your data"
          />
          <SettingItem
            title="Terms of Service"
            subtitle="Usage terms and conditions"
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            Made with ❤️ for math learners everywhere
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  footer: {
    padding: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default SettingsScreen;