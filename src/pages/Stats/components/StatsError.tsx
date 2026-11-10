import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface StatsErrorProps {
    message: string;
    onRetry: () => void;
}

export const StatsError = ({ message, onRetry }: StatsErrorProps) => (
    <Card className="mx-auto w-full max-w-lg">
        <CardHeader>
            <CardTitle>Stats unavailable</CardTitle>
            <CardDescription>
                Your record lives on the server, and the request did not come
                back.
            </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
            <Alert variant="destructive">
                <div className="flex flex-col gap-1">
                    <AlertTitle>Could not load your stats</AlertTitle>
                    <AlertDescription className="text-destructive">
                        {message}
                    </AlertDescription>
                </div>
            </Alert>
            <Button className="self-start" onClick={onRetry}>
                Try again
            </Button>
        </CardContent>
    </Card>
);
