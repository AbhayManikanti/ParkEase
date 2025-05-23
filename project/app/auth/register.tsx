import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router, Link } from 'expo-router';
import { theme } from '../../utils/theme';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/auth-context';
import { Mail, Lock, User, ChevronLeft } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated]);

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      const success = await register(email, password, name);
      
      if (!success) {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during registration');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View 
          style={styles.logoContainer}
          entering={FadeInDown.delay(200).duration(800)}
        >
          <Text style={styles.logoText}>ParkEase</Text>
          <Text style={styles.tagline}>Create your account</Text>
        </Animated.View>
        
        <Animated.View 
          style={styles.formContainer}
          entering={FadeInUp.delay(400).duration(800)}
        >
          <Text style={styles.heading}>Register</Text>
          
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            leftIcon={<User size={20} color={theme.colors.neutral[500]} />}
          />
          
          <Input
            label="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            leftIcon={<Mail size={20} color={theme.colors.neutral[500]} />}
          />
          
          <Input
            label="Password"
            placeholder="Create a password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            leftIcon={<Lock size={20} color={theme.colors.neutral[500]} />}
          />
          
          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            leftIcon={<Lock size={20} color={theme.colors.neutral[500]} />}
          />
          
          <Button
            title="Create Account"
            onPress={handleRegister}
            isLoading={isLoading}
            style={styles.registerButton}
          />
          
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Already have an account?
            </Text>
            <Link href="/auth/login" asChild>
              <Button
                title="Login"
                variant="ghost"
                leftIcon={<ChevronLeft size={16} color={theme.colors.primary[500]} />}
              />
            </Link>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing['6'],
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing['6'],
  },
  logoText: {
    fontFamily: theme.fontFamily.bold,
    fontSize: 40,
    color: theme.colors.primary[500],
    marginBottom: theme.spacing['2'],
  },
  tagline: {
    fontFamily: theme.fontFamily.medium,
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral[600],
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  heading: {
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSizes['3xl'],
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing['6'],
  },
  errorContainer: {
    backgroundColor: theme.colors.error[50],
    padding: theme.spacing['3'],
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing['4'],
  },
  errorText: {
    fontFamily: theme.fontFamily.medium,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.error[700],
  },
  registerButton: {
    marginTop: theme.spacing['4'],
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing['6'],
  },
  loginText: {
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral[600],
  },
});