import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import LectureService from '../../../services/Lecture';
import { makeStore, renderWithProviders } from '../../../test/helpers';
import type { LectureRow } from '../helpers';
import { LecturesTable } from './LecturesTable';

const rows: LectureRow[] = [
    {
        id: 'lecture-1',
        topic: 'Anatomy',
        lesson: 'Ortodoncja',
        teacher: 'Czerwińska',
        date: '19/10/2026',
        author: 'user-1',
    },
];

describe('LecturesTable', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders the rows it is handed', () => {
        renderWithProviders(
            <LecturesTable
                rows={rows}
                canManage={() => false}
                onRemoved={vi.fn()}
            />,
            { store: makeStore() }
        );

        expect(screen.getByRole('link', { name: 'Anatomy' })).toHaveAttribute(
            'href',
            '/lectures/lecture-1'
        );
        expect(screen.getByText('Ortodoncja')).toBeInTheDocument();
        expect(screen.getByText('Czerwińska')).toBeInTheDocument();
    });

    it('reports a removal without knowing where the rows came from', async () => {
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
            <LecturesTable
                rows={rows}
                canManage={() => true}
                onRemoved={onRemoved}
            />,
            { store: makeStore() }
        );

        await userEvent.click(
            screen.getByRole('button', { name: 'Remove Anatomy' })
        );
        await userEvent.click(screen.getByRole('button', { name: 'Remove' }));

        expect(LectureService.removeLecture).toHaveBeenCalledWith('lecture-1');
        expect(onRemoved).toHaveBeenCalled();
    });
});
