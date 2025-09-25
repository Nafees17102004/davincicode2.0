import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProjectView.css';

const ProjectView = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Adjust the URL as needed based on backend route.
    axios.get('http://localhost:5000/api/projects')
      .then(response => {
        setProjects(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading projects...</div>;
  }

  return (
    <div className="project-view-container">
      <h2>Projects</h2>
      <ul className="project-list">
        {projects.length === 0 ? (
          <li>No projects found.</li>
        ) : (
          projects.map(project => (
            <li key={project.id} className="project-list-item">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ProjectView;
