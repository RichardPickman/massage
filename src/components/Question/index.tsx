import { useEffect, useMemo } from 'react';
import type { QuestionView } from '../../services/models';
import { ButtonHandler, type QuestionViewState } from '../ButtonHandler';

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
        <div className="flex w-full flex-col items-center gap-4">
            {imageSource ? (
                <img
                    src={imageSource}
                    alt="Question"
                    className="max-h-96 w-auto object-contain"
                />
            ) : null}
            {currentQuestion.question ? (
                <p className="text-center text-lg">{currentQuestion.question}</p>
            ) : null}
            <div className="grid w-full gap-2 sm:grid-cols-2">
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

