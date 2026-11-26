import { PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Paginator } from '@/components/Paginator';
import AdminService from '../../services/Admin';
import { getErrorMessage } from '../../services/errors';
import type { AdminUser, AdminUserPage } from '../../services/types';
import { readPage } from '../../utils/pagination';

type Editing = { user: string; role: 'user' | 'admin' };

// Two roles, two buttons: a native select would need a component this project
// does not have, and a dropdown with two options is a wasted click on a phone.
const RoleChoice = ({
    value,
    onChange,
}: {
    value: 'user' | 'admin';
    onChange: (role: 'user' | 'admin') => void;
}) => {
    const { t } = useTranslation();

    return (
        <div
            className="flex gap-2"
            role="group"
            aria-label={t('admin.columns.role')}
        >
            {(['user', 'admin'] as const).map((role) => (
                <Button
                    key={role}
                    type="button"
                    size="sm"
                    variant={value === role ? 'default' : 'outline'}
                    aria-pressed={value === role}
                    onClick={() => onChange(role)}
                >
                    {t(`admin.roles.${role}`)}
                </Button>
            ))}
        </div>
    );
};

export const UsersPanel = () => {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = readPage(searchParams);
    const search = searchParams.get('search') ?? '';

    const [draft, setDraft] = useState(search);
    const [data, setData] = useState<AdminUserPage | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const [editing, setEditing] = useState<AdminUser | null>(null);
    const [removing, setRemoving] = useState<AdminUser | null>(null);

    const load = useCallback(async () => {
        setBusy(true);
        setError(null);

        try {
            setData(await AdminService.users({ page, search }));
        } catch (failure) {
            setData(null);
            setError(getErrorMessage(failure));
        } finally {
            setBusy(false);
        }
    }, [page, search]);

    useEffect(() => {
        load();
    }, [load]);

    const submitSearch = (event: FormEvent) => {
        event.preventDefault();

        const next = new URLSearchParams(searchParams);

        if (draft.trim()) {
            next.set('search', draft.trim());
        } else {
            next.delete('search');
        }

        // A new search starts at the first page: page 4 of the old query is
        // almost never page 4 of the new one.
        next.delete('page');
        setSearchParams(next);
    };

    return (
        <Card className="mx-auto w-full max-w-3xl">
            <CardHeader className="border-b">
                <CardTitle>{t('admin.usersTitle')}</CardTitle>
                <CardDescription>{t('admin.usersDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <form className="flex gap-2" onSubmit={submitSearch}>
                    <Input
                        aria-label={t('admin.search')}
                        placeholder={t('admin.search')}
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                    />
                    <Button type="submit" variant="secondary">
                        {t('admin.searchSubmit')}
                    </Button>
                </form>

                {error ? (
                    <Alert variant="destructive">
                        <AlertDescription className="text-destructive">
                            {error}
                        </AlertDescription>
                    </Alert>
                ) : null}

                {data ? (
                    data.items.length ? (
                        <ul className="flex flex-col divide-y">
                            {data.items.map((row) => (
                                <li
                                    key={row.id}
                                    className="flex flex-wrap items-center justify-between gap-2 py-3"
                                >
                                    <div className="flex min-w-0 flex-col">
                                        <span className="truncate font-medium">
                                            {row.user}
                                        </span>
                                        <span className="truncate text-xs text-muted-foreground">
                                            {row.email}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant={
                                                row.role === 'admin'
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                        >
                                            {t(`admin.roles.${row.role}`)}
                                        </Badge>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            aria-label={`${t('admin.edit')}: ${
                                                row.user
                                            }`}
                                            onClick={() => setEditing(row)}
                                        >
                                            <PencilSimpleIcon className="size-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            aria-label={`${t(
                                                'admin.delete'
                                            )}: ${row.user}`}
                                            onClick={() => setRemoving(row)}
                                        >
                                            <TrashIcon className="size-4" />
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            {t('admin.empty')}
                        </p>
                    )
                ) : busy ? (
                    <p className="text-sm text-muted-foreground">
                        {t('admin.loading')}
                    </p>
                ) : null}

                {data ? (
                    <Paginator page={data.page} pages={data.pages} />
                ) : null}
            </CardContent>

            <EditDialog
                user={editing}
                onClose={() => setEditing(null)}
                onSaved={async () => {
                    setEditing(null);
                    await load();
                }}
            />

            <DeleteDialog
                user={removing}
                onClose={() => setRemoving(null)}
                onDeleted={async () => {
                    setRemoving(null);
                    await load();
                }}
            />
        </Card>
    );
};

const EditDialog = ({
    user,
    onClose,
    onSaved,
}: {
    user: AdminUser | null;
    onClose: () => void;
    onSaved: () => void;
}) => {
    const { t } = useTranslation();
    const [nickname, setNickname] = useState('');
    const [role, setRole] = useState<'user' | 'admin'>('user');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    // The fields follow whichever row was opened, and reset when it closes, so a
    // half-typed password never follows an admin to the next person.
    useEffect(() => {
        setNickname(user?.user ?? '');
        setRole(user?.role ?? 'user');
        setPassword('');
        setError(null);
    }, [user]);

    const submit = async (event: FormEvent) => {
        event.preventDefault();

        if (!user) {
            return;
        }

        setBusy(true);
        setError(null);

        try {
            const changes: Editing & { password?: string } = {
                user: nickname,
                role,
            };

            if (password) {
                changes.password = password;
            }

            await AdminService.updateUser(user.id, changes);
            onSaved();
        } catch (failure) {
            setError(getErrorMessage(failure));
        } finally {
            setBusy(false);
        }
    };

    return (
        <Dialog
            open={Boolean(user)}
            onOpenChange={(open) => !open && onClose()}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t('admin.editTitle', { user: user?.user ?? '' })}
                    </DialogTitle>
                    <DialogDescription>
                        {t('admin.editDescription')}
                    </DialogDescription>
                </DialogHeader>
                <form className="flex flex-col gap-4" onSubmit={submit}>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="admin-edit-nickname">
                            {t('admin.nickname')}
                        </Label>
                        <Input
                            id="admin-edit-nickname"
                            value={nickname}
                            onChange={(event) =>
                                setNickname(event.target.value)
                            }
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>{t('admin.columns.role')}</Label>
                        <RoleChoice value={role} onChange={setRole} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="admin-edit-password">
                            {t('admin.newPassword')}
                        </Label>
                        <Input
                            id="admin-edit-password"
                            type="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                        />
                    </div>
                    {error ? (
                        <Alert variant="destructive">
                            <AlertTitle>{t('admin.couldNotSave')}</AlertTitle>
                            <AlertDescription className="text-destructive">
                                {error}
                            </AlertDescription>
                        </Alert>
                    ) : null}
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                {t('admin.cancel')}
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={busy}>
                            {busy ? t('admin.saving') : t('admin.save')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const DeleteDialog = ({
    user,
    onClose,
    onDeleted,
}: {
    user: AdminUser | null;
    onClose: () => void;
    onDeleted: () => void;
}) => {
    const { t } = useTranslation();
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        setError(null);
    }, [user]);

    const remove = async () => {
        if (!user) {
            return;
        }

        setBusy(true);
        setError(null);

        try {
            await AdminService.removeUser(user.id);
            onDeleted();
        } catch (failure) {
            setError(getErrorMessage(failure));
        } finally {
            setBusy(false);
        }
    };

    return (
        <Dialog
            open={Boolean(user)}
            onOpenChange={(open) => !open && onClose()}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('admin.deleteTitle')}</DialogTitle>
                    <DialogDescription>
                        {t('admin.deleteBody', { user: user?.user ?? '' })}
                    </DialogDescription>
                </DialogHeader>
                {error ? (
                    <Alert variant="destructive">
                        <AlertTitle>{t('admin.couldNotDelete')}</AlertTitle>
                        <AlertDescription className="text-destructive">
                            {error}
                        </AlertDescription>
                    </Alert>
                ) : null}
                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            {t('admin.cancel')}
                        </Button>
                    </DialogClose>
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={busy}
                        onClick={remove}
                    >
                        {t('admin.deleteConfirm')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
