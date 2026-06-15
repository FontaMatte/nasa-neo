from fastapi import FastAPI, HTTPException
from datetime import date
from app.nasa_client import fetch_feed, parse_feed
from app.cache import cache
from app.config import CACHE_TTL_SECONDS, MAX_RANGE_DAYS
from app.chunking import build_chunks

app = FastAPI(title="NASA NEO Dashboard API")

@app.get("/")
def health_check():
    return {"status": "ok"}

@app.get("/api/neos")
async def get_neos(start_date: date, end_date: date):
    # 1. validazione: se end_date è precedente a start_date -> 400
    if end_date < start_date:
        raise HTTPException(status_code=400, detail="end_date deve essere maggiore o uguale di start_date")
    
    # 2. validazione: se il range supera i 90 giorni -> 400
    if (end_date - start_date).days >= MAX_RANGE_DAYS:
        raise HTTPException(status_code=400, detail=f"il range non può superare i {MAX_RANGE_DAYS} giorni (estremi inclusi)")
    
    chunks = build_chunks(start_date, end_date)

    asteroids = []
    chunks_from_cache = 0
    for chunk_start, chunk_end in chunks:
        chunk_key = f"{chunk_start.isoformat()}_{chunk_end.isoformat()}"

        cached = cache.get(chunk_key)

        if cached is not None:
            chunk_asteroids = cached
            chunks_from_cache += 1
        else:
            raw = await fetch_feed(chunk_start.isoformat(), chunk_end.isoformat())
            chunk_asteroids = parse_feed(raw)
            cache.set(chunk_key, chunk_asteroids, CACHE_TTL_SECONDS)

        asteroids.extend(chunk_asteroids)

    return {
        "count": len(asteroids),
        "chunks_total": len(chunks),
        "chunks_from_cache": chunks_from_cache,
        "asteroids": asteroids,
    }


