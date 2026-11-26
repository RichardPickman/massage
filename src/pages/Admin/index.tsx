import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { RegistrationCodePanel } from './RegistrationCodePanel';
import { UsersPanel } from './UsersPanel';

type Tab = 'code' | 'users';

export const Admin = () => {
    const { t } = useTranslation();
    const [tab, setTab] = useState<Tab>('code');

    const tabs: { id: Tab; label: string }[] = [
        { id: 'code', label: t('admin.tabs.code') },
        { id: 'users', label: t('admin.tabs.users') },
    ];

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
            {/* Two tabs rather than two pages: an admin switches between reading the
                code and looking after people in the same sitting. Buttons, not raw
                elements, so the shape and the focus ring come from one place. */}
            <div
                className="flex gap-1 rounded-lg border p-1"
                role="tablist"
                aria-label={t('admin.title')}
            >
                {tabs.map(({ id, label }) => (
                    <Button
                        key={id}
                        type="button"
                        role="tab"
                        aria-selected={tab === id}
                        size="sm"
                        variant={tab === id ? 'default' : 'ghost'}
                        className="flex-1"
                        onClick={() => setTab(id)}
                    >
                        {label}
                    </Button>
                ))}
            </div>

            <div role="tabpanel">
                {tab === 'code' ? <RegistrationCodePanel /> : <UsersPanel />}
            </div>
        </div>
    );
};
