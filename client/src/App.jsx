import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProjectPage from './pages/ProjectPage/ProjectPage'

function App() {

  return (
        <Routes>
          <Route path="/" element={<ProjectPage />} />
        </Routes>
  )
}

export default App
