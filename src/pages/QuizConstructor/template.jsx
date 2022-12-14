import { Card, Button, Box } from '@mui/material';
import React, { memo } from 'react';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import Question from '../../components/Question';
import QuestionConstructor from './QuestionConstructor';
import PropTypes from 'prop-types';

const QuestionTemplate = ({ questionData, updateQuestion, removeQuestion }) => {
    const [listRef] = useAutoAnimate();

    const togglePreview = (data, action) => {
        updateQuestion(questionData.id, {
            ...data,
            isPreview: action === 'SAVE' ? true : false,
        });
    };

    return (
        <Card variant="outlined" sx={{ width: '100%' }}>
            <Box
                display="flex"
                flexDirection="column"
                gap={1}
                margin={1}
                ref={listRef}
            >
                {!questionData.isPreview ? (
                    <QuestionConstructor
                        questionId={questionData.id}
                        updateQuestion={updateQuestion}
                        questionData={questionData}
                    />
                ) : (
                    <Question
                        currentQuestion={questionData}
                        currentState={{
                            correctAnswers: questionData.correctAnswers,
                            currentAnswers: [],
                            isFinished: false,
                            showAnswers: true,
                        }}
                        onSelect={() => {}}
                    />
                )}
                <Box
                    display="flex"
                    justifyContent="right"
                    gap="1rem"
                    marginTop="1rem"
                >
                    {!questionData.isPreview ? (
                        <>
                            <Button
                                variant="outlined"
                                color="success"
                                onClick={() =>
                                    togglePreview(questionData, 'SAVE')
                                }
                            >
                                Preview
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => removeQuestion(questionData.id)}
                                endIcon={<DeleteOutlineOutlinedIcon />}
                            >
                                Delete
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="outlined"
                            onClick={() => togglePreview(questionData, 'EDIT')}
                            endIcon={<ModeEditOutlineOutlinedIcon />}
                        >
                            Edit
                        </Button>
                    )}
                </Box>
            </Box>
        </Card>
    );
};

export default memo(QuestionTemplate);

QuestionTemplate.propTypes = {
    questionData: PropTypes.object,
    updateQuestion: PropTypes.func,
    removeQuestion: PropTypes.func,
};
