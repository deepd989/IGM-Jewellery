// src/auth/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, removeAuth, saveAuth } from "./authStorage";

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  userId: string | null;
  login: (data: { token: string; userId: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token;

  useEffect(() => {
    const bootstrap = async () => {
      const auth = await getAuth();

      if (auth) {
        setToken(auth.token);
        setUserId(auth.userId);
      }

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
  };

  const logout = async () => {
    await removeAuth();
    setToken(null);
    setUserId(null);
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
