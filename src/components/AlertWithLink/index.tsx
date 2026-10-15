import { XIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { Alert as AlertPrimitive, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { alertStatuses, type AlertStatus } from '../../utils/consts';

interface AlertWithLinkProps {
    status: AlertStatus;
    text: string;
    onClose: () => void;
    path?: string;
    title?: string;
}

export const AlertWithLink = ({
    status,
    text,
    onClose,
    path,
    title,
}: AlertWithLinkProps) => {
    const navigate = useNavigate();
    const isSuccess = status === alertStatuses.SUCCESS;

    return (
        <AlertPrimitive
            variant={isSuccess ? 'default' : 'destructive'}
            className="items-center"
        >
            <AlertDescription className="flex-1 text-foreground">
                {text}
            </AlertDescription>
            {isSuccess && path ? (
                <Button
                    size="xs"
                    variant="outline"
                    onClick={() => navigate(path)}
                >
                    {title ? title : 'Open'}
                </Button>
            ) : null}
            <Button
                size="icon-xs"
                variant="ghost"
                aria-label="Close alert"
                onClick={onClose}
            >
                <XIcon />
            </Button>
        </AlertPrimitive>
    );
};

