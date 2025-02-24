"use client";

import { login } from "../api/auth";

import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const AUTH_COOKIE_NAME = "run_journal_auth";
const COOKIE_EXPIRY_DAYS = 30;

interface AuthData {
  username: string;
  hashedPassword: string;
}

interface DecodedToken {
  userId: string;
  exp: number;
}

export function saveAuthToCookie(username: string, password: string): void {
  const hashedPassword = btoa(password);

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
    return true;
  }
}

export async function refreshAuthToken(): Promise<string | null> {
  const authData = getAuthFromCookie();
  if (!authData) return null;

  try {
    const password = atob(authData.hashedPassword);
    const token = await login(authData.username, password);
    localStorage.setItem("token", token);
    return token;
  } catch (e) {
    console.error("Error refreshing token:", e);
    return null;
  }
}
