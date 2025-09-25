import React from 'react'
import ProjectForm from '../../components/ProjectForm/ProjectForm';
import LeftTabMenu from '../../components/LeftTabMenu/LeftTabMenu';
import './ProjectPage.css'

function ProjectPage() {
  return (
    <div className='project-page-container'>
        <LeftTabMenu/>
        <div className='project-page'>
            <ProjectForm/>
        </div>
    </div>
  )
}

export default ProjectPage
