import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import QuizConstructor from "./pages/QuizConstructor";
import Header from "./components/Header";
import ThemeProviderHook from "./components/ThemeProvider";
import Layout from "./components/Layout";
import { AppContextProvider } from "./components/AppContextProvider";
import './styles.css';
import Login from "./pages/Login";
import Quizzes from "./pages/Quizzes";

const App = () => {
  return (
    <ThemeProviderHook>
      <AppContextProvider>
        <Header />
        <Layout>
          <Routes>
            <Route index element={<Home />} />
            <Route path="quizzes" element={<Quizzes />}>
              <Route path=":id" element={<Quiz />} />
            </Route>
            <Route path="lectures" element={<Quizzes />} />
            <Route path="constructor" element={<QuizConstructor />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<QuizConstructor />} />
            <Route path="profile" element={<QuizConstructor />} />
          </Routes>
        </Layout>
      </AppContextProvider>
    </ThemeProviderHook>
    
  )
}

export default App;
