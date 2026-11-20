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
                listState={{ listUrl: '/lectures?page=2' }}
                onRemoved={vi.fn()}
            />,
            { store: makeStore() }
        );

        // Card list and table both live in the DOM; a browser shows one of
        // them, jsdom applies no media queries.
        expect(
            screen.getAllByRole('link', { name: 'Anatomy' })[0]
        ).toHaveAttribute('href', '/lectures/lecture-1');
        expect(screen.getAllByText('Ortodoncja')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Czerwińska')[0]).toBeInTheDocument();
        expect(screen.getAllByText('19/10/2026')[0]).toBeInTheDocument();
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
                listState={{ listUrl: '/lectures?page=2' }}
                onRemoved={onRemoved}
            />,
            { store: makeStore() }
        );

        await userEvent.click(
            screen.getAllByRole('button', { name: 'Remove Anatomy' })[0]
        );
        await userEvent.click(
            screen.getAllByRole('button', { name: 'Remove' })[0]
        );

        expect(LectureService.removeLecture).toHaveBeenCalledWith('lecture-1');
        expect(onRemoved).toHaveBeenCalled();
    });
});
