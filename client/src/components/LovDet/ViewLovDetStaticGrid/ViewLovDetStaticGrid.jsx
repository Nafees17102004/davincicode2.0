import React from "react";
import { Table, Form } from "react-bootstrap";

const ViewLovDetStaticGrid = ({ modules, onChange }) => {
  return (
    <Table striped bordered hover responsive>
      <thead className="table-dark">
        <tr>
          <th>Lov ID</th>
          <th>LovDet Name</th>
          <th>Description</th>
          <th>Status</th>
          <th>Inactive Reason</th>
          <th>Created User</th>
        </tr>
      </thead>
      <tbody>
        {modules && modules.length > 0 ? (
          modules.map((module, index) => (
            <tr key={index}>
              <td>{module.module_id || "New"}</td>

              {/* Module Name */}
              <td>
                <Form.Control
                  type="text"
                  name="module_name"
                  value={module.module_name || ""}
                  onChange={(e) => onChange(e, index)}
                  placeholder="Enter module name"
                />
              </td>

              {/* Module Description */}
              <td>
                <Form.Control
                  type="text"
                  name="module_desc"
                  value={module.module_desc || ""}
                  onChange={(e) => onChange(e, index)}
                  placeholder="Enter description"
                />
              </td>

              {/* Status */}
              <td>
                <Form.Select
                  name="status"
                  value={module.status || "active"}
                  onChange={(e) => onChange(e, index)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
              </td>

              {/* Inactive Reason */}
              <td>
                <Form.Control
                  type="text"
                  name="inactive_reason"
                  value={module.inactive_reason || ""}
                  onChange={(e) => onChange(e, index)}
                  placeholder="Enter reason (if inactive)"
                  disabled={module.status === "active"}
                />
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center">
              No modules found.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default ViewLovDetStaticGrid;
