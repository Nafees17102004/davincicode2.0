import React, {useState} from 'react'
import { Button } from "react-bootstrap";
import projectAPI from '../../api/Api';
import './LanguageForm.css'
import { useNavigate } from "react-router-dom";
import LanguageTable from '../LanguageTable/LanguageTable';

function LanguageForm() {
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
    projectAPI.insertProject(rows).then((response) => {
      console.log("Response:", response.data);
      alert(`Projects added: ${response.data.addedCount}, Failed: ${response.data.failedCount}`);
    }).catch((error) => {
      console.error("There was an error!", error);
      alert("An error occurred while submitting the projects.");
    });
    setRows([]);
  };
  return (
    <div className="project-form-container mt-4">
      <div className="project-form-header">
        <h3 className='project-page-heading'>Project Creation</h3>
        <Button onClick={handleAddRow} className='create-project-btn'>Create Project</Button>
      </div>

      <LanguageTable rows={rows} onChange={handleChange}/>

      <div className="project-btn-container">
        <Button onClick={handleSubmit} className='submit-btn'>
          Submit
        </Button>
        <Button className='view-project-btn'>
          View Stored Data
        </Button>
      </div>
    </div>
  )
}

export default LanguageForm
