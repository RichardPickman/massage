import { Button } from "@mui/material";


const AnswerTemplate = ({ action, text, letter, onClick }) => {
  switch(action) {
    case "SUCCESS": <Button variant="outlined" onClick={onClick} color="success">{!!letter && letter}{text}</Button>;
    
    break;
    case "ERROR": <Button variant="outlined" onClick={onClick} color="error">{!!letter && letter}{text}</Button>;

    break;
    case "DISABLED": <Button variant="outlined" onClick={onClick} disabled>{!!letter && letter}{text}</Button>;
    
    break;
    case "DEFAULT": <Button variant="outlined" onClick={onClick}>{!!letter && letter}{text}</Button>;
    
    break;
    default: return;
  }
};

export default AnswerTemplate;
