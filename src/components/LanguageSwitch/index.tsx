import { useTranslation } from 'react-i18next';

import { cn } from 'cn';
import { Button } from '@/components/ui/button';
import { LANGUAGES, setLanguage, type Language } from '../../i18n';

const labels: Record<Language, string> = {
    pl: 'PL',
    en: 'EN',
};

interface LanguageSwitchProps {
    className?: string;
}

// Two buttons rather than a select: there are two languages, and a select costs
// a click to discover what the options are.
export const LanguageSwitch = ({ className }: LanguageSwitchProps) => {
    const { t, i18n } = useTranslation();
    const current = i18n.resolvedLanguage ?? 'pl';

    return (
        <div
            role="group"
            aria-label={t('common.language')}
            className={cn('flex items-center gap-1', className)}
        >
            {LANGUAGES.map((language) => (
                <Button
                    key={language}
                    size="xs"
                    variant={current === language ? 'default' : 'ghost'}
                    aria-pressed={current === language}
                    className="min-h-9 min-w-11"
                    onClick={() => setLanguage(language)}
                >
                    {labels[language]}
                </Button>
            ))}
        </div>
    );
};
