# Advanced Calculator

A comprehensive calculator application with multiple modes including basic arithmetic, scientific functions, unit conversions, mathematical formula evaluation, and text generation utilities.

## Features

### 🧮 Basic Calculator
- Standard arithmetic operations (+, -, ×, ÷)
- Decimal point support
- Clear and backspace functionality
- Responsive button layout

### 🔬 Scientific Calculator
- Trigonometric functions (sin, cos, tan, etc.)
- Logarithmic functions (log, ln)
- Mathematical constants (π, e)
- Power and root operations
- Calculation history
- Support for complex expressions

### 📐 Formula Calculator
- Input custom mathematical formulas
- Variable substitution
- LaTeX formula rendering
- Pre-built common formulas:
  - Quadratic Formula
  - Distance Formula
  - Area and Volume calculations
  - Compound Interest
  - Pythagorean Theorem
- Save and load custom formulas

### 🔄 Unit Converter
- **Length**: meter, kilometer, inch, foot, yard, mile, etc.
- **Weight**: kilogram, gram, pound, ounce, ton, stone
- **Temperature**: Celsius, Fahrenheit, Kelvin
- **Volume**: liter, gallon, quart, pint, cup, fluid ounce
- **Area**: square meter, acre, hectare, square foot, etc.
- **Time**: second, minute, hour, day, week, month, year
- Quick conversion references
- Swap units functionality

### 📝 Text Generator
- **Password Generator**: Customizable length and character types
- **Hash Generator**: Simple text hashing
- **Case Converter**: UPPER, lower, Title Case, camelCase, snake_case, kebab-case
- **Lorem Ipsum Generator**: Placeholder text generation
- **Random Text Generator**: Various random text types
- **Text Analysis**: Word count, character analysis, reading time estimation

## Technology Stack

- **Frontend**: React 18
- **Styling**: Tailwind CSS
- **Mathematics**: Math.js for advanced calculations
- **LaTeX Rendering**: KaTeX and react-katex
- **Icons**: Lucide React
- **Build Tool**: Create React App

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/advanced-calculator.git
   cd advanced-calculator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## Usage

### Basic Calculator
- Click numbers and operators to build expressions
- Use the equals button to calculate results
- Clear button resets the calculator
- Delete button removes the last character

### Scientific Calculator
- Use function buttons (sin, cos, log, etc.) to add mathematical functions
- Mathematical constants (π, e) are available
- Supports complex expressions with parentheses
- View calculation history on the right panel

### Formula Calculator
- Enter mathematical formulas using standard notation
- Variables are automatically detected and input fields are created
- Use the formula library to load common formulas
- Save frequently used formulas for later use

### Unit Converter
- Select a category (Length, Weight, Temperature, etc.)
- Choose source and target units
- Enter a value and click Convert
- Use the swap button to reverse the conversion

### Text Generator
- Choose from various text generation and manipulation tools
- Generate secure passwords with customizable options
- Convert text between different case formats
- Analyze text for statistics and properties

## Development

### Project Structure
```
src/
├── components/
│   ├── BasicCalculator.js
│   ├── ScientificCalculator.js
│   ├── FormulaCalculator.js
│   ├── UnitConverter.js
│   └── TextGenerator.js
├── App.js
├── index.js
└── index.css
```

### Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App (irreversible)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Screenshots

The application features a modern, responsive design with:
- Clean, intuitive interface
- Dark/light theme support
- Responsive layout for mobile and desktop
- Smooth animations and transitions
- Accessible button layouts

## Future Enhancements

- [ ] Scientific graphing capabilities
- [ ] More unit conversion categories
- [ ] Export calculation history
- [ ] Keyboard shortcuts
- [ ] Theme customization
- [ ] More text analysis features
- [ ] Formula sharing functionality

## Support

If you encounter any issues or have questions, please open an issue on GitHub or contact the development team.

---

Built with ❤️ using React, Tailwind CSS, and Math.js