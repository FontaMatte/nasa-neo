import { Asteroid } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SizeChartProps {
  asteroids: Asteroid[];
}

const BUCKETS = [
  { label: "0–50 m", min: 0, max: 50 },
  { label: "50–150 m", min: 50, max: 150 },
  { label: "150–500 m", min: 150, max: 500 },
  { label: "500 m–1 km", min: 500, max: 1000 },
  { label: "> 1 km", min: 1000, max: Infinity },
];

export function SizeChart({ asteroids }: SizeChartProps) {
  const data = BUCKETS.map((bucket) => ({
    label: bucket.label,
    count: asteroids.filter(
      (a) => a.diameter_max_m >= bucket.min && a.diameter_max_m < bucket.max
    ).length,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid />
        <XAxis dataKey="label" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}