"use client";

import { useState } from "react";
import { fetchNeos } from "@/lib/api";
import { Asteroid } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { AsteroidTable } from "@/components/asteroidTable";

export default function Home() {
	const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [startDate, setStartDate] = useState("2026-06-01");
	const [endDate, setEndDate] = useState("2026-06-03");
	const [filter, setFilter] = useState<"all" | "hazardous" | "safe">("all");
	const [sortBy, setSortBy] = useState<"distance" | "diameter" | "date">("date");

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

	const visibleAsteroids = asteroids
		.filter((a) => {
			if (filter === "hazardous") return a.is_hazardous;
			if (filter === "safe") return !a.is_hazardous;
			return true; // "all"
		})
		.sort((a, b) => {
			if (sortBy === "distance") return a.miss_distance_km - b.miss_distance_km;
			if (sortBy === "diameter") return b.diameter_max_m - a.diameter_max_m;
			return a.date.localeCompare(b.date); // "date"
		})

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

			<div className="flex gap-4 my-6">
				<div>
					<label className="block text-sm mb-1">Filtro</label>
					<select
						value={filter}
						onChange={(e) => setFilter(e.target.value as typeof filter)}
						className="border rounded px-3 py-2"
					>
						<option value="all">Tutti</option>
						<option value="hazardous">Solo pericolosi</option>
						<option value="safe">Solo sicuri</option>
					</select>
				</div>
				<div>
					<label className="block text-sm mb-1">Ordina per</label>
					<select
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
						className="border rounded px-3 py-2"
					>
						<option value="date">Data</option>
						<option value="distance">Distanza (più vicini)</option>
						<option value="diameter">Diametro (più grandi)</option>
					</select>
				</div>
			</div>

			{visibleAsteroids.length > 0 && <AsteroidTable asteroids={visibleAsteroids} />}
		</main>
  	);
}