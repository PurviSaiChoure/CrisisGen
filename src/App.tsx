import React, { useState } from 'react';
import { Home } from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { ActionPlan } from './pages/ActionPlan';
import { Communication } from './pages/Communication';
import { Insights } from './pages/Insights';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Summary } from './pages/Summary';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import './styles.css'; // Import the CSS file

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode', !isDarkMode);
  };

  return (
    <Router>
      <div className="min-h-screen bg-emerald-950 text-gray-100">
        <Navbar />
        <button onClick={toggleTheme} className="theme-toggle">
          Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
        </button>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/action-plan" element={<ActionPlan />} />
          <Route path="/communication" element={<Communication />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/summary" element={<Summary />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;