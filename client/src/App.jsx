import { useState } from 'react'
import './App.css'
import { Routes, Route } from "react-router-dom";
import ProjectPage from './pages/ProjectPage/ProjectPage'
import LanguagePage from './pages/LanguagePage/LanguagePage';

function App() {
  return (
      <Routes>
        <Route path="/" element={<LanguagePage />} />
        <Route path='/project' element={<ProjectPage/>}/>
      </Routes>
  )
}

export default App
