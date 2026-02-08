// src/auth/authStorage.ts
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const AUTH_KEY = "auth_data";
const API_URL_KEY = "api_url";

export type StoredAuth = {
  token: string;
  userId: string;
};

// Helper to determine if we are on Web
const isWeb = Platform.OS === "web";

export const saveAuth = async (auth: StoredAuth) => {
  const value = JSON.stringify(auth);
  if (isWeb) {
    localStorage.setItem(AUTH_KEY, value);
  } else {
    await SecureStore.setItemAsync(AUTH_KEY, value);
  }
};

export const getAuth = async (): Promise<StoredAuth | null> => {
  const value = isWeb
    ? localStorage.getItem(AUTH_KEY)
    : await SecureStore.getItemAsync(AUTH_KEY);

  return value ? JSON.parse(value) : null;
};

export const removeAuth = async () => {
  if (isWeb) {
    localStorage.removeItem(AUTH_KEY);
  } else {
    await SecureStore.deleteItemAsync(AUTH_KEY);
  }
};

export const setGlobalApiUrl = async (apiUrl: string) => {
  if (isWeb) {
    localStorage.setItem(API_URL_KEY, apiUrl);
  } else {
    await SecureStore.setItemAsync(API_URL_KEY, apiUrl);
  }
};

export const getGlobalApiUrl = async (): Promise<string> => {
  const value = isWeb
    ? localStorage.getItem(API_URL_KEY)
    : await SecureStore.getItemAsync(API_URL_KEY);

  return value || "";
};
