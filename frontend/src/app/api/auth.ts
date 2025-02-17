const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function login(username: string, password: string) {
  console.log("API_URL", API_URL);
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = await response.json();
  return data.token;
}

export async function signup(username: string, password: string) {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Signup failed");
  }
}
