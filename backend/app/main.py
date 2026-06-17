from fastapi import FastAPI, HTTPException
from datetime import date
from app.nasa_client import fetch_feed, parse_feed, fetch_neo_detail
from app.cache import cache
from app.config import CACHE_TTL_SECONDS, MAX_RANGE_DAYS
from app.chunking import build_chunks
from app.exceptions import NasaNotFoundError, NasaRateLimitError, NasaUnavailableError, NasaError
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="NASA NEO Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"]
)

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
            try:
                raw = await fetch_feed(chunk_start.isoformat(), chunk_end.isoformat())
            except NasaRateLimitError:
                raise HTTPException(status_code=429, detail="Limite di richieste superato. Riprova più tardi.")
            except NasaUnavailableError:
                raise HTTPException(status_code=503, detail="Servizio NASA non disponibile. Riprova più tardi.")
            except NasaError:
                raise HTTPException(status_code=502, detail="Errore nella risposta della NASA. Riprova più tardi.")
            
            chunk_asteroids = parse_feed(raw)
            cache.set(chunk_key, chunk_asteroids, CACHE_TTL_SECONDS)

        asteroids.extend(chunk_asteroids)

    return {
        "count": len(asteroids),
        "chunks_total": len(chunks),
        "chunks_from_cache": chunks_from_cache,
        "asteroids": asteroids,
    }


@app.get("/api/neos/{neo_id}")
async def get_neo_detail(neo_id: str):
    cache_key = f"detail_{neo_id}"

    cached = cache.get(cache_key)
    if cached is not None:
        return cached
    
    try:
        detail = await fetch_neo_detail(neo_id)
    except NasaRateLimitError:
        raise HTTPException(status_code=429, detail="Limite di richieste superato. Riprova più tardi.")
    except NasaUnavailableError:
        raise HTTPException(status_code=503, detail="Servizio NASA non disponibile. Riprova più tardi.")
    except NasaNotFoundError:
        raise HTTPException(status_code=404, detail=f"Asteroide con ID {neo_id} non trovato")
    except NasaError:
        raise HTTPException(status_code=502, detail="Errore nella risposta della NASA. Riprova più tardi.")
    
    cache.set(cache_key, detail, CACHE_TTL_SECONDS)

    return detail

