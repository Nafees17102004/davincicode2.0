import React, {useState} from 'react'
import { Table, Form } from "react-bootstrap";
import './ProjectTable.css'

function ProjectTable({rows, onChange}) {
  return (
    <Table bordered hover>
      <thead className='table-header'>
        <tr className='table-field-row'>
          <th className='field-name'>ID</th>
          <th className='field-name'>Project Code</th>
          <th className='field-name'>Project Name</th>
          <th className='field-name'>Language Name</th>
          <th className='field-name'>Project Status</th>
          <th className='field-name'>Inactive Reason</th>
        </tr>
      </thead>
      <tbody className='table-body'>
        {rows.map((row, index) => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>
              <Form.Control
                type="text"
                value={row.pCode}
                name="pCode"
                onChange={(e) => onChange(index, "pCode", e.target.value)}
              />
            </td>
            <td>
              <Form.Control
                type="text"
                value={row.pName}
                name="pName"
                onChange={(e) => onChange(index, "pName", e.target.value)}
              />
            </td>
            <td>
              <Form.Select
                value={row.pLanguageId}
                name="pLanguageId"
                onChange={(e) => onChange(index, "pLanguageId", e.target.value)}
              >
                <option value="">Select Language</option>
                <option value="1">Node JS</option>
                <option value="2">Python</option>
                <option value="3">Java</option>
                <option value="4">React</option>
                <option value="5">C#</option>
              </Form.Select>
            </td>
            <td>
              <Form.Check
                type="switch"
                id={`status-switch-${index}`}
                label={row.status === "active" ? "active" : "inactive"}
                checked={row.status === "active"}
                onChange={(e) =>
                  onChange(index, "status", e.target.checked ? "active" : "inactive")
                }
              />
            </td>
            <td>
              {row.status === "inactive" && (
                <Form.Control
                  as="textarea"
                  placeholder="Enter inactive reason"
                  value={row.inactiveReason || ""}
                  name="inactiveReason"
                  onChange={(e) => onChange(index, "inactiveReason", e.target.value)}
                  className="inactive-textarea"
                />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ProjectTable
