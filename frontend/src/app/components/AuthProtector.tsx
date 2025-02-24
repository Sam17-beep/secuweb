"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { refreshAuthToken, isTokenExpired } from "../utils/authUtils";

interface AuthProtectorProps {
  children: React.ReactNode;
}

export default function AuthProtector({ children }: AuthProtectorProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      let token = localStorage.getItem("token");

      // If no token or token is expired, try to refresh
      if (!token || isTokenExpired(token)) {
        token = await refreshAuthToken();

        // If refresh fails, redirect to login
        if (!token) {
          router.push("/");
          return;
        }
      }

      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}
