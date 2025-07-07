import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
  Modal,
  ScrollView,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useMath } from '../context/MathContext';
import { ScanIcon, HintIcon, SolutionIcon } from '../components/Icons';

const { width, height } = Dimensions.get('window');

const CameraScreen = () => {
  const { theme } = useTheme();
  const { solveProblem, isLoading, currentProblem, getFullSolution } = useMath();
  
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(cameraStatus.status === 'granted' && mediaLibraryStatus.status === 'granted');
    })();
  }, []);

  // Mock OCR function - In production, you would integrate with Google Vision API, Tesseract, or MathPix
  const extractTextFromImage = async (imageUri) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock math problems for demonstration
    const mockProblems = [
      "2x + 5 = 15",
      "x² - 4x + 4 = 0",
      "sin(30°) = ?",
      "√(16) + 3²",
      "∫x² dx",
      "Find the area of a circle with radius 5",
      "3 + 4 × 2 - 1",
      "cos(60°) = ?",
      "2/3 + 1/4 = ?",
      "y = mx + b, find m when y=10, x=2, b=3"
    ];
    
    return mockProblems[Math.floor(Math.random() * mockProblems.length)];
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        setCapturedImage(photo.uri);
        await processImage(photo.uri);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture. Please try again.');
        console.error('Camera error:', error);
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setCapturedImage(result.assets[0].uri);
        await processImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      console.error('Image picker error:', error);
    }
  };

  const processImage = async (imageUri) => {
    setIsProcessing(true);
    try {
      // Extract text using OCR
      const extractedText = await extractTextFromImage(imageUri);
      
      if (extractedText && extractedText.trim()) {
        // Show solution options
        setShowSolutionModal(true);
      } else {
        Alert.alert(
          'No Math Problem Found',
          'We couldn\'t detect a math problem in this image. Please try again with a clearer image.'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process image. Please try again.');
      console.error('Image processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGetHint = async () => {
    try {
      // Use mock extracted text for demonstration
      const mockText = "2x + 5 = 15";
      await solveProblem(mockText, true);
      setShowSolutionModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate hint. Please try again.');
    }
  };

  const handleGetSolution = async () => {
    try {
      // Use mock extracted text for demonstration
      const mockText = "2x + 5 = 15";
      await solveProblem(mockText, false);
      setShowSolutionModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate solution. Please try again.');
    }
  };

  const handleShowFullSolution = () => {
    if (currentProblem && currentProblem.isHint) {
      getFullSolution(currentProblem.id);
    }
  };

  const retakePicture = () => {
    setCapturedImage(null);
    setShowSolutionModal(false);
  };

  if (hasPermission === null) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Requesting camera permission...
        </Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.text }]}>
          Camera permission is required to scan math problems.
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={() => Camera.requestCameraPermissionsAsync()}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {!capturedImage ? (
        <>
          {/* Camera View */}
          <View style={styles.cameraContainer}>
            <Camera
              ref={cameraRef}
              style={styles.camera}
              type={cameraType}
              flashMode={flashMode}
              ratio="16:9"
            >
              {/* Camera Overlay */}
              <View style={styles.overlay}>
                <Text style={styles.instructionText}>
                  Point camera at a math problem
                </Text>
                
                {/* Scan Frame */}
                <View style={styles.scanFrame}>
                  <View style={[styles.corner, styles.topLeft]} />
                  <View style={[styles.corner, styles.topRight]} />
                  <View style={[styles.corner, styles.bottomLeft]} />
                  <View style={[styles.corner, styles.bottomRight]} />
                </View>
              </View>
            </Camera>
          </View>

          {/* Bottom Controls */}
          <View style={[styles.controls, { backgroundColor: theme.colors.surface }]}>
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: theme.colors.background }]}
              onPress={pickImage}
            >
              <Text style={[styles.controlButtonText, { color: theme.colors.text }]}>
                Gallery
              </Text>
            </TouchableOpacity>

            {/* Capture Button */}
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
              disabled={isProcessing}
            >
              <LinearGradient
                colors={theme.colors.gradient}
                style={styles.captureButtonGradient}
              >
                <ScanIcon size={32} color="white" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: theme.colors.background }]}
              onPress={() => setFlashMode(
                flashMode === Camera.Constants.FlashMode.off
                  ? Camera.Constants.FlashMode.on
                  : Camera.Constants.FlashMode.off
              )}
            >
              <Text style={[styles.controlButtonText, { color: theme.colors.text }]}>
                Flash
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          {/* Preview Image */}
          <View style={styles.previewContainer}>
            <Image source={{ uri: capturedImage }} style={styles.previewImage} />
            {isProcessing && (
              <View style={styles.processingOverlay}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={[styles.processingText, { color: theme.colors.text }]}>
                  Analyzing math problem...
                </Text>
              </View>
            )}
          </View>

          {/* Preview Controls */}
          <View style={[styles.previewControls, { backgroundColor: theme.colors.surface }]}>
            <TouchableOpacity
              style={[styles.previewButton, { backgroundColor: theme.colors.background }]}
              onPress={retakePicture}
            >
              <Text style={[styles.previewButtonText, { color: theme.colors.text }]}>
                Retake
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Solution Options Modal */}
      <Modal
        visible={showSolutionModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Math Problem Detected!
            </Text>
            <Text style={[styles.modalSubtitle, { color: theme.colors.textSecondary }]}>
              What would you like to do?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.warning }]}
                onPress={handleGetHint}
              >
                <HintIcon size={24} color="white" />
                <Text style={styles.modalButtonText}>Get Hint</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.success }]}
                onPress={handleGetSolution}
              >
                <SolutionIcon size={24} color="white" />
                <Text style={styles.modalButtonText}>Full Solution</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowSolutionModal(false)}
            >
              <Text style={[styles.modalCancelText, { color: theme.colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Solution Display */}
      {currentProblem && (
        <View style={[styles.solutionContainer, { backgroundColor: theme.colors.surface }]}>
          <ScrollView style={styles.solutionScroll}>
            <Text style={[styles.solutionTitle, { color: theme.colors.text }]}>
              {currentProblem.isHint ? 'Hint' : 'Solution'}
            </Text>
            <Text style={[styles.problemText, { color: theme.colors.textSecondary }]}>
              {currentProblem.problem}
            </Text>
            
            {currentProblem.steps.map((step, index) => (
              <View key={index} style={styles.stepContainer}>
                <Text style={[styles.stepNumber, { color: theme.colors.primary }]}>
                  {index + 1}.
                </Text>
                <Text style={[styles.stepText, { color: theme.colors.text }]}>
                  {step}
                </Text>
              </View>
            ))}

            {currentProblem.isHint && (
              <TouchableOpacity
                style={[styles.fullSolutionButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleShowFullSolution}
              >
                <Text style={styles.fullSolutionButtonText}>
                  Show Full Solution
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  instructionText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 50,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  scanFrame: {
    width: width * 0.8,
    height: 200,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: 'white',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  controlButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonGradient: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContainer: {
    flex: 1,
    position: 'relative',
  },
  previewImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  previewControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  previewButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  previewButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    padding: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
    gap: 10,
    minWidth: 140,
    justifyContent: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalCancelButton: {
    paddingVertical: 10,
  },
  modalCancelText: {
    fontSize: 16,
  },
  solutionContainer: {
    maxHeight: height * 0.4,
    margin: 10,
    borderRadius: 15,
    padding: 15,
  },
  solutionScroll: {
    flex: 1,
  },
  solutionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  problemText: {
    fontSize: 16,
    marginBottom: 15,
    fontStyle: 'italic',
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    marginTop: 2,
  },
  stepText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 24,
  },
  fullSolutionButton: {
    marginTop: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  fullSolutionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CameraScreen;