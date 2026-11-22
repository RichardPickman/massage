import { ImageIcon, TrashIcon } from '@phosphor-icons/react';
import { memo, useId, useRef, useState, type DragEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ImageLightbox } from '../ImageLightbox';

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

// Both entry points run through this, so a dropped file and a picked file can
// never disagree about what is acceptable.
// A code, not a sentence: the same rule is rendered in whichever language the
// reader chose, and a message held in state would stay English after a switch.
export type ImageProblem = 'notImage' | 'tooLarge';

export const imageProblem = (file: File): ImageProblem | null => {
    if (!file.type.startsWith('image/')) {
        return 'notImage';
    }

    if (file.size > MAX_IMAGE_BYTES) {
        return 'tooLarge';
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
        const { t } = useTranslation();
        const [isDragging, setIsDragging] = useState(false);
        const [problem, setProblem] = useState<ImageProblem | null>(null);
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

        const problemMessage = (code: ImageProblem) => {
            if (code === 'notImage') {
                return t('upload.notImage');
            }

            return t('upload.tooLarge');
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
                        {/* Same viewer as the quiz question view, so one
                            affordance covers both. */}
                        <ImageLightbox src={image} alt={text}>
                            <span className="truncate">{text}</span>
                        </ImageLightbox>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            className="size-11"
                            aria-label={t('upload.remove')}
                            onClick={removeImage}
                        >
                            <TrashIcon />
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-muted-foreground">
                            {t('upload.dropHint')}
                        </p>
                        <Button
                            asChild
                            variant="outline"
                            className="min-h-11 self-start"
                        >
                            <label htmlFor={inputId}>
                                <ImageIcon />
                                {t('upload.pick')}
                            </label>
                        </Button>
                    </div>
                )}
                {problem ? (
                    <p role="alert" className="text-xs text-destructive">
                        {problemMessage(problem)}
                    </p>
                ) : null}
            </div>
        );
    }
);

FileUpload.displayName = 'FileUpload';
