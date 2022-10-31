import { Box, Button, Link, Typography } from "@mui/material"
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react"
import { getAll } from "../../http/quizApi";


const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const data = await getAll();
        setQuizzes([...data.payload]);
      } catch(e) {
        alert(e.message)
      }
    }

    fetchQuizzes();
  }, [])

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={1} margin={2}>
      <Typography variant="h3">Quizzes</Typography>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        {quizzes.map((quiz, index) => {
          return (
            <Button key={index}>
              <Link underline="none" to={quiz.id} components={RouterLink}>
                {quiz.title}
              </Link>
            </Button>
          )
        })}
      </Box>
    </Box>
  )
}

export default Quizzes;
