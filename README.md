# MathSolver Pro 📱🧮

> **Advanced Math Problem Solver with Camera Integration**

A comprehensive mobile application that uses camera OCR to scan math problems and provides step-by-step solutions with hints. Built with React Native Expo for cross-platform deployment to iOS and Android app stores.

![App Store Ready](https://img.shields.io/badge/App%20Store-Ready-green)
![React Native](https://img.shields.io/badge/React%20Native-Expo-blue)
![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-lightgrey)

## 🌟 Features

### 📸 **Smart Camera Scanner**
- **Math Problem Recognition**: Point camera at any math problem for instant recognition
- **OCR Integration**: Advanced text extraction from images
- **Multiple Input Sources**: Camera capture or photo library selection
- **Real-time Processing**: Fast math problem detection and analysis

### 🤖 **AI-Powered Solutions**
- **Step-by-Step Solutions**: Detailed breakdown of problem-solving process
- **Smart Hints**: Get helpful hints before full solutions
- **Problem Classification**: Automatic categorization (Algebra, Geometry, Calculus, etc.)
- **Multiple Solution Methods**: Different approaches for complex problems

### 📚 **Comprehensive Formula Database**
- **Math Subjects**: Algebra, Geometry, Trigonometry, Calculus
- **Searchable Formulas**: Find formulas by name, description, or subject
- **LaTeX Rendering**: Beautiful mathematical notation display
- **Favorites System**: Save frequently used formulas

### 🧮 **Built-in Calculator**
- **Scientific Calculator**: Advanced mathematical functions
- **History Tracking**: Recent calculations with replay functionality
- **Multiple Modes**: Basic and scientific calculation modes
- **Responsive Design**: Optimized for touch interaction

### 📱 **Premium Mobile Experience**
- **Cross-Platform**: iOS, Android, and Web support
- **Dark/Light Theme**: Automatic and manual theme switching
- **Offline Capable**: Core features work without internet
- **App Store Ready**: Configured for production deployment

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac only) or Android Studio

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sandy970/MathSolverPro.git
   cd MathSolverPro
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

4. **Run on specific platform:**
   ```bash
   # iOS (Mac only)
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## 📱 App Store Deployment

### iOS App Store
1. Build for iOS: `expo build:ios`
2. Configure app.json with bundle identifier and permissions
3. Submit to App Store using Application Loader or Xcode

### Google Play Store
1. Build for Android: `expo build:android`
2. Generate signed APK with keystore
3. Upload to Play Console with store listing

## 🏗️ Tech Stack

- **React Native Expo**: Cross-platform development
- **React Navigation**: Screen navigation
- **Context API**: State management
- **Expo Camera**: Camera integration
- **Math.js**: Mathematical computations
- **React Native SVG**: Vector graphics

## 📖 Usage

### Camera Scanner
1. Launch app and allow camera permissions
2. Point camera at math problem
3. Choose hint or full solution
4. View step-by-step breakdown

### Calculator
1. Switch to Calculator tab
2. Perform calculations with touch interface
3. View calculation history
4. Replay previous calculations

### Formula Browser
1. Open Formulas tab
2. Browse by subject or search
3. Add formulas to favorites
4. View detailed explanations

## 🔧 Configuration

### Camera Permissions
Camera and photo library permissions are configured in `app.json`:

```json
"plugins": [
  ["expo-camera", {
    "cameraPermission": "Allow access to camera for scanning math problems."
  }]
]
```

### OCR Integration
For production, integrate with:
- **Google Vision API**: Robust text detection
- **MathPix API**: Specialized math OCR
- **Tesseract.js**: Client-side OCR

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Support

- **GitHub Issues**: [Report bugs and feature requests](https://github.com/sandy970/MathSolverPro/issues)
- **Email**: support@mathsolverpro.com

---

**Built with ❤️ for students, teachers, and math enthusiasts worldwide**

*Transform the way you learn and solve mathematics with AI-powered assistance!*