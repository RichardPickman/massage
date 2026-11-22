import {
    CircleNotchIcon,
    PencilSimpleIcon,
    TrashIcon,
} from '@phosphor-icons/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import type { LectureListState } from '../../../utils/lectureList';

interface LectureActionsProps {
    id: string;
    topic: string;
    canManage: boolean;
    listState: LectureListState;
    onRemoved: () => void;
}

export const LectureActions = ({
    id,
    topic,
    canManage,
    listState,
    onRemoved,
}: LectureActionsProps) => {
    const { t } = useTranslation();
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
                className="size-11 md:size-8"
                aria-label={t('lectures.edit', { topic })}
            >
                <Link to={`/lectures/${id}/edit`} state={listState}>
                    <PencilSimpleIcon />
                </Link>
            </Button>
            <Dialog open={isConfirming} onOpenChange={handleConfirmOpenChange}>
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="size-11 md:size-8"
                        disabled={isRemoving}
                        aria-label={t('lectures.remove', { topic })}
                    >
                        <TrashIcon />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('lectures.removeTitle')}</DialogTitle>
                        <DialogDescription>
                            {t('lectures.removeBody', { topic })}
                        </DialogDescription>
                    </DialogHeader>
                    {removeError ? (
                        <Alert variant="destructive">
                            <div className="flex flex-col gap-1">
                                <AlertTitle>
                                    {t('lectures.removeFailed')}
                                </AlertTitle>
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
                            {t('common.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={isRemoving}
                            onClick={handleRemove}
                        >
                            {isRemoving ? (
                                <>
                                    <CircleNotchIcon className="animate-spin" />
                                    {t('common.removing')}
                                </>
                            ) : (
                                t('common.remove')
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
