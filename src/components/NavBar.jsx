import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = ({ language, setLanguage }) => {
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en'); // Switch between English (en) and Chinese (zh)
  };

  return (
  <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '20px', padding: '10px', borderBottom: '1px solid #ccc' }}>
    <Link to="/" className="nav-link">Home</Link>
    <Link to="/history" className="nav-link">History</Link>
    <Link to="/statistics" className="nav-link">Statistics</Link>
    <Link to="/pair-combinations" className="nav-link">Pair Combinations</Link>
 
</nav>
  );
};

export default NavBar;