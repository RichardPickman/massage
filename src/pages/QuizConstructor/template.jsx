import { Card, Button, Box } from '@mui/material';
import { memo } from 'react';
import React, { useCallback } from 'react';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import Question from '../../components/Question';
import QuestionConstructor from './QuestionConstructor';
import PropTypes from 'prop-types';

const QuestionTemplate = ({ questionData, updateQuestion, removeQuestion }) => {
    const { id, correctAnswers, isPreview } = questionData;

    const handleQuestionState = useCallback(
        (data, action) => {
            updateQuestion({
                ...data,
                isPreview: action === 'SAVE' ? true : false,
            });
        },
        [updateQuestion]
    );

    const removeCurrentQuestion = () => removeQuestion(id);

    return (
        <Card variant="outlined" sx={{ width: '100%' }}>
            <Box display="flex" flexDirection="column" gap={1} margin={1}>
                {!isPreview && (
                    <QuestionConstructor
                        questionId={questionData._id}
                        updateQuestion={updateQuestion}
                        questionData={questionData}
                    />
                )}
                {isPreview && (
                    <Question
                        currentQuestion={questionData}
                        currentState={{
                            currentAnswers: [],
                            showAnswers: true,
                            correctAnswers: correctAnswers,
                        }}
                    />
                )}
                <Box
                    display="flex"
                    justifyContent="right"
                    gap="1rem"
                    marginTop="1rem"
                >
                    {!isPreview ? (
                        <>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() =>
                                    handleQuestionState(questionData, 'SAVE')
                                }
                            >
                                Preview
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={removeCurrentQuestion}
                                endIcon={<DeleteOutlineOutlinedIcon />}
                            >
                                Delete
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={() =>
                                handleQuestionState(questionData, 'EDIT')
                            }
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
