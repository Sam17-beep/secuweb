"use client";

import { login } from "../api/auth";

import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

// Cookie name for storing authentication data
const AUTH_COOKIE_NAME = "run_journal_auth";
// Cookie expiry (30 days)
const COOKIE_EXPIRY_DAYS = 30;

interface AuthData {
  username: string;
  hashedPassword: string; // We'll store a hashed version, not the actual password
}

interface DecodedToken {
  userId: string;
  exp: number;
}

export function saveAuthToCookie(username: string, password: string): void {
  // Don't store actual password, use a simple hash
  // In a production app, you'd use a more secure method
  const hashedPassword = btoa(password); // Simple base64 encoding (not secure for production)
  const authData: AuthData = { username, hashedPassword };
  Cookies.set(AUTH_COOKIE_NAME, JSON.stringify(authData), {
    expires: COOKIE_EXPIRY_DAYS,
  });
}

export function getAuthFromCookie(): AuthData | null {
  const cookieData = Cookies.get(AUTH_COOKIE_NAME);
  if (!cookieData) return null;

  try {
    return JSON.parse(cookieData) as AuthData;
  } catch (e) {
    console.error("Error parsing auth cookie:", e);
    return null;
  }
}

export function removeAuthCookie(): void {
  Cookies.remove(AUTH_COOKIE_NAME);
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true; // If we can't decode the token, consider it expired
  }
}

export async function refreshAuthToken(): Promise<string | null> {
  const authData = getAuthFromCookie();
  if (!authData) return null;

  try {
    // Get password from hashed version
    const password = atob(authData.hashedPassword);
    const token = await login(authData.username, password);
    localStorage.setItem("token", token);
    return token;
  } catch (e) {
    console.error("Error refreshing token:", e);
    return null;
  }
}
