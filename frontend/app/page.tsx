"use client";

import { useState } from "react";
import { fetchNeos } from "@/lib/api";
import { Asteroid } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("2026-06-01");
  const [endDate, setEndDate] = useState("2026-06-03");

  async function handleLoad() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNeos(startDate, endDate);
      setAsteroids(data.asteroids);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore sconosciuto");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">NASA NEO Dashboard</h1>

      <div className="flex gap-4 mb-6">
        <div>
			<label className="block text-sm mb-1">Data inizio</label>
			<input
				type="date"
				value={startDate}
				onChange={(e) => setStartDate(e.target.value)}
				className="border rounded px-3 py-2"
			/>
        </div>
        <div>
			<label className="block text-sm mb-1">Data fine</label>
			<input
				type="date"
				value={endDate}
				onChange={(e) => setEndDate(e.target.value)}
				className="border rounded px-3 py-2"
			/>
        </div>
      </div>

      <Button onClick={handleLoad} disabled={loading}>
        {loading ? "Caricamento..." : "Carica asteroidi"}
      </Button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <ul className="mt-6 space-y-2">
        {asteroids.map((a) => (
          <li key={a.id} className="border p-3 rounded">
            {a.name} — {a.miss_distance_km.toLocaleString()} km
          </li>
        ))}
      </ul>
    </main>
  );
}