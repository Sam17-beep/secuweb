"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { removeAuthCookie } from "@/utils/authUtils";

export default function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    removeAuthCookie();
    setIsAuthenticated(false);
    router.push("/");
  };

  if (isLoading) {
    return (
      <nav className="bg-gray-800 text-white p-4">
        <div>Loading...</div>
      </nav>
    );
  }

  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        {!isAuthenticated ? (
          <>
            <li>
              <Link href="/">Login</Link>
            </li>
            <li>
              <Link href="/signup">Signup</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/new-run">New Run</Link>
            </li>
            <li>
              <Link href="/history">History</Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="text-white hover:underline"
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
