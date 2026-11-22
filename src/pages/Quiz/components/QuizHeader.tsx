import { useTranslation } from 'react-i18next';

import { BackLink } from '../../../components/BackLink';
import { Progress } from '../../../components/ui/progress';

interface QuizHeaderProps {
    title: string;
    current: number;
    total: number;
}

// The header of a test in progress, and nothing more than that.
//
// The shared PageHeader carries a rule, a kicker, a 36px title and its own
// spacing — about 200px on a phone, a quarter of the screen spent on facts that
// do not change while a question is being answered. In a focused view the two
// things that matter are where the student is and how far they have come, so the
// header is one row plus the line: about 68px, and the question gets the rest.
//
// The title stays in the document as the page's heading so the screen still has a
// name for a screen reader and for the browser tab; it is simply not the loudest
// thing on a screen where the question must be.
export const QuizHeader = ({ title, current, total }: QuizHeaderProps) => {
    const { t } = useTranslation();

    return (
        <header className="flex flex-col gap-2 border-b pb-3">
            <div className="flex items-center justify-between gap-3">
                <BackLink
                    to="/quiz"
                    label={t('quizzes.backAll')}
                    labelHiddenBelowSm
                />
                <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase tabular-nums">
                    {t('quiz.questionOf', { current, total })}
                </p>
            </div>
            <Progress value={(current / total) * 100} className="h-1" />
            <h1 className="sr-only">{title}</h1>
        </header>
    );
};
