import { NeosResponse} from './types';

const API_BASE = "http://localhost:8000";

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