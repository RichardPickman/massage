import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';

// The first screen of the app for someone who is not signed in. It used to sell
// the product - a headline, a pitch and three numbered steps - which reads wrong
// for a room of students who were sent the link. A portal says what it is and
// offers the two things it has.
export const SignedOutHero = () => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-1 flex-col gap-8">
            <PageHeader
                title={t('stats.portal.title')}
                description={t('stats.portal.description')}
            />

            <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                    <Link to="/quiz">{t('stats.portal.tests')}</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                    <Link to="/lectures">{t('stats.portal.lectures')}</Link>
                </Button>
            </div>

            <p className="max-w-prose text-sm text-muted-foreground">
                {t('stats.portal.signInNote')}{' '}
                <Link
                    to="/auth/login"
                    className="underline underline-offset-4 hover:text-foreground"
                >
                    {t('stats.portal.signIn')}
                </Link>{' '}
                {t('stats.portal.or')}{' '}
                <Link
                    to="/auth/register"
                    className="underline underline-offset-4 hover:text-foreground"
                >
                    {t('stats.portal.createAccount')}
                </Link>
                .
            </p>
        </div>
    );
};
