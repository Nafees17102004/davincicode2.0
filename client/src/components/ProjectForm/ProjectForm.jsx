import React, {useState} from 'react'
import ProjectTable from '../ProjectTable/ProjectTable'
import { Button } from "react-bootstrap";
import projectAPI from '../../api/Api';
import { useNavigate } from "react-router-dom";

function ProjectForm() {
  const [rows, setRows] = useState([]);
  const [idCounter, setIdCounter] = useState(1);

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        id: idCounter,
        pCode: '',
        pName: '',
        pLanguageId: 0,
        pStatus: "active",
        pInactiveReason: null
      },
    ]);
    setIdCounter(idCounter + 1);
  };

  console.log(rows);

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleSubmit = () => {
    projectAPI.insertProject(rows);
    setRows([]);
  };
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h3 className='project-page-heading'>Project Creation</h3>
        <Button onClick={handleAddRow}>Create Project</Button>
      </div>

      <ProjectTable rows={rows} onChange={handleChange}/>

      <div className="mt-3 d-flex justify-content-between">
        <Button variant="success" onClick={handleSubmit}>
          Submit
        </Button>
        <Button variant="primary" >
          View Stored Data
        </Button>
      </div>
    </div>
  )
}

export default ProjectForm
