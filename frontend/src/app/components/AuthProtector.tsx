"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthProtectorProps {
  children: React.ReactNode;
}

export default function AuthProtector({ children }: AuthProtectorProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Checking for token...");
    console.log("Token found:", token);
    if (!token) {
      console.log("No token found, redirecting to login");
      router.push("/login");
    } else {
      console.log("Token found, user is authenticated");
      setIsAuthenticated(true);
    }
    setIsLoading(false);
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
