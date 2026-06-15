class NasaError(Exception):
    """Errore generico nella comunicazione con l'API di NASA."""

class NasaRateLimitError(NasaError):
    """La NASA ha risposto con rate limit (429)."""

class NasaUnavailableError(NasaError):
    """La NASA è irraggiungibile (timeout, rete giù)."""