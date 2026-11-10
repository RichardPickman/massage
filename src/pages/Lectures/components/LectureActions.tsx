import {
    CircleNotchIcon,
    PencilSimpleIcon,
    TrashIcon,
} from '@phosphor-icons/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '../../../components/ui/alert';
import { Button } from '../../../components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../../../components/ui/dialog';
import LectureService from '../../../services/Lecture';
import { getErrorMessage } from '../../../services/errors';

interface LectureActionsProps {
    id: string;
    topic: string;
    canManage: boolean;
    onRemoved: () => void;
}

export const LectureActions = ({
    id,
    topic,
    canManage,
    onRemoved,
}: LectureActionsProps) => {
    const [isConfirming, setIsConfirming] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [removeError, setRemoveError] = useState<string | null>(null);

    // The server only lets the author (or an admin) change a lecture, so the
    // controls are hidden for everyone else instead of ending in a 403.
    if (!canManage) {
        return null;
    }

    // The request cannot be cancelled, so the dialog stays put until it settles.
    const handleConfirmOpenChange = (open: boolean) => {
        if (!isRemoving) {
            setIsConfirming(open);
        }
    };

    const handleRemove = async () => {
        setIsRemoving(true);
        setRemoveError(null);

        try {
            await LectureService.removeLecture(id);

            setIsConfirming(false);
            onRemoved();
        } catch (error) {
            setRemoveError(getErrorMessage(error));
        } finally {
            setIsRemoving(false);
        }
    };

    return (
        <div className="flex items-center justify-end gap-1">
            <Button
                asChild
                variant="ghost"
                size="icon-sm"
                aria-label={`Edit ${topic}`}
            >
                <Link to={`/lectures/${id}/edit`}>
                    <PencilSimpleIcon />
                </Link>
            </Button>
            <Dialog open={isConfirming} onOpenChange={handleConfirmOpenChange}>
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        disabled={isRemoving}
                        aria-label={`Remove ${topic}`}
                    >
                        <TrashIcon />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Remove lecture?</DialogTitle>
                        <DialogDescription>
                            {topic} and its images will be deleted permanently.
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    {removeError ? (
                        <Alert variant="destructive">
                            <div className="flex flex-col gap-1">
                                <AlertTitle>Lecture was not removed</AlertTitle>
                                <AlertDescription className="text-destructive">
                                    {removeError}
                                </AlertDescription>
                            </div>
                        </Alert>
                    ) : null}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            disabled={isRemoving}
                            onClick={() => handleConfirmOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={isRemoving}
                            onClick={handleRemove}
                        >
                            {isRemoving ? (
                                <>
                                    <CircleNotchIcon className="animate-spin" />
                                    Removing...
                                </>
                            ) : (
                                'Remove'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
