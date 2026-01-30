// src/auth/authStorage.ts
import * as SecureStore from "expo-secure-store";

const AUTH_KEY = "auth_data";

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
