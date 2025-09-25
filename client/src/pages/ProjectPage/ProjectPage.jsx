import React from 'react'
import ProjectForm from '../../components/ProjectForm/ProjectForm';
import LeftTabMenu from '../../components/LeftTabMenu/LeftTabMenu';
import './ProjectPage.css'

function ProjectPage() {
  return (
    <div className='project-page-container d-flex'>
        <LeftTabMenu/>
        <div className='project-page d-flex justify-content-center align-items-center'>
            <ProjectForm/>
        </div>
    </div>
  )
}

export default ProjectPage
