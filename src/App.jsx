import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import History from './pages/History';
import Statistics from './pages/Statistics';
import PairCombinations from './pages/PairCombinations';

const App = () => {
  const [language, setLanguage] = useState('en'); // Default to English

  return (
    <Router>
      <NavBar language={language} setLanguage={setLanguage} />
      <Routes>
        <Route path="/" element={<HomePage language = {language} />} />
        <Route path="/history" element={<History />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/pair-combinations" element={<PairCombinations />} />
      </Routes>
    </Router>
  );
};

export default App;