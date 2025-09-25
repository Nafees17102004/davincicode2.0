import { useState } from 'react'
import './App.css'
import { Routes, Route } from "react-router-dom";
import ProjectPage from './pages/ProjectPage/ProjectPage';
import ProjectModules from './pages/ProjectModules/ProjectModules';

function App() {

  return (
      <Routes>
        <Route path="/" element={<ProjectPage />} />
        <Route path="/module" element={<ProjectModules/>} />
      </Routes>
  )
}

export default App
