import { Card, TextField, Button, Box, Grid } from "@mui/material";
import { useContext, useState } from "react";

import SaveIcon from '@mui/icons-material/Save';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AnswerWithCheckbox from "../../components/AnswerWithCheckbox";
import { ConstructorContext } from "../../context/quizConstructor";

export const QuestionTemplate = ({ questionIndex }) => {
  const [constructorState, dispatch] = useContext(ConstructorContext);
  const [image, setImage] = useState(null);
  const [question, setQuestion] = useState('');

  const currentQuestion  = constructorState.questions[questionIndex];

  const uploadImage = (event) => {
    let img = event.target.files[0];

    setImage(URL.createObjectURL(img));
  }

  const saveQuestion = () => dispatch({ type: "SAVE_QUESTION", payload: { questionIndex } });

  return (
    <Card variant="outlined">
      <Box display="flex" margin="1rem" flexDirection="column" justifyContent="center" gap="1rem" direction="row" spacing={2}>
        <TextField id="outlined-basic" label="Question" variant="outlined" onChange={(event) => setQuestion(event.target.value)} />
        <Button variant="contained" component="label">
          Upload
          <input hidden accept="image/*" type="file" onChange={uploadImage} />
        </Button>
        <Grid container spacing={2}>
          {currentQuestion.answers.map((answer, i) => (<Grid item key={i} xs={6}><AnswerWithCheckbox questionIndex={questionIndex} answerId={i} /></Grid>))}
        </Grid>
        <Box display="flex" justifyContent="right" gap="1rem" marginTop="1rem">
          <Button
            variant="contained"
            color="success"
            onClick={saveQuestion}
            endIcon={<SaveIcon />}>
            Save
          </Button>
          <Button
            variant="contained"
            color="error"
            endIcon={<DeleteForeverIcon />}>
            Delete
          </Button>
        </Box>
      </Box>
    </Card>
  )
}
