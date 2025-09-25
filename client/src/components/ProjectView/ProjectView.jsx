import React, { useEffect, useState } from 'react';
import './ProjectView.css';

const ProjectView = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    setProjects([
      { id: 1, name: 'Project Alpha', description: 'A cool project.' },
      { id: 2, name: 'Project Beta', description: 'Another awesome project.' }
    ]);
  }, []);

  return (
    <div className="project-view-container">
      <h2>Projects</h2>
      <ul className="project-list">
        {projects.map(project => (
          <li key={project.id} className="project-list-item">
            <h3>{project.name}</h3>
            <p>{project.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectView;
