import httpx

from app.config import NASA_API_KEY, NASA_BASE_URL
from app.exceptions import NasaRateLimitError, NasaUnavailableError, NasaError

async def fetch_feed(start_date: str, end_date: str) -> dict:

    params = {
        "start_date": start_date,
        "end_date": end_date,
        "api_key": NASA_API_KEY,
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(f"{NASA_BASE_URL}/feed", params=params)
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 429:
            raise NasaRateLimitError("Limite di richieste API superato") from e
        raise NasaError(f"Errore nella richiesta API: {e.response.status_code}")
    except httpx.RequestError as e:
        raise NasaUnavailableError("Impossibile raggiungere l'API di NASA") from e
    

def parse_feed(raw: dict) -> list:
    asteroids = []

    for approach_date, neos in raw["near_earth_objects"].items():
        for neo in neos:
            asteroid = {
                "id": neo["id"],
                "name": neo["name"],
                "date": approach_date,
                "diameter_min_m": round(neo["estimated_diameter"]["meters"]["estimated_diameter_min"], 1),
                "diameter_max_m": round(neo["estimated_diameter"]["meters"]["estimated_diameter_max"], 1),
                "miss_distance_km": round(float(neo["close_approach_data"][0]["miss_distance"]["kilometers"]), 1),
                "velocity_kmh": round(float(neo["close_approach_data"][0]["relative_velocity"]["kilometers_per_hour"]), 1),
                "is_hazardous": neo["is_potentially_hazardous_asteroid"],
                "nasa_jpl_url": neo["nasa_jpl_url"]
            }
            asteroids.append(asteroid)

    return asteroids

