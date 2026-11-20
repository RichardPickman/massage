import { ImageIcon, TrashIcon } from '@phosphor-icons/react';
import { memo, useId, useRef, useState, type DragEvent } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

// Both entry points run through this, so a dropped file and a picked file can
// never disagree about what is acceptable.
export const imageProblem = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
        return 'Only image files can be attached to a question';
    }

    if (file.size > MAX_IMAGE_BYTES) {
        return 'Image is larger than 10 MB';
    }

    return null;
};

interface FileUploadProps {
    image: string | null;
    text: string;
    // The file, not the change event: dragging and the picker must land in the
    // same place, and a drop event has no input element behind it.
    onSelectFile: (file: File | null) => void;
    removeImage: () => void;
}

export const FileUpload = memo(
    ({ image, removeImage, onSelectFile, text }: FileUploadProps) => {
        const [isPreviewOpen, setIsPreviewOpen] = useState(false);
        const [isDragging, setIsDragging] = useState(false);
        const [problem, setProblem] = useState<string | null>(null);
        const inputId = useId();
        // dragenter/dragleave fire for every child element; counting keeps the
        // highlight from strobing while the cursor moves over inner nodes.
        const dragDepth = useRef(0);

        const accept = (file: File | null | undefined) => {
            if (!file) {
                return;
            }

            const issue = imageProblem(file);

            if (issue) {
                setProblem(issue);
                return;
            }

            setProblem(null);
            onSelectFile(file);
        };

        const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            dragDepth.current += 1;
            setIsDragging(true);
        };

        const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            dragDepth.current = Math.max(dragDepth.current - 1, 0);

            if (dragDepth.current === 0) {
                setIsDragging(false);
            }
        };

        const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
            // Without this the browser opens the file instead of dropping it.
            event.preventDefault();
        };

        const handleDrop = (event: DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            dragDepth.current = 0;
            setIsDragging(false);
            accept(event.dataTransfer?.files?.[0]);
        };

        const dropZoneClass = isDragging
            ? 'flex flex-col gap-2 rounded-md border border-dashed border-primary bg-primary/5 p-3'
            : 'flex flex-col gap-2 rounded-md border border-dashed border-border p-3';

        return (
            <div
                className={dropZoneClass}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                data-testid="image-drop-zone"
            >
                <Input
                    id={inputId}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(event) => {
                        accept(event.target.files?.[0]);
                        // Reset, so picking the same file again still fires.
                        event.target.value = '';
                    }}
                />
                {image ? (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="min-h-11"
                            onClick={() => setIsPreviewOpen(true)}
                        >
                            {text}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            className="size-11"
                            aria-label="Remove image"
                            onClick={removeImage}
                        >
                            <TrashIcon />
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-muted-foreground">
                            Drop an image here, or choose a file
                        </p>
                        <Button
                            asChild
                            variant="outline"
                            className="min-h-11 self-start"
                        >
                            <label htmlFor={inputId}>
                                <ImageIcon />
                                Upload image
                            </label>
                        </Button>
                    </div>
                )}
                {problem ? (
                    <p role="alert" className="text-xs text-destructive">
                        {problem}
                    </p>
                ) : null}
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
