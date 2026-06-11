from fastapi import FastAPI

app = FastAPI(title="NASA NEO Dashboard API")

@app.get("/")
def health_check():
    return {"status": "ok"}