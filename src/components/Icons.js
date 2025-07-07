import React from 'react';
import { View } from 'react-native';
import Svg, { 
  Path, 
  Circle, 
  Rect, 
  Line, 
  Polygon,
  G,
  Defs,
  LinearGradient,
  Stop 
} from 'react-native-svg';

const IconWrapper = ({ children, size = 24, color = '#000', focused = false, style = {} }) => (
  <View style={[{ 
    width: size, 
    height: size, 
    justifyContent: 'center', 
    alignItems: 'center',
    opacity: focused ? 1 : 0.7,
  }, style]}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {children}
    </Svg>
  </View>
);

export const CameraIcon = ({ size, color, focused }) => (
  <IconWrapper size={size} color={color} focused={focused}>
    <Path 
      d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle 
      cx="12" 
      cy="13" 
      r="4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

export const CalculatorIcon = ({ size, color, focused }) => (
  <IconWrapper size={size} color={color} focused={focused}>
    <Rect 
      x="4" 
      y="2" 
      width="16" 
      height="20" 
      rx="2"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Line 
      x1="8" 
      y1="6" 
      x2="16" 
      y2="6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Line 
      x1="8" 
      y1="10" 
      x2="8" 
      y2="10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Line 
      x1="12" 
      y1="10" 
      x2="12" 
      y2="10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Line 
      x1="16" 
      y1="10" 
      x2="16" 
      y2="10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Line 
      x1="8" 
      y1="14" 
      x2="8" 
      y2="14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Line 
      x1="12" 
      y1="14" 
      x2="12" 
      y2="14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Line 
      x1="16" 
      y1="14" 
      x2="16" 
      y2="14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Line 
      x1="8" 
      y1="18" 
      x2="12" 
      y2="18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Line 
      x1="16" 
      y1="18" 
      x2="16" 
      y2="18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </IconWrapper>
);

export const BookIcon = ({ size, color, focused }) => (
  <IconWrapper size={size} color={color} focused={focused}>
    <Path 
      d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path 
      d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Line 
      x1="9" 
      y1="7" 
      x2="15" 
      y2="7"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Line 
      x1="9" 
      y1="11" 
      x2="15" 
      y2="11"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </IconWrapper>
);

export const HistoryIcon = ({ size, color, focused }) => (
  <IconWrapper size={size} color={color} focused={focused}>
    <Circle 
      cx="12" 
      cy="12" 
      r="10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path 
      d="M12 6v6l4 2"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

export const SettingsIcon = ({ size, color, focused }) => (
  <IconWrapper size={size} color={color} focused={focused}>
    <Circle 
      cx="12" 
      cy="12" 
      r="3"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path 
      d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

export const ScanIcon = ({ size, color, focused }) => (
  <IconWrapper size={size} color={color} focused={focused}>
    <Path 
      d="M3 7V5a2 2 0 0 1 2-2h2m0 0h4m-4 0V7m12-4h2a2 2 0 0 1 2 2v2m0 0v4m0-4h-4m4 12v2a2 2 0 0 1-2 2h-2m0 0h-4m4 0v-4m-12 4H5a2 2 0 0 1-2-2v-2m0 0v-4m0 4h4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Line 
      x1="12" 
      y1="8" 
      x2="12" 
      y2="16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </IconWrapper>
);

export const HintIcon = ({ size, color, focused }) => (
  <IconWrapper size={size} color={color} focused={focused}>
    <Circle 
      cx="12" 
      cy="12" 
      r="10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path 
      d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Line 
      x1="12" 
      y1="17" 
      x2="12.01" 
      y2="17"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

export const SolutionIcon = ({ size, color, focused }) => (
  <IconWrapper size={size} color={color} focused={focused}>
    <Path 
      d="M9 12l2 2 4-4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle 
      cx="12" 
      cy="12" 
      r="10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

export const FormulaIcon = ({ size, color, focused }) => (
  <IconWrapper size={size} color={color} focused={focused}>
    <Path 
      d="M8 2v4l-2-2M8 6l2-2M16 2l-4 6 4 6M22 12h-6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path 
      d="M2 18h3l1-3 1 3h3"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

export const HeartIcon = ({ size, color, focused }) => (
  <IconWrapper size={size} color={color} focused={focused}>
    <Path 
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

export const SearchIcon = ({ size, color, focused }) => (
  <IconWrapper size={size} color={color} focused={focused}>
    <Circle 
      cx="11" 
      cy="11" 
      r="8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path 
      d="M21 21l-4.35-4.35"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

export const ChevronRightIcon = ({ size, color, focused }) => (
  <IconWrapper size={size} color={color} focused={focused}>
    <Path 
      d="M9 18l6-6-6-6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);