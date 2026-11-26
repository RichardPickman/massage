import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from 'cn';

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
                code and looking after people in the same sitting. */}
            <div
                className="flex gap-1 rounded-lg border p-1"
                role="tablist"
                aria-label={t('admin.title')}
            >
                {tabs.map(({ id, label }) => (
                    <button
                        key={id}
                        type="button"
                        role="tab"
                        aria-selected={tab === id}
                        onClick={() => setTab(id)}
                        className={cn(
                            'flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                            tab === id
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted'
                        )}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div role="tabpanel">
                {tab === 'code' ? <RegistrationCodePanel /> : <UsersPanel />}
            </div>
        </div>
    );
};
