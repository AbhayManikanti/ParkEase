import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { useAuth } from '../../contexts/auth-context';
import { router } from 'expo-router';
import { Chrome as Home, Search, Calendar, CirclePlus as PlusCircle, User } from 'lucide-react-native';
import { theme } from '../../utils/theme';

export default function TabLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login if not authenticated
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading || !isAuthenticated) {
    // Still loading or not authenticated, don't render tabs yet
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary[500],
        tabBarInactiveTintColor: theme.colors.neutral[400],
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: theme.colors.neutral[200],
          elevation: 0,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: theme.fontFamily.medium,
          fontSize: 12,
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: 4,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="host"
        options={{
          title: 'Host',
          tabBarIcon: ({ color, size }) => <PlusCircle size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}