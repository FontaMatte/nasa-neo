import { Asteroid } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AsteroidTableProps {
  asteroids: Asteroid[];
}

export function AsteroidTable({ asteroids }: AsteroidTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Diametro (m)</TableHead>
          <TableHead>Distanza (km)</TableHead>
          <TableHead>Velocità (km/h)</TableHead>
          <TableHead>Pericoloso</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {asteroids.map((a) => (
          <TableRow key={a.id}>
            <TableCell className="font-medium">{a.name}</TableCell>
            <TableCell>{a.date}</TableCell>
            <TableCell>
              {a.diameter_min_m.toLocaleString()} – {a.diameter_max_m.toLocaleString()}
            </TableCell>
            <TableCell>{a.miss_distance_km.toLocaleString()}</TableCell>
            <TableCell>{a.velocity_kmh.toLocaleString()}</TableCell>
            <TableCell>
              {a.is_hazardous ? (
                <Badge variant="destructive">Sì</Badge>
              ) : (
                <Badge variant="secondary">No</Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}