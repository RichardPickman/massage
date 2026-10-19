import { ImageIcon, TrashIcon } from '@phosphor-icons/react';
import { type ChangeEvent, memo, useId, useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';

interface FileUploadProps {
    image: string | null;
    text: string;
    handleImage: (event: ChangeEvent<HTMLInputElement>) => void;
    removeImage: () => void;
}

export const FileUpload = memo(
    ({ image, removeImage, handleImage, text }: FileUploadProps) => {
        const [isPreviewOpen, setIsPreviewOpen] = useState(false);
        const inputId = useId();

        return (
            <div className="flex flex-col gap-2">
                <Input
                    id={inputId}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImage}
                />
                {image ? (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsPreviewOpen(true)}
                        >
                            {text}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Remove image"
                            onClick={removeImage}
                        >
                            <TrashIcon />
                        </Button>
                    </div>
                ) : (
                    <Button asChild variant="outline" className="self-start">
                        <label htmlFor={inputId}>
                            <ImageIcon />
                            Upload image
                        </label>
                    </Button>
                )}
                <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                    <DialogContent className="max-w-3xl">
                        <DialogTitle className="sr-only">{text}</DialogTitle>
                        {image ? (
                            <img
                                src={image}
                                alt={text}
                                className="w-full object-contain"
                            />
                        ) : null}
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
);

FileUpload.displayName = 'FileUpload';
