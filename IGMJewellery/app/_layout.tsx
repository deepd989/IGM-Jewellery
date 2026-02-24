import { DEFAULT_FONT_FAMILY } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { store } from "@/store/store";
import {
  Manrope_200ExtraLight,
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/manrope";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Text, TextInput } from "react-native";
import "react-native-reanimated";
import { Provider } from "react-redux";
import { AuthProvider } from "../auth/authContext";
import AuthGuard from "../auth/authGaurd";

// Prevent splash screen from auto-hiding until fonts are loaded
SplashScreen.preventAutoHideAsync();

// Set Manrope as the default font for ALL Text and TextInput components globally.
// This avoids having to change fontFamily in every single component file.
const TextAny = Text as any;
const TextInputAny = TextInput as any;
if (TextAny.defaultProps == null) TextAny.defaultProps = {};
TextAny.defaultProps.style = { fontFamily: DEFAULT_FONT_FAMILY };
if (TextInputAny.defaultProps == null) TextInputAny.defaultProps = {};
TextInputAny.defaultProps.style = { fontFamily: DEFAULT_FONT_FAMILY };

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded, fontError] = useFonts({
    Manrope_200ExtraLight,
    Manrope_300Light,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <Provider store={store}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          {/* <AuthGuard> */}
          <AuthGuard>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="home" options={{ headerShown: false }} />
              <Stack.Screen name="verifyOtp" options={{ headerShown: false }} />
              <Stack.Screen name="signUp" options={{ headerShown: false }} />
              <Stack.Screen name="gift" options={{ headerShown: false }} />
              <Stack.Screen name="brands" options={{ headerShown: false }} />
              <Stack.Screen name="exploreAi" options={{ headerShown: false }} />
              <Stack.Screen
                name="immersiveProductList"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="product-list"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="searchPage"
                options={{ headerShown: false }}
              />
            </Stack>
          </AuthGuard>
          <StatusBar style="auto" />
        </ThemeProvider>
      </Provider>
    </AuthProvider>
  );
}
