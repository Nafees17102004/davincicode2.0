import React from "react";
import { Table, Form } from "react-bootstrap";

function FieldTypeTable({ rows, onChange }) {
  return (
    <Table bordered hover className="table">
      <thead className="table-header">
        <tr className="table-field-row">
          <th className="field-name">S.no</th>
          <th className="field-name">Field Name</th>
          <th className="field-name">Field Status</th>
          {rows.some((row) => row.fStatus === "inactive") && (
            <th className="field-name">Inactive Reason</th>
          )}
        </tr>
      </thead>
      <tbody className="table-body">
        {rows.map((row, index) => (
          <tr key={row.sNO}>
            <td>{row.sNO}</td>
            <td>
              <Form.Control
                type="text"
                value={row.fieldName}
                name="fieldName"
                onChange={(e) => onChange(index, "fieldName", e.target.value)}
              />
            </td>
            <td>
              <Form.Check
                type="switch"
                id={`status-switch-${index}`}
                label={row.fStatus === "active" ? "active" : "inactive"}
                checked={row.fStatus === "active"}
                onChange={(e) =>
                  onChange(
                    index,
                    "fStatus",
                    e.target.checked ? "active" : "inactive"
                  )
                }
              />
            </td>
            {row.fStatus === "inactive" && (
              <td>
                <Form.Control
                  as="textarea"
                  placeholder="Enter inactive reason"
                  value={row.fInactiveReason || ""}
                  name="fInactiveReason"
                  onChange={(e) =>
                    onChange(index, "fInactiveReason", e.target.value)
                  }
                  className="inactive-textarea"
                />
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default FieldTypeTable;
