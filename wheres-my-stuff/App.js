import React from 'react';
import { StyleSheet, View } from 'react-native';
import Login from './App/Screens/LoginScreen/Login';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import TabNavigator from './App/Navigations/TabNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import ProfileNavigator from './App/Navigations/ProfileNavigator';
import { SharedStateProvider } from './App/State/SharedStateProvider';

// Define your public key
const EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_Zmxvd2luZy1zaGVwaGVyZC02OS5jbGVyay5hY2NvdW50cy5kZXYk';

// Define your token cache
const tokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    outfit: require('./assets/fonts/Outfit-Regular.ttf'),
    'outfit-medium': require('./assets/fonts/Outfit-Medium.ttf'),
    'outfit-bold': require('./assets/fonts/Outfit-Bold.ttf'),
    ProtestRiot: require('./assets/fonts/ProtestRiot-Regular.ttf'),
  });

  return (
    <SafeAreaProvider>
      <ClerkProvider tokenCache={tokenCache} publishableKey={EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
        <SharedStateProvider>
          <View style={styles.container}>
            <SignedIn>
              <NavigationContainer>
                <ProfileNavigator />
              </NavigationContainer>
            </SignedIn>
            <SignedOut>
              <Login />
            </SignedOut>
          </View>
        </SharedStateProvider>
      </ClerkProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
});
