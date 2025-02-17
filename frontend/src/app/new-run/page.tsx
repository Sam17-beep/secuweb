"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addRun } from "../api/runs";

export default function NewRun() {
  const [time, setTime] = useState("");
  const [distance, setDistance] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to add a run");
      return;
    }
    try {
      await addRun(Number.parseFloat(time), Number.parseFloat(distance), token);
      router.push("/history");
    } catch {
      setError("Failed to add new run");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Run</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <label htmlFor="time" className="block mb-2">
          Time (minutes)
        </label>
        <input
          type="number"
          step="0.01"
          id="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="distance" className="block mb-2">
          Distance (km)
        </label>
        <input
          type="number"
          step="0.01"
          id="distance"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Add Run
      </button>
    </form>
  );
}
