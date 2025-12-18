import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import AuthGuard from '@/components/authGaurd';
import { Provider } from 'react-redux';
import { store } from '@/store/store';



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
      </Stack>
      <StatusBar style="auto" />
      {/* </AuthGuard> */}
    </ThemeProvider>
    </Provider>
  );
}
