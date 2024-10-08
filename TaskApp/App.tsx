import React, { useCallback } from 'react';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import AppNavigator from './navigation/AppNavigator';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Geologica-Regular': require('./assets/fonts/Geologica-Regular.ttf'),  // Substitua pelo caminho correto
    'Geologica-Bold': require('./assets/fonts/Geologica-Bold.ttf'),  // Caso tenha diferentes pesos, como bold
  });


  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
      <AppNavigator />
    </View>
  );
}
