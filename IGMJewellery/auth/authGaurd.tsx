// src/auth/AuthGuard.tsx
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "./authContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, token, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    console.log("auth guard:", { isAuthenticated, token, userId });

    if (!isAuthenticated) {
      router.replace("/");
    }

    if (isAuthenticated) {
      router.replace("/home");
    }
  }, [isAuthenticated, isLoading]);

  return (
    <>
      {children}
      {isLoading && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      )}
    </>
  );
}
