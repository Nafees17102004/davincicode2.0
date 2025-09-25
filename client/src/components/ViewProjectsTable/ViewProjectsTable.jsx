import React from 'react'
import { Table } from "react-bootstrap";
import './ViewProjectsTable.css'

function ViewProjectsTable({rows}) {
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
              <a href='/'className='project-link'>
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
