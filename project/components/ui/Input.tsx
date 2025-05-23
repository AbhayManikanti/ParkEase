import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TextInputProps, 
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle
} from 'react-native';
import { theme } from '../../utils/theme';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<ViewStyle>;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  labelStyle,
  inputStyle,
  secureTextEntry,
  ...rest
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = secureTextEntry !== undefined;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}
      
      <View style={[
        styles.inputContainer, 
        error ? styles.inputError : null,
      ]}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeftIcon : null,
            (rightIcon || isPassword) ? styles.inputWithRightIcon : null,
            inputStyle,
          ]}
          placeholderTextColor={theme.colors.neutral[400]}
          secureTextEntry={isPassword ? !isPasswordVisible : secureTextEntry}
          {...rest}
        />
        
        {isPassword && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={togglePasswordVisibility}
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color={theme.colors.neutral[500]} />
            ) : (
              <Eye size={20} color={theme.colors.neutral[500]} />
            )}
          </TouchableOpacity>
        )}
        
        {rightIcon && !isPassword && (
          <View style={styles.rightIconContainer}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing['4'],
  },
  label: {
    fontFamily: theme.fontFamily.medium,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral[700],
    marginBottom: theme.spacing['1'],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.neutral[300],
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.white,
  },
  input: {
    flex: 1,
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral[900],
    paddingVertical: theme.spacing['3'],
    paddingHorizontal: theme.spacing['3'],
  },
  inputWithLeftIcon: {
    paddingLeft: theme.spacing['1'],
  },
  inputWithRightIcon: {
    paddingRight: theme.spacing['1'],
  },
  leftIconContainer: {
    paddingLeft: theme.spacing['3'],
  },
  rightIconContainer: {
    paddingRight: theme.spacing['3'],
  },
  inputError: {
    borderColor: theme.colors.error[500],
  },
  errorText: {
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.error[500],
    marginTop: theme.spacing['1'],
  },
});

export default Input;