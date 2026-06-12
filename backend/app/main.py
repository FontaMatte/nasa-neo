from fastapi import FastAPI, HTTPException
from datetime import date
from app.nasa_client import fetch_feed, parse_feed

app = FastAPI(title="NASA NEO Dashboard API")

@app.get("/")
def health_check():
    return {"status": "ok"}

@app.get("/api/neos")
async def get_neos(start_date: date, end_date: date):
    # 1. validazione: se end_date è precedente a start_date -> 400
    if end_date < start_date:
        raise HTTPException(status_code=400, detail="end_date deve essere maggiore o uguale di start_date")
    
    # 2. validazione: se il range supera i 7 giorni -> 400
    if (end_date - start_date).days > 6:
        raise HTTPException(status_code=400, detail="il range non può superare i 7 giorni (estremi inclusi)")
    
    # 3. chiama la NASA (ricorda: await, e le date vanno convertite in stringa)
    raw = await fetch_feed(start_date.isoformat(), end_date.isoformat())
    # 4. trasforma i dati grezzi nella lista pulita
    asteroids = parse_feed(raw)
    # 5. restituisci il dizionario con count e asteroids
    return {"count": len(asteroids), "asteroids": asteroids}
