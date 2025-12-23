import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { store } from '@/store/store';
import { Provider } from 'react-redux';



export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* <AuthGuard> */}
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="verifyOtp" options={{ headerShown: false }} />
        <Stack.Screen name="signUp" options={{ headerShown: false }} />
        <Stack.Screen name="gift" options={{ headerShown: false }} />
        <Stack.Screen name="brands" options={{ headerShown: false }} />
        <Stack.Screen name="exploreAi" options={{ headerShown: false }} />
        <Stack.Screen name="product-list" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
      {/* </AuthGuard> */}
    </ThemeProvider>
    </Provider>
  );
}
