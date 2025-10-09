import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ViewLovStaticGrid({ rows }) {
  const navigate = useNavigate();

  return (
    <Table bordered hover className="table">
      <thead className="table-header">
        <tr className="table-field-row">
          <th className="field-name">Lov Name</th>
          <th className="field-name">Lov Description</th>
          <th className="field-name">lov Status</th>
          <th className="field-name">Inactive Reason</th>
          <th className="field-name">Created User</th>
        </tr>
      </thead>
      <tbody className="table-body">
        {rows.map((row, index) => (
          <tr key={index} className="table-row">
            <td className="row-item">{row.lovName}</td>
            <td className="row-item">{row.lovDescp}</td>
            <td className="row-item">{row.lovStatus.toUpperCase()}</td>
            <td className="row-item">{row.lovInactiveReason}</td>
            <td className="row-item">{row.createdUser}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default ViewLovStaticGrid;
