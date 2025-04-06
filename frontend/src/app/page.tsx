"use client";

import {
  getAuthFromCookie,
  refreshAuthToken,
  saveAuthToCookie,
} from "@/utils/authUtils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkExistingAuth = async () => {
      const authData = getAuthFromCookie();
      if (authData) {
        try {
          setIsLoading(true);
          const token = await refreshAuthToken();
          if (token) {
            router.push("/history");
            return;
          }
        } catch {
          console.error("Auto-login failed:");
        }
      }
      setIsLoading(false);
    };

    checkExistingAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        // Extract and throw error message if available
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
      }

      // If login is successful, extract the token
      const { token } = await res.json();
      localStorage.setItem("token", token);

      if (rememberMe) {
        saveAuthToCookie(username, password);
      }

      router.push("/history");
    } catch {
      setError("Login failed. Please check your credentials.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Checking authentication...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <label htmlFor="username" className="block mb-2">
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="mr-2"
          />
          <span>Remember me</span>
        </label>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Login
      </button>
    </form>
  );
}
