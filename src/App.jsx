import React from 'react';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Login from './pages/Login';
import Quizzes from './pages/Quizzes';
import Lecture from './pages/Lectures/Lecture';
import Lectures from './pages/Lectures';
import Header from './components/Header';
import Layout from './components/Layout';
import QuizConstructor from './pages/QuizConstructor';
import ThemeProviderHook from './components/ThemeProvider';
import { Route, Routes } from 'react-router-dom';
import { AppContextProvider } from './components/AppContextProvider';
import './styles.css';
import AddLecture from './pages/Lectures/AddLecture';
import { LoadingProvider } from './context/loading';

const App = () => {
    return (
        <ThemeProviderHook>
            <AppContextProvider>
                <ThemeProviderHook>
                    <Header />
                    <Layout>
                        <LoadingProvider>
                            <Routes>
                                <Route index element={<Home />} />
                                <Route path="/quizzes">
                                    <Route index element={<Quizzes />} />
                                    <Route path=":id" element={<Quiz />} />
                                    <Route
                                        path="constructor"
                                        element={<QuizConstructor />}
                                    />
                                </Route>
                                <Route path="/lectures">
                                    <Route index element={<Lectures />} />
                                    <Route path=":id" element={<Lecture />} />
                                    <Route
                                        path="create"
                                        element={<AddLecture />}
                                    />
                                </Route>

                                <Route path="/login" element={<Login />} />
                                <Route
                                    path="/register"
                                    element={<QuizConstructor />}
                                />
                                <Route
                                    path="/profile"
                                    element={<QuizConstructor />}
                                />
                            </Routes>
                        </LoadingProvider>
                    </Layout>
                </ThemeProviderHook>
            </AppContextProvider>
        </ThemeProviderHook>
    );
};

export default App;
