import { MagnifyingGlassPlusIcon } from '@phosphor-icons/react';
import { useState, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from 'cn';

interface ImageLightboxProps {
    src: string;
    alt: string;
    // Class names for the inline image; the enlarged copy always fits the screen.
    className?: string;
    // Optional trigger (a button naming the file). Without it the image is the
    // trigger, which is what the question view wants.
    children?: ReactNode;
    hint?: string;
}

// One viewer for every image we show: attaching, taking a test, reviewing. Wide
// screenshots are unreadable at thumbnail size, and a second, subtly different
// preview elsewhere is how these drift apart.
export const ImageLightbox = ({
    src,
    alt,
    className,
    children,
    hint = 'Tap to enlarge',
}: ImageLightboxProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {children ? (
                <Button
                    type="button"
                    variant="outline"
                    className="min-h-11 max-w-full justify-start"
                    onClick={() => setIsOpen(true)}
                >
                    {children}
                </Button>
            ) : (
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="group relative max-w-full cursor-zoom-in"
                    aria-label={`${alt} — ${hint}`}
                >
                    <img src={src} alt={alt} className={cn(className)} />
                    <span className="pointer-events-none absolute right-2 bottom-2 flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 text-[0.6875rem] tracking-[0.08em] text-muted-foreground uppercase opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                        <MagnifyingGlassPlusIcon className="size-3.5" />
                        {hint}
                    </span>
                </button>
            )}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-[95vw] sm:max-w-5xl">
                    <DialogTitle className="sr-only">{alt}</DialogTitle>
                    <img
                        src={src}
                        alt={alt}
                        className="mx-auto max-h-[85dvh] w-auto object-contain"
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};
