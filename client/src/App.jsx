import React from 'react';
import { Routes, Route } from "react-router-dom";
// Corrected the import paths to match the folder names.
import ProjectPage from './pages/ProjectPage/ProjectPage.jsx';
import ModulePage from './pages/ModulePage/ModulePage.jsx';
// The Bootstrap import has been removed from this file. It is recommended
// to import it in your main entry point (main.jsx) or reference it
// via a CDN in your index.html.

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProjectPage />} />
      <Route path="/modules" element={<ModulePage />} />
    </Routes>
  );
}

export default App;
