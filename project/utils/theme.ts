import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';

const colors = {
  primary: {
    50: '#EBF5FF',
    100: '#D6EBFF',
    200: '#ADD6FF',
    300: '#85C0FF',
    400: '#5CA9FF',
    500: '#0A84FF', // Primary
    600: '#0070E0',
    700: '#005BBD',
    800: '#00469A',
    900: '#003577',
  },
  success: {
    50: '#EDFAF0',
    100: '#D6F5DF',
    200: '#ADEBBF',
    300: '#85E0A0',
    400: '#5CD680',
    500: '#30D158', // Success
    600: '#26B648',
    700: '#1D9C39',
    800: '#14812B',
    900: '#0B661D',
  },
  warning: {
    50: '#FFF9EB',
    100: '#FFF3D6',
    200: '#FFE7AD',
    300: '#FFDA85',
    400: '#FFCD5C',
    500: '#FF9F0A', // Warning
    600: '#F08700',
    700: '#CC7100',
    800: '#A85B00',
    900: '#854800',
  },
  error: {
    50: '#FDEEEE',
    100: '#FBDEDE',
    200: '#F7BCBD',
    300: '#F39A9C',
    400: '#F0787A',
    500: '#FF453A', // Error
    600: '#E03A30',
    700: '#BC3029',
    800: '#992722',
    900: '#771E1B',
  },
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

const fontWeights = {
  normal: '400',
  medium: '500',
  bold: '700',
};

const spacing = {
  '0': 0,
  '0.5': 2,
  '1': 4,
  '2': 8,
  '3': 12,
  '4': 16,
  '5': 20,
  '6': 24,
  '8': 32,
  '10': 40,
  '12': 48,
  '16': 64,
  '20': 80,
  '24': 96,
  '32': 128,
};

const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

const fontFamily = Platform.select({
  ios: {
    regular: 'Poppins-Regular',
    medium: 'Poppins-Medium',
    bold: 'Poppins-Bold',
  },
  android: {
    regular: 'Poppins-Regular',
    medium: 'Poppins-Medium',
    bold: 'Poppins-Bold',
  },
  default: {
    regular: 'Poppins-Regular',
    medium: 'Poppins-Medium',
    bold: 'Poppins-Bold',
  },
});

export const theme = {
  colors,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  shadows,
  fontFamily,
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  section: {
    marginVertical: spacing['4'],
  },
  heading: {
    fontFamily: fontFamily.bold,
    fontSize: fontSizes['2xl'],
    color: colors.neutral[900],
    marginBottom: spacing['4'],
  },
  subheading: {
    fontFamily: fontFamily.medium,
    fontSize: fontSizes.lg,
    color: colors.neutral[800],
    marginBottom: spacing['2'],
  },
  paragraph: {
    fontFamily: fontFamily.regular,
    fontSize: fontSizes.md,
    color: colors.neutral[700],
    lineHeight: fontSizes.md * 1.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing['4'],
    marginBottom: spacing['4'],
    ...shadows.md,
  },
});