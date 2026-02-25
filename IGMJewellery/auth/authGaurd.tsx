// src/auth/AuthGuard.tsx
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { useAuth } from "./authContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (isLoading) return;

    // On first load, skip redirect — let index.tsx splash handle initial routing
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      return;
    }

    // After initial load, handle auth state changes (login/logout during session)
    if (!isAuthenticated) {
      router.replace("/");
    } else {
      router.replace("/home");
    }
  }, [isAuthenticated, isLoading]);

  return <>{children}</>;
}
