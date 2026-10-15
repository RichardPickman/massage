import { useRouteError } from 'react-router-dom';

import { Card } from '@/components/ui/card';

const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
        return error.message;
    }

    return String(error);
};

export const ErrorPage = () => {
    const error = useRouteError();

    return (
        <Card className="mt-6 items-center gap-2 text-left">
            <p className="text-lg font-semibold">Oops!</p>
            <p>Sorry, an unexpected error has occurred.</p>
            <p className="text-muted-foreground">{getErrorMessage(error)}</p>
        </Card>
    );
};
