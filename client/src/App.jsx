import React from 'react';
import { Routes, Route } from "react-router-dom";
import ProjectPage from './pages/ProjectPage/ProjectPage'
import LanguagePage from './pages/LanguagePage/LanguagePage';
import ModulePage from './pages/ModulePage/ModulePage';
import ViewProjectsPage from './pages/ViewProjectsPage/ViewProjectsPage';

function App() {
  return (
      <Routes>
        <Route path="/" element={<LanguagePage />} />
        <Route path='/project' element={<ProjectPage/>}/>
        <Route path='/module/:pCode' element={<ModulePage/>}/>
        <Route path='/view-Projects' element={<ViewProjectsPage/>}/>
      </Routes>
  )
}

export default App;
