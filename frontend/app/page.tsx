"use client";

import { useState, useEffect } from "react";
import { fetchNeos } from "@/lib/api";
import { Asteroid } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { AsteroidTable } from "@/components/asteroidTable";
import { DistanceChart } from "@/components/DistanceChart";
import { SizeChart } from "@/components/SizeChart";
import { TableSkeleton} from "@/components/TableSkeleton";

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

	
	useEffect(() => {
		async function loadInitial() {
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
		loadInitial();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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

			{error && (
				<div className="mt-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-700">
					{error}
				</div>
			)}

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

			{loading ? (
			<TableSkeleton />
			) : (
				<>
					{visibleAsteroids.length > 0 && (
					<div className="my-8">
						<h2 className="text-xl font-semibold mb-4">Distanza dalla Terra</h2>
						<DistanceChart asteroids={visibleAsteroids} />
					</div>
					)}
					{visibleAsteroids.length > 0 && (
					<div className="my-8">
						<h2 className="text-xl font-semibold mb-4">Distribuzione per dimensione</h2>
						<SizeChart asteroids={visibleAsteroids} />
					</div>
					)}
					{visibleAsteroids.length > 0 && <AsteroidTable asteroids={visibleAsteroids} />}

					{asteroids.length > 0 && visibleAsteroids.length === 0 && (
					<p className="text-muted-foreground my-8">
						Nessun asteroide corrisponde ai filtri selezionati.
					</p>
					)}
					{!error && asteroids.length === 0 && (
					<p className="text-muted-foreground my-8">
						Nessun asteroide nel periodo selezionato. Prova un altro intervallo di date.
					</p>
					)}
				</>
			)}
		</main>
  	);
}