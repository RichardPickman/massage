import { TrashIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { Card } from '../../../../components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '../../../../components/ui/dialog';
import type { ExistingImage } from '../../helpers';

interface ExistingImageListProps {
    images: ExistingImage[];
    remove: (key: string) => void;
}

export const ExistingImageList = ({
    images,
    remove,
}: ExistingImageListProps) => {
    const [preview, setPreview] = useState<ExistingImage | null>(null);

    if (images.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-2">
            {images.map((image, index) => (
                <Card key={image.key} className="w-40 gap-1 p-1">
                    <img
                        src={image.url}
                        alt={`Saved lecture image ${index + 1}`}
                        onClick={() => setPreview(image)}
                        className="h-24 w-full cursor-zoom-in object-cover"
                    />
                    <div className="flex items-center justify-between gap-1 px-1">
                        <p className="text-xs text-muted-foreground">Saved</p>
                        <Button
                            size="icon-xs"
                            variant="ghost"
                            aria-label={`Remove saved image ${index + 1}`}
                            onClick={() => remove(image.key)}
                        >
                            <TrashIcon />
                        </Button>
                    </div>
                </Card>
            ))}
            <Dialog
                open={Boolean(preview)}
                onOpenChange={(open) => {
                    if (!open) {
                        setPreview(null);
                    }
                }}
            >
                <DialogContent className="max-w-3xl">
                    <DialogTitle className="sr-only">
                        Saved lecture image
                    </DialogTitle>
                    {preview ? (
                        <img
                            src={preview.url}
                            alt="Saved lecture"
                            className="w-full object-contain"
                        />
                    ) : null}
                </DialogContent>
            </Dialog>
        </div>
    );
};
