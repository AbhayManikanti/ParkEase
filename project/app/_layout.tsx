import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { 
  Poppins_400Regular, 
  Poppins_500Medium, 
  Poppins_700Bold 
} from '@expo-google-fonts/poppins';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { SplashScreen } from 'expo-router';
import { AuthProvider } from '../contexts/auth-context';
import { ParkingProvider } from '../contexts/parking-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Prevent splash screen from auto hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-Bold': Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after fonts have loaded or if there's an error
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Return null until fonts are loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ParkingProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen name="slot/[id]" options={{ presentation: 'card' }} />
            <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
          </Stack>
          <StatusBar style="auto" />
        </ParkingProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}