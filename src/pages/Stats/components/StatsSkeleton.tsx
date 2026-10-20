import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const StatsSkeleton = () => (
    <div className="flex flex-col gap-6" aria-busy="true" aria-live="polite">
        <div className="flex flex-col gap-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-9 w-72" />
        </div>
        <Card>
            <CardHeader>
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-64" />
            </CardHeader>
            <CardContent className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
                <Skeleton className="h-20 w-44" />
                <div className="flex flex-col gap-6">
                    <Skeleton className="h-1.5 w-full" />
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="flex flex-col gap-2">
                                <Skeleton className="h-2 w-14" />
                                <Skeleton className="h-5 w-10" />
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-10 w-full" />
                ))}
            </CardContent>
        </Card>
        <span className="sr-only">Loading your stats...</span>
    </div>
);
