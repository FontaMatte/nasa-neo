import time

class SimpleCache:
    def __init__(self):
        self._store = {}

    def get(self, key: str):
        # 1. se la chiave non è in _store -> restituisci None
        if key not in self._store: 
            return None
        # 2. recupera la coppia (scadenza, valore)
        expires_at, value = self._store[key]
        # 3. se time.time() è oltre la scadenza -> elimina la chiave e restituisci None
        if time.time() > expires_at:
            del self._store[key]
            return None
        # 4. altrimenti restituisci il valore
        return value

    def set(self, key: str, value, ttl_seconds: int):
        # salva in _store, alla chiave data, la coppia (scadenza, valore)
        self._store[key] = (time.time() + ttl_seconds, value)


cache = SimpleCache()