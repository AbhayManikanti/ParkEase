import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  TextStyle,
  Platform,
  Pressable,
  View 
} from 'react-native';
import { theme } from '../../utils/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  disabled,
  onPress,
  ...rest
}) => {
  const buttonStyles = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  const ButtonComponent = Platform.OS === 'web' ? TouchableOpacity : TouchableOpacity;

  return (
    <ButtonComponent 
      style={buttonStyles}
      disabled={isLoading || disabled}
      onPress={onPress}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? theme.colors.white : theme.colors.primary[500]} 
        />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
          <Text style={textStyles}>{title}</Text>
          {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
        </View>
      )}
    </ButtonComponent>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        userSelect: 'none',
        transitionProperty: 'all',
        transitionDuration: '150ms',
      },
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing['2'],
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: theme.fontFamily.medium,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  // Variants
  primary: {
    backgroundColor: theme.colors.primary[500],
  },
  primaryText: {
    color: theme.colors.white,
  },
  secondary: {
    backgroundColor: theme.colors.primary[100],
  },
  secondaryText: {
    color: theme.colors.primary[700],
  },
  outline: {
    backgroundColor: theme.colors.transparent,
    borderWidth: 1,
    borderColor: theme.colors.primary[500],
  },
  outlineText: {
    color: theme.colors.primary[500],
  },
  ghost: {
    backgroundColor: theme.colors.transparent,
  },
  ghostText: {
    color: theme.colors.primary[500],
  },
  danger: {
    backgroundColor: theme.colors.error[500],
  },
  dangerText: {
    color: theme.colors.white,
  },
  // Sizes
  sm: {
    paddingVertical: theme.spacing['1'],
    paddingHorizontal: theme.spacing['3'],
    minHeight: 32,
  },
  smText: {
    fontSize: theme.fontSizes.sm,
  },
  md: {
    paddingVertical: theme.spacing['2'],
    paddingHorizontal: theme.spacing['4'],
    minHeight: 40,
  },
  mdText: {
    fontSize: theme.fontSizes.md,
  },
  lg: {
    paddingVertical: theme.spacing['3'],
    paddingHorizontal: theme.spacing['5'],
    minHeight: 48,
  },
  lgText: {
    fontSize: theme.fontSizes.lg,
  },
  // Disabled state
  disabled: {
    backgroundColor: theme.colors.neutral[200],
    borderColor: theme.colors.neutral[300],
    opacity: 0.6,
  },
  disabledText: {
    color: theme.colors.neutral[500],
  },
});

export default Button;