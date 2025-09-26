import React, { useState } from 'react'
import projectAPI from '../../api/Api';
import { Table } from "react-bootstrap";
import './ViewProjectsTable.css'
import {useNavigate} from 'react-router-dom';

function ViewProjectsTable({rows}) {
  const [getProjectByCode, setProjectByCode] = useState([]);
  const navigate = useNavigate();

  const handleHyperLinkClick = (pCode) => (event) =>{
    event.preventDefault();
    projectAPI.getProjectByCode(pCode).then((response) => {
      console.log("Project Details:", response.data);
    }).catch((error)=>{
      console.error("There was an error!", error);
    })
    navigate('/module');
  }
  return (
    <Table bordered hover className='table'>
      <thead className='table-header'>
        <tr className='table-field-row'>
          <th className='field-name'>Project Code</th>
          <th className='field-name'>Project Name</th>
          <th className='field-name'>Language Name</th>
          <th className='field-name'>Project Status</th>
            <th className='field-name'>Inactive Reason</th>
        </tr>
      </thead>
      <tbody className='table-body'>
        {rows.map((row, index) => (
          <tr key={index} className='table-row'>
            <td className='row-item'>
              <a href='/'className='project-link' onClick={handleHyperLinkClick(row.pCode)}>
                {row.pCode}
              </a>
            </td>
            <td className='row-item'>
              {row.pName}
            </td>
            <td className='row-item'>
              {row.lName}
            </td>
            <td className='row-item'>
              {row.pStatus.toUpperCase()}
            </td>
            <td className='row-item'>
              {row.inactiveReason}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default ViewProjectsTable
