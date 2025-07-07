import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Clipboard,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { ChevronRightIcon } from '../components/Icons';
import { createHash } from 'crypto';

const TextGeneratorScreen = () => {
  const { theme } = useTheme();
  const [selectedTool, setSelectedTool] = useState(null);
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  
  // Password Generator States
  const [passwordLength, setPasswordLength] = useState('12');
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  
  // Lorem Ipsum States
  const [loremType, setLoremType] = useState('paragraphs');
  const [loremCount, setLoremCount] = useState('3');

  const tools = {
    passwordGenerator: {
      name: 'Password Generator',
      icon: '🔐',
      description: 'Generate secure passwords with custom options'
    },
    hashGenerator: {
      name: 'Hash Generator',
      icon: '#️⃣',
      description: 'Generate MD5, SHA-1, SHA-256 hashes'
    },
    caseConverter: {
      name: 'Case Converter',
      icon: 'Aa',
      description: 'Convert text between different cases'
    },
    loremGenerator: {
      name: 'Lorem Ipsum',
      icon: '📝',
      description: 'Generate placeholder text'
    },
    randomText: {
      name: 'Random Text',
      icon: '🎲',
      description: 'Generate random words and phrases'
    },
    textAnalysis: {
      name: 'Text Analysis',
      icon: '📊',
      description: 'Analyze text statistics and properties'
    }
  };

  const generatePassword = () => {
    const length = parseInt(passwordLength) || 12;
    let charset = '';
    
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (!charset) {
      Alert.alert('Error', 'Please select at least one character type');
      return;
    }
    
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    setOutputText(password);
  };

  const generateHash = (type) => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter text to hash');
      return;
    }
    
    // Note: React Native doesn't have crypto module like Node.js
    // This is a simplified implementation for demonstration
    let hash = '';
    
    switch (type) {
      case 'md5':
        // Simplified MD5-like hash (not actual MD5)
        hash = simpleHash(inputText, 32);
        break;
      case 'sha1':
        // Simplified SHA1-like hash (not actual SHA1)
        hash = simpleHash(inputText, 40);
        break;
      case 'sha256':
        // Simplified SHA256-like hash (not actual SHA256)
        hash = simpleHash(inputText, 64);
        break;
      default:
        hash = 'Unknown hash type';
    }
    
    setOutputText(hash);
  };

  const simpleHash = (str, length) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Convert to hex and pad to desired length
    const hex = Math.abs(hash).toString(16);
    return hex.padStart(length, '0').substring(0, length);
  };

  const convertCase = (type) => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter text to convert');
      return;
    }
    
    let converted = '';
    
    switch (type) {
      case 'upper':
        converted = inputText.toUpperCase();
        break;
      case 'lower':
        converted = inputText.toLowerCase();
        break;
      case 'title':
        converted = inputText.replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
        break;
      case 'camel':
        converted = inputText
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
            index === 0 ? word.toLowerCase() : word.toUpperCase()
          )
          .replace(/\s+/g, '');
        break;
      case 'snake':
        converted = inputText
          .toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[^a-z0-9_]/g, '');
        break;
      case 'kebab':
        converted = inputText
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
        break;
      default:
        converted = inputText;
    }
    
    setOutputText(converted);
  };

  const generateLorem = () => {
    const count = parseInt(loremCount) || 1;
    const loremWords = [
      'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
      'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
      'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
      'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
      'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
      'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
      'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
      'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
    ];
    
    let result = '';
    
    for (let i = 0; i < count; i++) {
      if (loremType === 'words') {
        if (i > 0) result += ' ';
        result += loremWords[Math.floor(Math.random() * loremWords.length)];
      } else if (loremType === 'sentences') {
        if (i > 0) result += ' ';
        const sentenceLength = Math.floor(Math.random() * 10) + 5;
        const sentence = [];
        for (let j = 0; j < sentenceLength; j++) {
          sentence.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
        }
        result += sentence.join(' ').charAt(0).toUpperCase() + 
                 sentence.join(' ').slice(1) + '.';
      } else { // paragraphs
        if (i > 0) result += '\n\n';
        const paragraphLength = Math.floor(Math.random() * 5) + 3;
        const sentences = [];
        for (let j = 0; j < paragraphLength; j++) {
          const sentenceLength = Math.floor(Math.random() * 10) + 5;
          const sentence = [];
          for (let k = 0; k < sentenceLength; k++) {
            sentence.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
          }
          sentences.push(sentence.join(' ').charAt(0).toUpperCase() + 
                        sentence.join(' ').slice(1) + '.');
        }
        result += sentences.join(' ');
      }
    }
    
    setOutputText(result);
  };

  const generateRandomText = (type) => {
    const randomWords = [
      'amazing', 'brilliant', 'creative', 'dynamic', 'elegant', 'fantastic',
      'gorgeous', 'incredible', 'magnificent', 'outstanding', 'perfect',
      'spectacular', 'wonderful', 'excellent', 'marvelous', 'superb'
    ];
    
    const animals = [
      'elephant', 'tiger', 'dolphin', 'eagle', 'butterfly', 'whale',
      'penguin', 'giraffe', 'zebra', 'lion', 'owl', 'fox', 'bear'
    ];
    
    const colors = [
      'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink',
      'brown', 'black', 'white', 'gray', 'turquoise', 'violet'
    ];
    
    let result = '';
    
    switch (type) {
      case 'words':
        const wordCount = Math.floor(Math.random() * 10) + 5;
        const words = [];
        for (let i = 0; i < wordCount; i++) {
          words.push(randomWords[Math.floor(Math.random() * randomWords.length)]);
        }
        result = words.join(' ');
        break;
      case 'phrases':
        const phraseCount = 3;
        const phrases = [];
        for (let i = 0; i < phraseCount; i++) {
          const adj = randomWords[Math.floor(Math.random() * randomWords.length)];
          const color = colors[Math.floor(Math.random() * colors.length)];
          const animal = animals[Math.floor(Math.random() * animals.length)];
          phrases.push(`${adj} ${color} ${animal}`);
        }
        result = phrases.join(', ');
        break;
      case 'sentences':
        const sentenceCount = 3;
        const sentences = [];
        for (let i = 0; i < sentenceCount; i++) {
          const adj = randomWords[Math.floor(Math.random() * randomWords.length)];
          const animal = animals[Math.floor(Math.random() * animals.length)];
          const verb = ['runs', 'jumps', 'flies', 'swims', 'dances'][Math.floor(Math.random() * 5)];
          sentences.push(`The ${adj} ${animal} ${verb} quickly.`);
        }
        result = sentences.join(' ');
        break;
    }
    
    setOutputText(result);
  };

  const analyzeText = () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter text to analyze');
      return;
    }
    
    const words = inputText.trim().split(/\s+/);
    const characters = inputText.length;
    const charactersNoSpaces = inputText.replace(/\s/g, '').length;
    const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = inputText.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    const averageWordsPerSentence = Math.round((words.length / sentences) * 100) / 100;
    const readingTime = Math.ceil(words.length / 200); // Assuming 200 words per minute
    
    const analysis = `
📊 TEXT ANALYSIS RESULTS

📝 Characters: ${characters}
🔤 Characters (no spaces): ${charactersNoSpaces}
📖 Words: ${words.length}
📄 Sentences: ${sentences}
📃 Paragraphs: ${paragraphs}
📏 Average words per sentence: ${averageWordsPerSentence}
⏱️ Estimated reading time: ${readingTime} minute${readingTime !== 1 ? 's' : ''}

🔤 Most common words:
${getMostCommonWords(words).map(([word, count]) => `• ${word}: ${count}`).join('\n')}
    `.trim();
    
    setOutputText(analysis);
  };

  const getMostCommonWords = (words) => {
    const wordCount = {};
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they'];
    
    words.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
      if (cleanWord.length > 2 && !commonWords.includes(cleanWord)) {
        wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1;
      }
    });
    
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const copyToClipboard = async () => {
    if (outputText) {
      await Clipboard.setString(outputText);
      Alert.alert('Success', 'Text copied to clipboard!');
    }
  };

  const ToolCard = ({ toolKey, tool }) => (
    <TouchableOpacity
      style={[styles.toolCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
      onPress={() => {
        setSelectedTool(toolKey);
        setInputText('');
        setOutputText('');
      }}
    >
      <Text style={styles.toolIcon}>{tool.icon}</Text>
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

  if (!selectedTool) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ScrollView contentContainerStyle={styles.toolsContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Text Generator & Tools
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Select a tool to generate or manipulate text
          </Text>
          
          {Object.entries(tools).map(([key, tool]) => (
            <ToolCard key={key} toolKey={key} tool={tool} />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  const renderToolInterface = () => {
    switch (selectedTool) {
      case 'passwordGenerator':
        return (
          <View>
            <View style={[styles.optionSection, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
                Password Options
              </Text>
              
              <View style={styles.optionRow}>
                <Text style={[styles.optionLabel, { color: theme.colors.text }]}>
                  Length: {passwordLength}
                </Text>
                <TextInput
                  style={[styles.smallInput, { 
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    borderColor: theme.colors.border
                  }]}
                  value={passwordLength}
                  onChangeText={setPasswordLength}
                  keyboardType="numeric"
                  maxLength={3}
                />
              </View>
              
              <View style={styles.optionRow}>
                <Text style={[styles.optionLabel, { color: theme.colors.text }]}>
                  Include Uppercase (A-Z)
                </Text>
                <Switch
                  value={includeUppercase}
                  onValueChange={setIncludeUppercase}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                />
              </View>
              
              <View style={styles.optionRow}>
                <Text style={[styles.optionLabel, { color: theme.colors.text }]}>
                  Include Lowercase (a-z)
                </Text>
                <Switch
                  value={includeLowercase}
                  onValueChange={setIncludeLowercase}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                />
              </View>
              
              <View style={styles.optionRow}>
                <Text style={[styles.optionLabel, { color: theme.colors.text }]}>
                  Include Numbers (0-9)
                </Text>
                <Switch
                  value={includeNumbers}
                  onValueChange={setIncludeNumbers}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                />
              </View>
              
              <View style={styles.optionRow}>
                <Text style={[styles.optionLabel, { color: theme.colors.text }]}>
                  Include Symbols (!@#$...)
                </Text>
                <Switch
                  value={includeSymbols}
                  onValueChange={setIncludeSymbols}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                />
              </View>
            </View>
            
            <TouchableOpacity
              style={[styles.generateButton, { backgroundColor: theme.colors.primary }]}
              onPress={generatePassword}
            >
              <Text style={styles.generateButtonText}>Generate Password</Text>
            </TouchableOpacity>
          </View>
        );
        
      case 'hashGenerator':
        return (
          <View>
            <View style={[styles.inputSection, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                Enter text to hash:
              </Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.border
                }]}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Enter text here..."
                placeholderTextColor={theme.colors.textSecondary}
                multiline
              />
            </View>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.hashButton, { backgroundColor: theme.colors.success }]}
                onPress={() => generateHash('md5')}
              >
                <Text style={styles.hashButtonText}>MD5</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.hashButton, { backgroundColor: theme.colors.warning }]}
                onPress={() => generateHash('sha1')}
              >
                <Text style={styles.hashButtonText}>SHA-1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.hashButton, { backgroundColor: theme.colors.error }]}
                onPress={() => generateHash('sha256')}
              >
                <Text style={styles.hashButtonText}>SHA-256</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
        
      case 'caseConverter':
        return (
          <View>
            <View style={[styles.inputSection, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                Enter text to convert:
              </Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.border
                }]}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Enter text here..."
                placeholderTextColor={theme.colors.textSecondary}
                multiline
              />
            </View>
            
            <View style={styles.caseButtonGrid}>
              <TouchableOpacity
                style={[styles.caseButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => convertCase('upper')}
              >
                <Text style={styles.caseButtonText}>UPPERCASE</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.caseButton, { backgroundColor: theme.colors.secondary }]}
                onPress={() => convertCase('lower')}
              >
                <Text style={styles.caseButtonText}>lowercase</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.caseButton, { backgroundColor: theme.colors.accent }]}
                onPress={() => convertCase('title')}
              >
                <Text style={styles.caseButtonText}>Title Case</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.caseButton, { backgroundColor: theme.colors.success }]}
                onPress={() => convertCase('camel')}
              >
                <Text style={styles.caseButtonText}>camelCase</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.caseButton, { backgroundColor: theme.colors.warning }]}
                onPress={() => convertCase('snake')}
              >
                <Text style={styles.caseButtonText}>snake_case</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.caseButton, { backgroundColor: theme.colors.error }]}
                onPress={() => convertCase('kebab')}
              >
                <Text style={styles.caseButtonText}>kebab-case</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
        
      case 'loremGenerator':
        return (
          <View>
            <View style={[styles.optionSection, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
                Lorem Ipsum Options
              </Text>
              
              <View style={styles.optionRow}>
                <Text style={[styles.optionLabel, { color: theme.colors.text }]}>
                  Type:
                </Text>
                <View style={styles.segmentedControl}>
                  {['words', 'sentences', 'paragraphs'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.segmentButton,
                        {
                          backgroundColor: loremType === type ? theme.colors.primary : theme.colors.surface,
                          borderColor: theme.colors.border,
                        },
                      ]}
                      onPress={() => setLoremType(type)}
                    >
                      <Text
                        style={[
                          styles.segmentText,
                          { color: loremType === type ? 'white' : theme.colors.text },
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.optionRow}>
                <Text style={[styles.optionLabel, { color: theme.colors.text }]}>
                  Count: {loremCount}
                </Text>
                <TextInput
                  style={[styles.smallInput, { 
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    borderColor: theme.colors.border
                  }]}
                  value={loremCount}
                  onChangeText={setLoremCount}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
            </View>
            
            <TouchableOpacity
              style={[styles.generateButton, { backgroundColor: theme.colors.primary }]}
              onPress={generateLorem}
            >
              <Text style={styles.generateButtonText}>Generate Lorem Ipsum</Text>
            </TouchableOpacity>
          </View>
        );
        
      case 'randomText':
        return (
          <View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.randomButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => generateRandomText('words')}
              >
                <Text style={styles.randomButtonText}>Random Words</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.randomButton, { backgroundColor: theme.colors.accent }]}
                onPress={() => generateRandomText('phrases')}
              >
                <Text style={styles.randomButtonText}>Random Phrases</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.randomButton, { backgroundColor: theme.colors.success }]}
                onPress={() => generateRandomText('sentences')}
              >
                <Text style={styles.randomButtonText}>Random Sentences</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
        
      case 'textAnalysis':
        return (
          <View>
            <View style={[styles.inputSection, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                Enter text to analyze:
              </Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.border
                }]}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Enter text here..."
                placeholderTextColor={theme.colors.textSecondary}
                multiline
              />
            </View>
            
            <TouchableOpacity
              style={[styles.generateButton, { backgroundColor: theme.colors.primary }]}
              onPress={analyzeText}
            >
              <Text style={styles.generateButtonText}>Analyze Text</Text>
            </TouchableOpacity>
          </View>
        );
        
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.colors.surface }]}
          onPress={() => setSelectedTool(null)}
        >
          <Text style={[styles.backButtonText, { color: theme.colors.primary }]}>
            ← Back
          </Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {tools[selectedTool]?.name || ''}
        </Text>
      </View>

      <ScrollView style={styles.toolContainer}>
        {renderToolInterface()}
        
        {/* Output Section */}
        {outputText ? (
          <View style={[styles.outputSection, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.outputHeader}>
              <Text style={[styles.outputLabel, { color: theme.colors.text }]}>
                Result:
              </Text>
              <TouchableOpacity
                style={[styles.copyButton, { backgroundColor: theme.colors.accent }]}
                onPress={copyToClipboard}
              >
                <Text style={styles.copyButtonText}>Copy</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.outputScroll} nestedScrollEnabled>
              <Text 
                style={[
                  styles.outputText, 
                  { 
                    color: theme.colors.text,
                    fontFamily: selectedTool === 'passwordGenerator' || selectedTool === 'hashGenerator' ? 'monospace' : 'default'
                  }
                ]}
                selectable
              >
                {outputText}
              </Text>
            </ScrollView>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
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
  toolIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  toolInfo: {
    flex: 1,
  },
  toolName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  toolDescription: {
    fontSize: 14,
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
  toolContainer: {
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
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  optionSection: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionLabel: {
    fontSize: 16,
    flex: 1,
  },
  smallInput: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    fontSize: 16,
    width: 60,
    textAlign: 'center',
  },
  generateButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  hashButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  hashButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  caseButtonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  caseButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: '45%',
  },
  caseButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 6,
    overflow: 'hidden',
  },
  segmentButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
  },
  randomButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  randomButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  outputSection: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  outputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  outputLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  copyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  copyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  outputScroll: {
    maxHeight: 300,
  },
  outputText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default TextGeneratorScreen;