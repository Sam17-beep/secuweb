const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function addRun(timeMin: number, distance: number, token: string) {
  const response = await fetch(`${API_URL}/runs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ timeMin, lengthKm: distance, date: "2025-02-17" }),
  });

  if (!response.ok) {
    throw new Error("Failed to add new run");
  }
}

export async function getRuns(token: string) {
  const response = await fetch(`${API_URL}/runs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch runs");
  }

  return response.json();
}
