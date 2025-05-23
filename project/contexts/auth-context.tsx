import React, { createContext, useState, useContext, useEffect } from 'react';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { AuthState, User } from '../types';
import { mockUsers } from '../utils/data';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (user: Partial<User>) => Promise<boolean>;
}

const defaultAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const AuthContext = createContext<AuthContextType>({
  ...defaultAuthState,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  updateProfile: async () => false,
});

export const useAuth = () => useContext(AuthContext);

// Helper functions for storage operations
const storeData = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const getData = async (key: string) => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }
  return await SecureStore.getItemAsync(key);
};

const removeData = async (key: string) => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(defaultAuthState);

  useEffect(() => {
    // Check if user is logged in on app start
    const loadUser = async () => {
      try {
        const userJson = await getData('user');
        if (userJson) {
          const user = JSON.parse(userJson);
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setState({
            ...defaultAuthState,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Failed to load user from storage', error);
        setState({
          ...defaultAuthState,
          isLoading: false,
        });
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would make an API call
      // Simulating API call with mockUsers
      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (user) {
        // In a real app, you would verify the password here
        await storeData('user', JSON.stringify(user));
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      // In a real app, this would make an API call
      // For demo, we'll create a new user and add it to our mock data
      const newUser: User = {
        id: `u${mockUsers.length + 1}`,
        email,
        name,
        isHost: false,
        createdAt: new Date().toISOString(),
      };
      
      // In a real app, you would store the new user in the database
      await storeData('user', JSON.stringify(newUser));
      setState({
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (error) {
      console.error('Registration failed', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await removeData('user');
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      router.replace('/auth/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!state.user) return false;
      
      const updatedUser = { ...state.user, ...userData };
      await storeData('user', JSON.stringify(updatedUser));
      
      setState({
        ...state,
        user: updatedUser,
      });
      
      return true;
    } catch (error) {
      console.error('Profile update failed', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};