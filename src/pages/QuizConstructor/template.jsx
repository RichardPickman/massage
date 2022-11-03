import { Card, TextField, Button, Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";

import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

import AnswerWithCheckbox from "../../components/AnswerWithCheckbox";
import { memo } from "react";

const QuestionTemplate = ({ questionId, questions, updateQuestion }) => {
  const [questionState, setQuestionState] = useState(({
    id: questionId,
    question: "",
    img: "",
    answers: [''],
    correctAnswers: [],
    isSaved: false,
  }))

  const setTitle = (text) => setQuestionState({ ...questionState, question: text });

  const addAnswer = (answer, answerId) => {
    const answers = [...questionState.answers];

    answers[answerId] = answer;

    setQuestionState({
      ...questionState, 
      answers,
    })
  }

  const handleCorrectAnswer = (index) => {
    const isExist = questionState.correctAnswers.includes(index);
    const correctAnswers = isExist ? 
    questionState.correctAnswers.filter(item => item !== index) : 
    [...questionState.correctAnswers, index];

    return setQuestionState({
      ...questionState,
      correctAnswers,
    })
  };

  const addBlank = (index) => index === questionState.answers.length - 1 && 
  setQuestionState({
    ...questionState, 
    answers: [...questionState.answers, '']
  });

  useEffect(() => updateQuestion(questionId, questionState), [questionState])

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <Box display="flex" margin="1rem" flexDirection="column" justifyContent="center" gap="1rem" direction="row" spacing={2}>
        <TextField id="outlined-basic" label="Question" variant="outlined" onChange={(event) => setTitle(event.target.value)} />
        {/* <Button variant="contained" component="label">
          Upload
          <input hidden accept="image/*" type="file" onChange={uploadImage} />
        </Button> */}
        <Grid container spacing={2}>
          {questionState.answers.map((answer, i) => (
            <Grid item key={i} xs={6}>
              <AnswerWithCheckbox 
                questionId={questionId} 
                answerId={i}
                addAnswer={addAnswer} 
                handleCorrectAnswer={handleCorrectAnswer} 
                addBlank={addBlank}  
              />
            </Grid>
          ))}
        </Grid>
        <Box display="flex" justifyContent="right" gap="1rem" marginTop="1rem">
          <Button
            variant="contained"
            color="success"
            // onClick={saveQuestion}
            endIcon={<SaveOutlinedIcon />}>
            Save
          </Button>
          <Button
            variant="contained"
            color="error"
            endIcon={<DeleteOutlineOutlinedIcon />}>
            Delete
          </Button>
        </Box>
      </Box>
    </Card>
  )
}

export default memo(QuestionTemplate);
