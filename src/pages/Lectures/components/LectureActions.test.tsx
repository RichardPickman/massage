import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import LectureService from '../../../services/Lecture';
import { makeStore, renderWithProviders } from '../../../test/helpers';
import { LectureActions } from './LectureActions';

const lecture = {
    id: 'lecture-1',
    topic: 'Anatomy',
    canManage: true,
};

describe('LectureActions', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('shows the edit link and removal control to the owner', () => {
        renderWithProviders(
            <LectureActions {...lecture} onRemoved={vi.fn()} />,
            {
                store: makeStore(),
            }
        );

        expect(
            screen.getByRole('link', { name: 'Edit Anatomy' })
        ).toHaveAttribute('href', '/lectures/lecture-1/edit');
        expect(
            screen.getByRole('button', { name: 'Remove Anatomy' })
        ).toBeInTheDocument();
    });

    it('hides both controls when the lecture belongs to someone else', () => {
        const { container } = renderWithProviders(
            <LectureActions
                {...lecture}
                canManage={false}
                onRemoved={vi.fn()}
            />,
            { store: makeStore() }
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('removes the lecture and asks the list to reload', async () => {
        const onRemoved = vi.fn();

        vi.spyOn(LectureService, 'removeLecture').mockResolvedValue({
            message: 'Removed successfully',
            payload: {
                _id: 'lecture-1',
                topic: 'Anatomy',
                images: [],
                teacher: [],
                lesson: [],
                date: '',
            },
        });

        renderWithProviders(
            <LectureActions {...lecture} onRemoved={onRemoved} />,
            { store: makeStore() }
        );

        await userEvent.click(
            screen.getByRole('button', { name: 'Remove Anatomy' })
        );
        await userEvent.click(screen.getByRole('button', { name: 'Remove' }));

        expect(LectureService.removeLecture).toHaveBeenCalledWith('lecture-1');
        expect(onRemoved).toHaveBeenCalled();
    });

    it('keeps the dialog open and shows the error when removal fails', async () => {
        const onRemoved = vi.fn();

        vi.spyOn(LectureService, 'removeLecture').mockRejectedValue(
            new Error('Delete failed')
        );

        renderWithProviders(
            <LectureActions {...lecture} onRemoved={onRemoved} />,
            { store: makeStore() }
        );

        await userEvent.click(
            screen.getByRole('button', { name: 'Remove Anatomy' })
        );
        await userEvent.click(screen.getByRole('button', { name: 'Remove' }));

        expect(
            await screen.findByText('Lecture was not removed')
        ).toBeInTheDocument();
        expect(screen.getByText('Delete failed')).toBeInTheDocument();
        expect(onRemoved).not.toHaveBeenCalled();
    });
});
