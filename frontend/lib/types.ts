export interface Asteroid {
    id: string;
    name: string;
    date: string;
    diameter_min_m: number;
    diameter_max_m: number;
    miss_distance_km: number;
    velocity_kmh: number;
    is_hazardous: boolean;
    nasa_jpl_url: string;
}

export interface NeosResponse {
    count: number;
    chunks_total: number;
    chunks_from_cache: number;
    asteroids: Asteroid[];
}