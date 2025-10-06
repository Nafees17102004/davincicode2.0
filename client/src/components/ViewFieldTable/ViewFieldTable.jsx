import React, { useState } from "react";

import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ViewFieldTable({ rows }) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/field");
  };
  return (
    <Table bordered hover className="table p-4">
      <thead className="table-header">
        <tr className="table-field-row">
          <th className="field-name">Field Name</th>
          <th className="field-name">Field Status</th>
          <th className="field-name">Inactive Reason</th>
        </tr>
      </thead>
      <tbody className="table-body">
        {rows.map((row, index) => (
          <tr key={row.fTypeId} className="table-row">
            <td className="row-item">{row.fName}</td>
            <td className="row-item">{row.fStatus.toUpperCase()}</td>
            <td className="row-item">{row.fInactiveReason}</td>
          </tr>
        ))}
      </tbody>
        <Button variant="danger" onClick={()=>handleBack()}>Back</Button>
    </Table>
  );
}

export default ViewFieldTable;
