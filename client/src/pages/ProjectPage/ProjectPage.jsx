import React from 'react'
import ProjectForm from '../../components/ProjectForm/ProjectForm';
import LeftTabMenu from '../../components/LeftTabMenu/LeftTabMenu';
import './ProjectPage.css'

function ProjectPage() {
  return (
    <div>
      <div>
        <LeftTabMenu/>
      </div>
        
      <div>
        <ProjectForm/>
      </div>
    </div>
  )
}

export default ProjectPage
