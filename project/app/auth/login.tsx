import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router, Link } from 'expo-router';
import { theme } from '../../utils/theme';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/auth-context';
import { Mail, Lock, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login with preset credentials
  const handleDemoLogin = async () => {
    setEmail('ram@example.com');
    setPassword('password');
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      const success = await login('ram@example.com', 'password');
      
      if (!success) {
        setError('Demo login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
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
          <Text style={styles.tagline}>Find parking. Hassle-free.</Text>
        </Animated.View>
        
        <Animated.View 
          style={styles.formContainer}
          entering={FadeInUp.delay(400).duration(800)}
        >
          <Text style={styles.heading}>Log In</Text>
          
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          
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
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            leftIcon={<Lock size={20} color={theme.colors.neutral[500]} />}
          />
          
          <Button
            title="Login"
            onPress={handleLogin}
            isLoading={isLoading}
            style={styles.loginButton}
          />
          
          <Button
            title="Demo Login"
            onPress={handleDemoLogin}
            variant="secondary"
            style={styles.demoButton}
          />
          
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Don't have an account?
            </Text>
            <Link href="/auth/register" asChild>
              <Button
                title="Register"
                variant="ghost"
                rightIcon={<ChevronRight size={16} color={theme.colors.primary[500]} />}
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
    marginBottom: theme.spacing['8'],
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
  loginButton: {
    marginTop: theme.spacing['4'],
  },
  demoButton: {
    marginTop: theme.spacing['3'],
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing['6'],
  },
  registerText: {
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral[600],
  },
});