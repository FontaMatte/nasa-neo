import os
from dotenv import load_dotenv

load_dotenv()

NASA_API_KEY = os.getenv("NASA_API_KEY")
NASA_BASE_URL = "https://api.nasa.gov/neo/rest/v1"