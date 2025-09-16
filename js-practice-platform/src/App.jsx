import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { store } from './store';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import JavaScriptBasics from './pages/JavaScriptBasics';
import IntermediateJavaScript from './pages/IntermediateJavaScript';
import JavaScriptDOM from './pages/JavaScriptDOM';
import InterviewQuestions from './pages/InterviewQuestions';
import QuestionDetail from './pages/QuestionDetail';
import './styles/main.css';

const AppContent = () => {
  const { darkMode } = useSelector((state) => state.theme);

  useEffect(() => {
    // Apply theme to document
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [darkMode]);

  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/javascript-basics" element={<JavaScriptBasics />} />
            <Route path="/intermediate-javascript" element={<IntermediateJavaScript />} />
            <Route path="/javascript-dom" element={<JavaScriptDOM />} />
            <Route path="/javascript-practice" element={<JavaScriptBasics />} />
            <Route path="/interview-questions" element={<InterviewQuestions />} />
            <Route path="/question/:questionId" element={<QuestionDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
