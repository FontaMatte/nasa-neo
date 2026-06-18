"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchNeoDetail } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function AsteroidDetail() {
  const params = useParams();
  const id = params.id as string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchNeoDetail(id);
        setDetail(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Errore sconosciuto");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <main className="container mx-auto p-8">Caricamento...</main>;
  if (error) return (
	<main className="container mx-auto p-8">
		<div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-700">
			{error}
		</div>
	</main>
  );
  if (!detail) return null;

  return (
    <main className="container mx-auto p-8">
      <Link href="/">
        <Button variant="outline" className="mb-6">← Torna alla lista</Button>
      </Link>

      <h1 className="text-3xl font-bold mb-2">{detail.name}</h1>
      <p className="text-muted-foreground mb-6">ID NASA: {detail.id}</p>

      <div className="grid grid-cols-2 gap-4 max-w-md">
        <span className="font-medium">Magnitudine assoluta:</span>
        <span>{detail.absolute_magnitude_h}</span>

        <span className="font-medium">Potenzialmente pericoloso:</span>
        <span>{detail.is_potentially_hazardous_asteroid ? "Sì" : "No"}</span>
      </div>

      <a
        href={detail.nasa_jpl_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-6 text-primary underline"
      >
        Scheda completa su NASA JPL →
      </a>
    </main>
  );
}