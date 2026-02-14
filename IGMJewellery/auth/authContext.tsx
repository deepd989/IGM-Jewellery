// src/auth/AuthContext.tsx
import { cartApiService, setCurrentCartUserId } from "@/store/apis/cart";
import { setCurrentUserId, wishlistApiService } from "@/store/apis/wishlist";
import { store } from "@/store/store";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  getGlobalApiUrl,
  removeAuth,
  saveAuth,
  setGlobalApiUrl,
} from "./authStorage";

/**
 * After loading data from phone storage, invalidate RTK Query caches
 * so components re-render with the correct data.
 */
function invalidateCaches() {
  store.dispatch(cartApiService.util.invalidateTags(["Cart"]));
  store.dispatch(wishlistApiService.util.invalidateTags(["Wishlist"]));
}

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  userId: string | null;
  apiUrl: string;
  setApiUrl: (url: string) => void;
  login: (data: { token: string; userId: string }) => Promise<void>;
  logout: () => Promise<void>;
  imageGlobal: boolean;
  setImageGlobalUsage: (flag: boolean) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiUrl, setInstanceApiUrl] = useState<string>("");
  const [imageGlobal, setImageGlobalUsage] = useState<boolean>(false);

  const isAuthenticated = !!token;

  useEffect(() => {
    const bootstrap = async () => {
      const auth = await getAuth();
      const storedApiUrl = (await getGlobalApiUrl()) as string;
      setInstanceApiUrl(storedApiUrl);
      if (auth) {
        setToken(auth.token);
        setUserId(auth.userId);
      }

      // Initialize wishlist & cart storage with current user (or guest)
      await setCurrentUserId(auth?.userId || null);
      await setCurrentCartUserId(auth?.userId || null);
      invalidateCaches();

      setIsLoading(false);
    };

    bootstrap();
  }, []);

  const login = async ({
    token,
    userId,
  }: {
    token: string;
    userId: string;
  }) => {
    console.log("Logging in with token:", token, "and userId:", userId);
    await saveAuth({ token, userId });
    setToken(token);
    setUserId(userId);
    // Sync wishlist & cart storage to logged-in user (merges guest data)
    await setCurrentUserId(userId);
    await setCurrentCartUserId(userId);
    invalidateCaches();
  };

  const logout = async () => {
    await removeAuth();
    setToken(null);
    setUserId(null);
    // Reset wishlist & cart storage to guest
    await setCurrentUserId(null);
    await setCurrentCartUserId(null);
    invalidateCaches();
  };

  const setApiUrl = async (url: string) => {
    await setGlobalApiUrl(url);
    setInstanceApiUrl(url);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        token,
        userId,
        login,
        logout,
        apiUrl,
        setApiUrl,
        imageGlobal,
        setImageGlobalUsage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
