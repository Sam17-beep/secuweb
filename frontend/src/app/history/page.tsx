"use client";

import { useState, useEffect } from "react";
import { getRuns } from "../api/runs";

interface Run {
  id: number;
  timeMin: number;
  lengthKm: number;
  date: string;
}

export default function History() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRuns = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view run history");
        return;
      }
      try {
        const data = await getRuns(token);
        setRuns(data);
      } catch {
        setError("Failed to fetch runs");
      }
    };

    fetchRuns();
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Run History</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Date</th>
            <th className="border p-2">Time (min)</th>
            <th className="border p-2">Distance (km)</th>
            <th className="border p-2">Pace (min/km)</th>
          </tr>
        </thead>
        <tbody>
          {runs.map((run) => (
            <tr key={run.id}>
              <td className="border p-2">
                {new Date(run.date).toLocaleDateString()}
              </td>
              <td className="border p-2">{run.timeMin.toFixed(2)}</td>
              <td className="border p-2">{run.lengthKm.toFixed(2)}</td>
              <td className="border p-2">
                {(run.timeMin / run.lengthKm).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
