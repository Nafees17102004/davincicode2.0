import React from 'react'
import { Table, Form } from "react-bootstrap";

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
                value={row.empName}
                name="empName"
                onChange={(e) => onChange(index, "empName", e.target.value)}
              />
            </td>
            <td>
              <Form.Select
                value={row.deptId}
                name="deptId"
                onChange={(e) => onChange(index, "deptId", e.target.value)}
              >
                <option value="">Select Dept</option>
                <option value="1">IT</option>
                <option value="2">Finance</option>
                <option value="3">HR</option>
                <option value="4">Marketing</option>
                <option value="5">Operations</option>
              </Form.Select>
            </td>
            <td>
              <Form.Check
                inline
                label="Manager"
                type="radio"
                name="Manager"
                value="1"
                checked={row.desigId === "1"}
                onChange={(e) => onChange(index, "desigId", e.target.value)}
              />
              <Form.Check
                inline
                label="Team Lead"
                type="radio"
                name='Team Lead'
                value="2"
                checked={row.desigId === "2"}
                onChange={(e) => onChange(index, "desigId", e.target.value)}
              />
              <Form.Check
                inline
                label="Software Engineer"
                type="radio"
                name="Software Engineer"
                value="3"
                checked={row.desigId === "3"}
                onChange={(e) => onChange(index, "desigId", e.target.value)}
              />
              <Form.Check
                inline
                label="HR"
                type="radio"
                name="HR"
                value="4"
                checked={row.desigId === "4"}
                onChange={(e) => onChange(index, "desigId", e.target.value)}
              />
              <Form.Check
                inline
                label="Intern"
                type="radio"
                name="Intern"
                value="5"
                checked={row.desigId === "5"}
                onChange={(e) => onChange(index, "desigId", e.target.value)}
              />
            </td>
            <td>
              <Form.Select
                value={row.locationId}
                name="locationId"
                onChange={(e) => onChange(index, "locationId", e.target.value)}
              >
                <option value="">Select Designation</option>
                <option value="1">Bangalore</option>
                <option value="2">Chennai</option>
                <option value="3">Hyderabad</option>
                <option value="4">Mumbai</option>
                <option value="5">Delhi</option>
              </Form.Select>
            </td>
            <td>
              <Form.Control
                type="date"
                value={row.joinDate}
                name="joinDate"
                onChange={(e) => onChange(index, "joinDate", e.target.value)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ProjectTable
