import { FormControlLabel, Switch } from "@mui/material";


const ShowAnswers = ({ showAnswersState, onChange }) => {
  return (
      <FormControlLabel 
        control={<Switch />} 
        label="Show answers" 
        labelPlacement="bottom"
        onChange={() => onChange(!showAnswersState)}
        checked={showAnswersState}
      />
  )
}

export default ShowAnswers;
