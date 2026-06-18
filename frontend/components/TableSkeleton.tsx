import { Skeleton } from "./ui/skeleton";

export function TableSkeleton() {
    return (
        <div className="space-y-3 my-8">
            {Array.from({ length: 6}).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
            ))}
        </div>
    );
}