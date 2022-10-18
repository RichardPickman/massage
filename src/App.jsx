import { ThemeProvider, createTheme, styled, Switch, Container } from "@mui/material"; 
import CssBaseline from "@mui/material/CssBaseline";
import { useState } from "react";
import { MaterialUISwitch } from "./style";

import Quiz from "./pages/Quiz";
import QuizConstructor from "./pages/QuizConstructor";
import './styles.css'

const darkTheme = createTheme({ palette: { mode: 'dark' }});
const lightTheme = createTheme({ palette: { mode: 'light' }});

const App = () => {
  const getStoredTheme = Boolean(localStorage.getItem('theme'));
  const [checked, setChecked] = useState(getStoredTheme);

  const handleChange = (event) => {
    localStorage.setItem('theme', event.target.checked);
    setChecked(event.target.checked)
  }

  return (
    <ThemeProvider theme={checked ? darkTheme : lightTheme}>
      <CssBaseline />
      <header className="header">
        <ul className="header__list">
          <li className="header__link">Quizzes</li>
          <li className="header__link">Quiz Constructor</li>
          <li className="header__link"><MaterialUISwitch checked={checked} onChange={handleChange} /></li>
        </ul>
      </header>
      <main>
        <Container maxWidth="xs">
          <QuizConstructor />
        </Container>
        {/* <Quiz /> */}
      </main>
    </ThemeProvider>
  )
}

export default App;
