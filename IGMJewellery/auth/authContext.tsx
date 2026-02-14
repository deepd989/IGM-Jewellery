// src/auth/AuthContext.tsx
import { setCurrentUserId } from "@/store/apis/wishlist";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
    getAuth,
    getGlobalApiUrl,
    removeAuth,
    saveAuth,
    setGlobalApiUrl,
} from "./authStorage";

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

      // Initialize wishlist storage with current user (or guest)
      await setCurrentUserId(auth?.userId || null);

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
    // Sync wishlist storage to logged-in user (merges guest wishlist)
    await setCurrentUserId(userId);
  };

  const logout = async () => {
    await removeAuth();
    setToken(null);
    setUserId(null);
    // Reset wishlist storage to guest
    await setCurrentUserId(null);
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
