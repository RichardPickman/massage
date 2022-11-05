import { Card, TextField, Button, Box, Grid, Typography, Stack } from "@mui/material";
import { memo, useState } from "react";

import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

import AnswerWithCheckbox from "../../components/AnswerWithCheckbox";
import Answer from "../../components/Answer";
import { useEffect } from "react";

const prepareQuestion = (question, action, callback) => {
  switch(action) {
    case "SAVE": {
      const result = { ...question };
      const lastElementIndex = result.answers.length - 1;

      if (!result.answers[lastElementIndex]) {
        result.answers.pop();
      }

      if (result.correctAnswers.includes(lastElementIndex)) {
        result.correctAnswers = result.correctAnswers.filter(item => item !== lastElementIndex);
      }

      result.isPreview = true;

      callback(result);

      return;
    };
    case "EDIT": {
      const result = { ...question };

      result.answers.push('');

      result.isPreview = false;

      callback(result);

      return;
    }
    default: return;
  }
}

const QuestionTemplate = ({ questionData, updateQuestion, removeQuestion }) => {
  const [title, setTitle] = useState(questionData.question ||  '');
  const [answers, setAnswers] = useState(questionData.answers || ['']);
  const [correctAnswers, setCorrectAnswers] = useState(questionData.correctAnswers || []);
  
  const handleQuestionState = (action) => prepareQuestion({
    id: questionData.id,
    img: "",
    question: title, 
    answers: answers, 
    correctAnswers: correctAnswers,
  }, action, (data) => updateQuestion(data));

  const addAnswer = (answer, answerId) => {
    const answersCopy = answers.map((text, index) => {
      if (index === answerId) {
        return answer
      }

      return text;
    });

    setAnswers(answersCopy);
  };

  const handleCorrectAnswer = (index) => {
    const isExist = correctAnswers.includes(index);
    const correctAnswersCopy = isExist ? correctAnswers.filter(item => item !== index) : [...correctAnswers, index];

    setCorrectAnswers(correctAnswersCopy);
  };

  const addBlank = (index) => index === answers.length - 1 && setAnswers([...answers, '']);

  const removeCurrentQuestion = () => removeQuestion(questionData.id);

  useEffect(() => updateQuestion({
    id: questionData.id,
    question: title, 
    answers: answers, 
    correctAnswers: correctAnswers,
  }), [title, answers, correctAnswers]);

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <Box display="flex" flexDirection="column" gap={1} margin={1}>
          {!questionData.isPreview &&
            <Box display="flex" margin={1} flexDirection="column" justifyContent="center" gap="1rem" direction="row" spacing={2}>
              <TextField id="outlined-basic" label="Question" variant="outlined" onChange={(event) => setTitle(event.target.value)}/>
              <Grid container spacing={2}>
                {answers.map((answer, i) => (
                  <Grid item key={i} xs={6}>
                    <AnswerWithCheckbox 
                      key={i}
                      questionId={questionData.id} 
                      answerId={i}
                      addAnswer={addAnswer} 
                      handleCorrectAnswer={handleCorrectAnswer} 
                      addBlank={addBlank}
                      predefinedText={answer}
                      predefinedCheckbox={correctAnswers.includes(i)} 
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          }
          {questionData.isPreview && (
            <Box  display="flex" flexDirection="column" alignItems="center" gap="1rem" margin={2}>
              <Typography variant="body1">{questionData.question}</Typography>
              <Stack direction="row" spacing={1}>
                {questionData.answers.map((answer, i) => (
                  <Answer key={i}
                    answerProps={{ 
                      answerText: answer, 
                      index: i, 
                      onSelectAnswer: () => {},
                      currentAnswers: [],
                      correctAnswers: correctAnswers,
                      showAnswers: true,
                      isFinished: false, 
                      predefinedText: answer,
                      predefinedCheckbox: correctAnswers.includes(i),
                    }}
                  />
                ))}
              </Stack>
            </Box>
            )
          }
          <Box display="flex" justifyContent="right" gap="1rem" marginTop="1rem">
            {!questionData.isPreview && 
              <>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleQuestionState("SAVE")}
                  endIcon={<SaveOutlinedIcon />}>
                  Preview
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={removeCurrentQuestion}
                  endIcon={<DeleteOutlineOutlinedIcon />}>
                  Delete
                </Button>
              </>
            }
            {questionData.isPreview && <Button variant="contained" onClick={() => handleQuestionState("EDIT")} endIcon={<ModeEditOutlineOutlinedIcon />}>Edit</Button>}
        </Box>
      </Box>
    </Card>
  )
}

export default memo(QuestionTemplate);
