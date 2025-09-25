import React from 'react';
import { Routes, Route } from "react-router-dom";
import ProjectPage from './pages/ProjectPage/ProjectPage'
import LanguagePage from './pages/LanguagePage/LanguagePage';
import ModulePage from './pages/ModulePage/ModulePage';

function App() {
  return (
      <Routes>
        <Route path="/" element={<LanguagePage />} />
        <Route path='/project' element={<ProjectPage/>}/>
        <Route path='/module' element={<ModulePage/>}/>
      </Routes>
  )
}

export default App;
