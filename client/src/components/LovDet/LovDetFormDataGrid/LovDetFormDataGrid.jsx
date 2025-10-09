import React, { useEffect, useState } from "react";
import { Table, Form } from "react-bootstrap";
import projectAPI from "../../../api/Api";

function LovDetFormDataGrid({ rows, onChange }) {
  const [lov, setLov] = useState([]);

  useEffect(() => {
    fetchLov();
  }, []);

  const fetchLov = async () => {
    try {
      await projectAPI.viewLovs().then((response) => {
        const formattedLovs = response.data.result.map((lov) => ({
          lId: lov.LOV_ID,
          lName: lov.LOV_NAME,
        }));
        setLov(formattedLovs);
      });
    } catch (err) {
      console.error("Error fetching lov:", err);
    }
  };

  return (
    <Table bordered hover className="table">
      <thead className="table-header">
        <tr className="table-field-row">
          <th className="field-name">S.no</th>
          <th className="field-name">Lov Id</th>
          <th className="field-name">LovDet Name</th>
          <th className="field-name">LovDet Description</th>
          <th className="field-name">LovDet Status</th>
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
              <Form.Select
                value={row.lovId}
                name="lovId"
                onChange={(e) => onChange(index, "lovId", e.target.value)}
              >
                <option value="">Select Lov</option>
                {lov.map((eachLov) => (
                  <option key={eachLov.lId} value={eachLov.lId}>
                    {eachLov.lName}
                  </option>
                ))}
                {/* <option value="1">Node JS</option>
                                <option value="2">Python</option>
                                <option value="3">Java</option>
                                <option value="4">React</option>
                                <option value="5">C#</option> */}
              </Form.Select>
            </td>
            <td>
              <Form.Control
                type="text"
                value={row.lovDetName}
                name="lovDetName"
                onChange={(e) => onChange(index, "lovDetName", e.target.value)}
              />
            </td>
            <td>
              <Form.Control
                type="text"
                value={row.lovDetDescp}
                name="lovDetDescp"
                onChange={(e) => onChange(index, "lovDetDescp", e.target.value)}
              />
            </td>
            <td>
              <Form.Check
                type="switch"
                id={`status-switch-${index}`}
                label={row.lovDetStatus === "active" ? "active" : "inactive"}
                checked={row.lovDetStatus === "active"}
                onChange={(e) =>
                  onChange(
                    index,
                    "lovDetStatus",
                    e.target.checked ? "active" : "inactive"
                  )
                }
              />
            </td>
            {row.lovDetStatus === "inactive" && (
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
                value={row.cUser}
                name="cUser"
                onChange={(e) => onChange(index, "cUser", e.target.value)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default LovDetFormDataGrid;
