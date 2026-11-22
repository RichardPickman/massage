import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { QuestionView } from '../../services/models';
import { ButtonHandler, type QuestionViewState } from '../ButtonHandler';
import { ImageLightbox } from '../ImageLightbox';

interface QuestionProps {
    currentQuestion: QuestionView;
    currentState: QuestionViewState;
    onSelect: (id: string) => void;
}

export const Question = ({
    currentState,
    currentQuestion,
    onSelect,
}: QuestionProps) => {
    const { t } = useTranslation();
    const { img } = currentQuestion;

    const imageSource = useMemo(() => {
        if (!img) {
            return null;
        }

        return typeof img === 'string' ? img : window.URL.createObjectURL(img);
    }, [img]);

    useEffect(
        () => () => {
            if (imageSource && imageSource.startsWith('blob:')) {
                window.URL.revokeObjectURL(imageSource);
            }
        },
        [imageSource]
    );

    return (
        // justify-center: a short question should sit in the middle of the
        // screen, not cling to the top of a half-empty card. gap-6 separates the
        // question from its answers; the answers themselves stay tight (gap-2)
        // because they are one group of alternatives.
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-6">
            {imageSource ? (
                <ImageLightbox
                    src={imageSource}
                    alt={currentQuestion.question || t('common.questionImage')}
                    className="max-h-[40dvh] w-auto max-w-full object-contain"
                />
            ) : null}
            {currentQuestion.question ? (
                <p className="max-w-[65ch] text-center text-lg font-medium text-balance md:text-xl">
                    {currentQuestion.question}
                </p>
            ) : null}
            <div className="grid w-full gap-2 sm:grid-cols-2 sm:gap-3">
                {currentQuestion.answers.map((answer) =>
                    answer.text ? (
                        <ButtonHandler
                            key={answer.id}
                            state={{ ...currentState, answer, onSelect }}
                        />
                    ) : null
                )}
            </div>
        </div>
    );
};
