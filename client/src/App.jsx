import { useState } from 'react'
import './App.css'
import ProjectForm from './components/ProjectForm/ProjectForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ProjectForm/>
    </>
  )
}

export default App
