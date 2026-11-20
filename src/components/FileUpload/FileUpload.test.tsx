import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FileUpload, MAX_IMAGE_BYTES } from '.';

const imageFile = (name = 'slide.png', type = 'image/png', size = 2048) => {
    const file = new File(['x'], name, { type });

    Object.defineProperty(file, 'size', { value: size });

    return file;
};

const setup = (overrides: Partial<Parameters<typeof FileUpload>[0]> = {}) => {
    const onSelectFile = vi.fn();
    const removeImage = vi.fn();

    render(
        <FileUpload
            image={null}
            text="File unnamed"
            onSelectFile={onSelectFile}
            removeImage={removeImage}
            {...overrides}
        />
    );

    return {
        onSelectFile,
        removeImage,
        zone: screen.getByTestId('image-drop-zone'),
    };
};

const drop = (zone: HTMLElement, files: File[]) =>
    fireEvent.drop(zone, { dataTransfer: { files, types: ['Files'] } });

describe('FileUpload', () => {
    it('offers both a drop hint and a picker', () => {
        setup();

        expect(
            screen.getByText('Drop an image here, or choose a file')
        ).toBeInTheDocument();
        expect(screen.getByText('Upload image')).toBeInTheDocument();
    });

    it('takes an image dropped on the zone', () => {
        const { onSelectFile, zone } = setup();
        const file = imageFile();

        drop(zone, [file]);

        expect(onSelectFile).toHaveBeenCalledWith(file);
    });

    it('still takes an image through the picker', async () => {
        const { onSelectFile } = setup();
        const file = imageFile('picked.png');

        await userEvent.upload(screen.getByLabelText('Upload image'), file);

        expect(onSelectFile).toHaveBeenCalledWith(file);
    });

    it('rejects a file that is not an image and keeps the question untouched', () => {
        const { onSelectFile, zone } = setup();

        drop(zone, [imageFile('notes.pdf', 'application/pdf')]);

        expect(onSelectFile).not.toHaveBeenCalled();
        expect(
            screen.getByText('Only image files can be attached to a question')
        ).toBeInTheDocument();
    });

    it('rejects an image over the size limit', () => {
        const { onSelectFile, zone } = setup();

        drop(zone, [imageFile('huge.png', 'image/png', MAX_IMAGE_BYTES + 1)]);

        expect(onSelectFile).not.toHaveBeenCalled();
        expect(
            screen.getByText('Image is larger than 10 MB')
        ).toBeInTheDocument();
    });

    it('clears the complaint after a successful pick', () => {
        const { zone } = setup();

        drop(zone, [imageFile('notes.pdf', 'application/pdf')]);
        expect(screen.getByRole('alert')).toBeInTheDocument();

        drop(zone, [imageFile('slide.png')]);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('replaces an existing image when another is dropped', () => {
        const onSelectFile = vi.fn();

        render(
            <FileUpload
                image="blob:preview"
                text="slide.png"
                onSelectFile={onSelectFile}
                removeImage={vi.fn()}
            />
        );

        const replacement = imageFile('replacement.png');

        drop(screen.getByTestId('image-drop-zone'), [replacement]);

        expect(onSelectFile).toHaveBeenCalledWith(replacement);
    });

    it('marks the zone while a drag is over it', () => {
        const { zone } = setup();

        fireEvent.dragEnter(zone);

        expect(zone.className).toContain('border-primary');

        fireEvent.dragLeave(zone);

        expect(zone.className).not.toContain('border-primary');
    });

    it('does not let the browser navigate away on drop', () => {
        const { zone } = setup();
        const event = new Event('drop', { bubbles: true, cancelable: true });

        zone.dispatchEvent(event);

        expect(event.defaultPrevented).toBe(true);
    });
});
