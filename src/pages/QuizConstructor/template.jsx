import { Card, Stack, TextField, Button, Box, Grid, Checkbox, FormGroup, FormControlLabel } from "@mui/material";
import { useRef, useState } from "react";

import SaveIcon from '@mui/icons-material/Save';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export const QuestionTemplate = ({ questionState }) => {
  const [question, setQuestion] = useState(null);
  const [image, setImage] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(Array(4));
  const [wrongAnswers, setWrongAnswers] = useState(null);

  const uploadImage = (event) => {
    let img = event.target.files[0]

    setImage(URL.createObjectURL(img));
  }

  const addWrongAnswer = (index, text) => setWrongAnswers(correctAnswer[index] = text);

  const saveQuestion = () => {
    questionState.question = question;
    questionState.img = image;
    questionState.incorrectAnswers = [...wrongAnswers];
    questionState.correctAnswer = correctAnswer;
  }

  return (
    <Card variant="outlined">
      <Box display="flex" margin="1rem" flexDirection="column" justifyContent="center" gap="1rem" direction="row" spacing={2}>
        <TextField id="outlined-basic" label="Question" variant="outlined" onChange={(event) => setQuestion(event.target.value)} />
        <Button variant="contained" component="label">
          Upload
          <input hidden accept="image/*" type="file" onChange={uploadImage} />
        </Button>
        <Box display="flex" flexDirection="column" gap="1rem" spacing={2}>
            <TextField variant="outlined" label="Correct answer" onChange={addWrongAnswer(0)}></TextField>
            <TextField variant="outlined" label="Incorrect answer" onChange={addWrongAnswer(1)}></TextField>
            <TextField variant="outlined" label="Incorrect answer" onChange={addWrongAnswer(2)}></TextField>
            <TextField variant="outlined" label="Incorrect answer" onChange={addWrongAnswer(3)}></TextField>
        </Box>
        <Box display="flex" justifyContent="right" gap="1rem" marginTop="1rem">
          <Button 
            variant="contained" 
            color="success" 
            endIcon={<SaveIcon />}
            onClick={saveQuestion}>
            Save
          </Button>
          <Button 
          variant="contained" 
          color="error" 
          endIcon={<DeleteForeverIcon />}
          // onClick={}
          >Delete</Button>
        </Box>
      </Box>
    </Card>
  )
}
