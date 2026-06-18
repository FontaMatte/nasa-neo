import { NeosResponse} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchNeos(
    startDate: string,
    endDate: string
): Promise<NeosResponse> {
    const url = `${API_BASE}/api/neos?start_date=${startDate}&end_date=${endDate}`;
    const response = await fetch(url);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Errore nel caricamento degli asteroidi");
    }

    return response.json();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchNeoDetail(id: string): Promise<any> {
    const url = `${API_BASE}/api/neos/${id}`;
    const response = await fetch(url);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Errore nel caricamento dei dettagli dell'asteroide");
    }

    return response.json();
}