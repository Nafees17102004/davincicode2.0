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
        const formattedLanguages = response.data.map((lang) => ({
          lId: lang.id,
          lName: lang.name,
          lStatus: lang.status,
          lInactiveReason: lang.inactive_reason,
        }));
        setLanguage(formattedLanguages);
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
    <Form className="table">
      <Form.Select
        value={rows.fieldTypeId}
        name="fieldTypeId"
        onChange={(e) => onChange(e)}
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

      <Form.Select
        value={rows.languageId}
        name="languageId"
        onChange={(e) => onChange(e)}
      >
        <option value="">Select Language</option>
        {language.map((eachLang) => (
          <option key={eachLang.lId} value={eachLang.lId}>
            {eachLang.lName}
          </option>
        ))}
      </Form.Select>

      <Form.Control
        type="text"
        value={rows.snippetName}
        name="snippetName"
        onChange={(e) => onChange(e)}
      />

      <Form.Control
        as="textarea"
        placeholder="Enter Snippet"
        value={rows.snippet || ""}
        name="snippet"
        onChange={(e) => onChange(e)}
        className="inactive-textarea"
      />
    </Form>
  );
}

export default SnippetTable;
