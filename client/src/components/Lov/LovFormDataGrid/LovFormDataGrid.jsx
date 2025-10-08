import React, { useEffect, useState } from "react";
import { Table, Form } from "react-bootstrap";
import projectAPI from "../../../api/Api";

function LovFormDataGrid({ rows, onChange }) {
  const [language, setLanguage] = useState([]);

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      await projectAPI.getLangauge().then((response) => {
        const formattedLangiages = response.data.map((lang) => ({
          lId: lang.id,
          lName: lang.name,
          lStatus: lang.status,
          lInactiveReason: lang.inactive_reason,
        }));
        setLanguage(formattedLangiages);
      });
    } catch (err) {
      console.error("Error fetching languages:", err);
    }
  };

  return (
    <Table bordered hover className="table">
      <thead className="table-header">
        <tr className="table-field-row">
          <th className="field-name">S.no</th>
          <th className="field-name">Lov Name</th>
          <th className="field-name">Lov description</th>
          <th className="field-name">Lov Status</th>
          {rows.some((row) => row.lovStatus === "inactive") && (
            <th className="field-name">Inactive Reason</th>
          )}
          <th className="field-name">Created User</th>
        </tr>
      </thead>
      <tbody className="table-body">
        {rows.map((row, index) => (
          <tr key={row.sNO}>
            <td>{row.sNO}</td>
            <td>
              <Form.Control
                type="text"
                value={row.lovName}
                name="lovName"
                onChange={(e) => onChange(index, "lovName", e.target.value)}
              />
            </td>
            <td>
              <Form.Control
                type="text"
                value={row.lovDescp}
                name="lovDescp"
                onChange={(e) => onChange(index, "lovDescp", e.target.value)}
              />
            </td>
            <td>
              <Form.Check
                type="switch"
                id={`status-switch-${index}`}
                label={row.lovStatus === "active" ? "active" : "inactive"}
                checked={row.lovStatus === "active"}
                onChange={(e) =>
                  onChange(
                    index,
                    "lovStatus",
                    e.target.checked ? "active" : "inactive"
                  )
                }
              />
            </td>
            {row.lovStatus === "inactive" && (
              <td>
                <Form.Control
                  as="textarea"
                  placeholder="Enter inactive reason"
                  value={row.inactiveReason || ""}
                  name="inactiveReason"
                  onChange={(e) =>
                    onChange(index, "inactiveReason", e.target.value)
                  }
                  className="inactive-textarea"
                />
              </td>
            )}
            <td>
              <Form.Control
                type="text"
                value={row.createdUser}
                name="createdUser"
                onChange={(e) => onChange(index, "createdUser", e.target.value)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default LovFormDataGrid;
