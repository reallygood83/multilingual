import React, { useState } from 'react';
import GlocalEduMainPage from './components/GlocalEduMainPage';
import OptimizedApp from './components/OptimizedApp';
import './App.css';

const App = () => {
  const [currentView, setCurrentView] = useState('main'); // 'main' | 'platform'
  const [selectedProgram, setSelectedProgram] = useState(null);

  const handleProgramSelect = (programId) => {
    setSelectedProgram(programId);
    setCurrentView('platform');
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    setSelectedProgram(null);
  };

  if (currentView === 'main') {
    return (
      <GlocalEduMainPage onProgramSelect={handleProgramSelect} />
    );
  }

  return (
    <OptimizedApp 
      selectedProgram={selectedProgram}
      onBackToMain={handleBackToMain}
    />
  );
};

export default App;