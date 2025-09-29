import React, { useEffect, useState } from "react";
import { Table, Form } from "react-bootstrap";
import projectAPI from "../../api/Api";

function SnippetTable({ rows, onChange }) {
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
          <th className="field-name">ID</th>
          <th className="field-name">Field Name</th>
          <th className="field-name">Language Name</th>
          <th className="field-name">Snippet</th>
        </tr>
      </thead>
      <tbody className="table-body">
        {rows.map((row, index) => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>
              <Form.Select
                value={row.pLanguageId}
                name="pLanguageId"
                onChange={(e) => onChange(index, "pLanguageId", e.target.value)}
              >
                <option value="">Select Language</option>
                {language.map((eachLang) => (
                  <option key={eachLang.lId} value={eachLang.lId}>
                    {eachLang.lName}
                  </option>
                ))}
                <option value="1">Node JS</option>
                <option value="2">Python</option>
                <option value="3">Java</option>
                <option value="4">React</option>
                <option value="5">C#</option>
              </Form.Select>
            </td>
            <td>
              <Form.Select
                value={row.pLanguageId}
                name="pLanguageId"
                onChange={(e) => onChange(index, "pLanguageId", e.target.value)}
              >
                <option value="">Select Language</option>
                {language.map((eachLang) => (
                  <option key={eachLang.lId} value={eachLang.lId}>
                    {eachLang.lName}
                  </option>
                ))}
                <option value="1">Node JS</option>
                <option value="2">Python</option>
                <option value="3">Java</option>
                <option value="4">React</option>
                <option value="5">C#</option>
              </Form.Select>
            </td>
            {/* <td>
              <Form.Check
                type="switch"
                id={`status-switch-${index}`}
                label={row.pStatus === "active" ? "active" : "inactive"}
                checked={row.pStatus === "active"}
                onChange={(e) =>
                  onChange(
                    index,
                    "pStatus",
                    e.target.checked ? "active" : "inactive"
                  )
                }
              />
            </td> */}
            {/* {row.pStatus === "inactive" && (
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
            )} */}
            <td>
              <Form.Control
                as="textarea"
                placeholder="Enter Snippet"
                value={row.inactiveReason || ""}
                name="snippet"
                onChange={(e) => onChange(index, "snippet", e.target.value)}
                className="inactive-textarea"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default SnippetTable;
