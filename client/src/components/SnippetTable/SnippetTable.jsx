import React, { useEffect, useState } from "react";
import { Table, Form } from "react-bootstrap";
import projectAPI from "../../api/Api";

function SnippetTable({ rows, onChange, snippetTypeData }) {
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

  return (
    <Form.Group className="p-2">
      <Form.Label htmlFor="fieldType">Select Field Name</Form.Label>
      <Form.Select
        id="fieldType"
        value={rows.fieldTypeId}
        name="fieldTypeId"
        onChange={(e) => onChange(e)}
        className="mb-3"
      >
        <option value="">Select Field</option>
        {field.map((eachField) => (
          <option key={eachField.fId} value={eachField.fId}>
            {eachField.fName}
          </option>
        ))}
      </Form.Select>

      <Form.Label htmlFor="langName">Select language Name</Form.Label>
      <Form.Select
        id="langName"
        value={rows.languageId}
        name="languageId"
        onChange={(e) => onChange(e)}
        className="mb-3"
      >
        <option value="">Select Language</option>
        {language.map((eachLang) => (
          <option key={eachLang.lId} value={eachLang.lId}>
            {eachLang.lName}
          </option>
        ))}
      </Form.Select>

      {/* CORRECTED SNIPPET TYPE DROPDOWN */}
      <Form.Label htmlFor="snippetType">Select Snippet Type</Form.Label>
      <Form.Select
        id="snippetType"
        value={rows.snippetTypeId || ""}
        name="snippetTypeId"
        onChange={(e) => onChange(e)}
        className="mb-3"
      >
        <option value="">Select Snippet Type</option>
        {snippetTypeData &&
          snippetTypeData.map((eachType) => (
            <option key={eachType.id} value={eachType.id}>
              {eachType.name}
            </option>
          ))}
      </Form.Select>

      <Form.Label htmlFor="snipName">Snippet Name</Form.Label>
      <Form.Control
        id="snipName"
        type="text"
        value={rows.snippetName}
        name="snippetName"
        onChange={(e) => onChange(e)}
        className="mb-3"
      />
      <Form.Label htmlFor="snippet">Snippet</Form.Label>
      <Form.Control
        id="snippet"
        as="textarea"
        placeholder="Enter Snippet"
        value={rows.snippet || ""}
        name="snippet"
        onChange={(e) => onChange(e)}
        className="mb-3"
      />
    </Form.Group>
  );
}

export default SnippetTable;
