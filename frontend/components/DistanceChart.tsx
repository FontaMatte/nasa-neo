import { Asteroid } from "@/lib/types";
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface DistanceChartProps {
    asteroids: Asteroid[];
}

export function DistanceChart({ asteroids }: DistanceChartProps) {
    const data = asteroids.map((a) => ({
        date: a.date,
        distance: Math.round(a.miss_distance_km),
        name: a.name,
    }));

    return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid />
        <XAxis dataKey="date" name="Data" />
        <YAxis
          dataKey="distance"
          name="Distanza"
          tickFormatter={(value) => `${(value / 1_000_000).toFixed(1)}M`}
          width={100}
        />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Scatter name="Asteroidi" data={data} fill="#8884d8" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}