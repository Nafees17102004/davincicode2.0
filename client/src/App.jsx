import { useState } from 'react'
import './App.css'
import ProjectPage from './pages/ProjectPage/ProjectPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ProjectPage/>
    </>
  )
}

export default App
