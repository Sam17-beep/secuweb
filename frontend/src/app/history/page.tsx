"use client";

import { fetchRuns } from "@/api/runs";
import AuthProtector from "@/domain/components/AuthProtector";
import { useState, useEffect } from "react";

interface Run {
  _id: string;
  time: number;
  distance: number;
  date: string;
}

function HistoryContent() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const getRuns = async () => {
      const token = localStorage.getItem("token");
      try {
        const data = await fetchRuns(token as string);
        setRuns(data as unknown as Run[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch runs");
        console.error("Error details:", err);
      }
    };

    getRuns();
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Run History</h2>
      {runs.length === 0 ? (
        <p>No runs recorded yet. Add your first run to see it here!</p>
      ) : (
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
              <tr key={run._id}>
                <td className="border p-2">
                  {new Date(run.date).toLocaleDateString()}
                </td>
                <td className="border p-2">{run.time.toFixed(2)}</td>
                <td className="border p-2">{run.distance.toFixed(2)}</td>
                <td className="border p-2">
                  {(run.time / run.distance).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function History() {
  return (
    <AuthProtector>
      <HistoryContent />
    </AuthProtector>
  );
}
