import React, { useEffect, useState } from "react";
import { Table, Form } from "react-bootstrap";
import projectAPI from "../../api/Api";

function SnippetTable({ rows, onChange }) {
  const [language, setLanguage] = useState([]);
  const [field, setField] = useState([]);

  useEffect(() => {
    fetchLanguages();
    fetchFieldTypes();
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

   const fetchFieldTypes = async () => {
    try {
      await projectAPI.getFieldTypes().then((response) => {
        const formattedFields = response.data.map((field) => ({
          fId: field.FIELD_TYPE_ID,
          fName: field.FIELD_NAME,
          fStatus: field.status,
          fInactiveReason: field.inactive_reason,
        }));
        setField(formattedFields);
      });
    } catch (err) {
      console.error("Error fetching languages:", err);
    }
  };

  console.log(field);

  return (
    <Table bordered hover className="table">
      <thead className="table-header">
        <tr className="table-field-row">
          <th className="field-name">ID</th>
          <th className="field-name">Field Name</th>
          <th className="field-name">Language Name</th>
          <th className="field-name">Snippet Name</th>
          <th className="field-name">Snippet</th>
        </tr>
      </thead>
      <tbody className="table-body">
        {rows.map((row, index) => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>
              <Form.Select
                value={row.fieldTypeId}
                name="fieldTypeId"
                onChange={(e) => onChange(index, "fieldTypeId", e.target.value)}
              >
                <option value="">Select Field</option>
                {field.map((eachField) => (
                  <option key={eachField.fId} value={eachField.fId}>
                    {eachField.fName}
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
              <Form.Select
                value={row.languageId}
                name="languageId"
                onChange={(e) => onChange(index, "languageId", e.target.value)}
              >
                <option value="">Select Language</option>
                {language.map((eachLang) => (
                  <option key={eachLang.lId} value={eachLang.lId}>
                    {eachLang.lName}
                  </option>
                ))}
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
                              type="text"
                              value={row.snippetName}
                              name="snippetName"
                              onChange={(e) => onChange(index, "snippetName", e.target.value)}
                            />
            </td>
            <td>
              <Form.Control
                as="textarea"
                placeholder="Enter Snippet"
                value={row.snippet || ""}
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
