import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { makeStore, renderWithProviders } from '../../test/helpers';
import { LectureForm } from '.';

const renderForm = (onSubmit = vi.fn()) =>
    renderWithProviders(
        <LectureForm
            title="Add lecture"
            submitLabel="Save"
            initialValues={{ topic: '', teacher: '', lesson: '' }}
            onSubmit={onSubmit}
        />,
        { store: makeStore() }
    );

describe('LectureForm', () => {
    it('is a page with a heading, not a card with a title', () => {
        renderForm();

        // The page used to be one Card with the title as a CardTitle, which read
        // as a different application next to the list pages.
        expect(
            screen.getByRole('heading', { level: 1, name: 'Add lecture' })
        ).toBeInTheDocument();
        expect(screen.getByText(/at least one image/)).toBeInTheDocument();
    });

    it('leaves a pristine form alone', () => {
        renderForm();

        expect(screen.getByLabelText('Topic')).not.toHaveAttribute(
            'aria-invalid',
            'true'
        );
        expect(
            screen.queryByText('Topic cannot be empty')
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText('Attach at least one image')
        ).not.toBeInTheDocument();
    });

    it('reports every missing field at once and does not call the service', async () => {
        const onSubmit = vi.fn();

        renderForm(onSubmit);

        await userEvent.click(screen.getByRole('button', { name: /Save/ }));

        expect(
            screen.getByText('Check the highlighted fields before saving.')
        ).toBeInTheDocument();
        expect(screen.getByText('Topic cannot be empty')).toBeInTheDocument();
        expect(
            screen.getByText('Attach at least one image')
        ).toBeInTheDocument();
        expect(screen.getByLabelText('Topic')).toHaveAttribute(
            'aria-invalid',
            'true'
        );
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('clears the topic message as soon as the field is edited', async () => {
        renderForm();

        await userEvent.click(screen.getByRole('button', { name: /Save/ }));
        expect(screen.getByText('Topic cannot be empty')).toBeInTheDocument();

        await userEvent.type(screen.getByLabelText('Topic'), 'Endodoncja');

        expect(
            screen.queryByText('Topic cannot be empty')
        ).not.toBeInTheDocument();
        expect(screen.getByLabelText('Topic')).not.toHaveAttribute(
            'aria-invalid',
            'true'
        );
    });
});
