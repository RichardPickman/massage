import { useState } from 'react';

import { Alert } from '@/components/Alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { alertStatuses } from '../utils/consts';

export type AuthFormData = {
    email: string;
    password: string;
};

interface AuthProps {
    submitting: boolean;
    errorData: string | null;
    onSubmit: (data: AuthFormData) => void;
    header: string;
}

export const Auth = ({
    submitting,
    errorData,
    onSubmit,
    header,
}: AuthProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <Card>
            <div className="flex gap-2">
                <p>{header}</p>
                {errorData && (
                    <Alert status={alertStatuses.FAIL} text={errorData} />
                )}
                <Input
                    required
                    autoFocus
                    autoComplete="on"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                />
                <Button
                    variant="outline"
                    disabled={submitting}
                    onClick={() => onSubmit({ email, password })}
                >
                    {submitting ? 'Submitting...' : 'Submit'}
                </Button>
            </div>
        </Card>
    );
};
