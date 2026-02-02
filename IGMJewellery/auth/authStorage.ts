// src/auth/authStorage.ts
import * as SecureStore from "expo-secure-store";

const AUTH_KEY = "auth_data";

const API_URL_KEY = "api_url";

export type StoredAuth = {
  token: string;
  userId: string;
};

export const saveAuth = async (auth: StoredAuth) => {
  await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(auth));
};

export const getAuth = async (): Promise<StoredAuth | null> => {
  const value = await SecureStore.getItemAsync(AUTH_KEY);
  return value ? JSON.parse(value) : null;
};

export const removeAuth = async () => {
  await SecureStore.deleteItemAsync(AUTH_KEY);
};

export const setGlobalApiUrl = async (apiUrl: string) => {
  await SecureStore.setItemAsync(API_URL_KEY, apiUrl);
};

export const getGlobalApiUrl = async (): Promise<string> => {
  const value = await SecureStore.getItemAsync(API_URL_KEY);
  return value || "";
};
