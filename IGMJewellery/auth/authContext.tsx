// src/auth/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { UserLoginObject } from "../magentoModels/userLoginObject.model";
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
  userObject: UserLoginObject | null;
  apiUrl: string;
  phoneNumber: string | null;
  setApiUrl: (url: string) => void;
  login: (data: {
    token: string;
    userObject: UserLoginObject | null;
    phoneNumber: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  imageGlobal: boolean;
  setImageGlobalUsage: (flag: boolean) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userObject, setUserObject] = useState<UserLoginObject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aiServiceApiUrl, setInstanceApiUrl] = useState<string>("");
  const [imageGlobal, setImageGlobalUsage] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>("");

  const isAuthenticated = !!userObject;

  useEffect(() => {
    const bootstrap = async () => {
      const auth = await getAuth();
      const storedApiUrl = (await getGlobalApiUrl()) as string;
      setInstanceApiUrl(storedApiUrl);
      if (auth) {
        setToken(auth.token);
        setUserObject(auth.userObject);
      }

      setIsLoading(false);
    };

    bootstrap();
  }, []);

  const login = async ({
    token,
    userObject,
    phoneNumber,
  }: {
    token: string;
    userObject: UserLoginObject | null;
    phoneNumber: string;
  }) => {
    console.log(
      "Logging in with token:",
      token,
      "and userId:",
      JSON.stringify(userObject)
    );
    await saveAuth({ token, userObject });
    setToken(token);
    setUserObject(userObject);
    setPhoneNumber(phoneNumber);
  };

  const logout = async () => {
    await removeAuth();
    setToken(null);
    setUserObject(null);
    setPhoneNumber(null);
  };

  const setAiServiceApiUrl = async (url: string) => {
    await setGlobalApiUrl(url);
    setInstanceApiUrl(url);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        token,
        userObject,
        phoneNumber,
        login,
        logout,
        apiUrl: aiServiceApiUrl,
        setApiUrl: setAiServiceApiUrl,
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
