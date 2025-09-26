import React, { useState } from 'react'
import { Table, Card } from "react-bootstrap";
import './ViewLanguageTable.css'

function ViewLanguageTable({rows}) {
  const [isActive, setIsActive] = useState("");

  return (
    <Table bordered hover className='table'>
      <thead className='table-header'>
        <tr className='table-field-row'>
          <th className='field-name'>Language ID</th>
          <th className='field-name'>Language Name</th>
          <th className='field-name'>Status</th>
          <th className='field-name'>Inactive Reason</th>
        </tr>
      </thead>
      <tbody className='table-body'>
        {rows.map((row, index) => (
          <tr key={index} className='table-row'>
            <td className='row-item'>
                {row.lId}
            </td>
            <td className='row-item'>
              {row.lName}
            </td>
            <td className='row-item'>
              <Card.Text variant={isActive}>
                {row.lStatus}
                {/* {row.lStatus === "active" ? setIsActive("success"):setIsActive("danger")} */}
              </Card.Text>
            </td>
            <td className='row-item'>
              {row.lInactiveReason}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default ViewLanguageTable
