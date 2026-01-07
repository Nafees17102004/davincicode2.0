import React, { useEffect, useState } from "react";
import { Table, Form } from "react-bootstrap";
import projectAPI from "../../api/Api";

function SnippetTable({ rows, onChange, fieldTypeData, elementData }) {
  const [language, setLanguage] = useState([]);

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      await projectAPI.getLovDropdown("LANGUAGE", null).then((response) => {
        const formattedFields = response.data.result.map((field) => ({
          id: field.Id,
          name: field.Name,
        }));
        setLanguage(formattedFields);
      });
    } catch (err) {
      console.error("Error fetching languages:", err);
    }
  };

  return (
    <Form.Group className="p-2">
      <Form.Label htmlFor="fieldType">Select Element Type</Form.Label>
      <Form.Select
        id="fieldType"
        value={rows.elementTypeId}
        name="elementTypeId"
        onChange={(e) => onChange(e)}
        className="mb-3"
      >
        {elementData.map((eachField) => (
          <option key={eachField.id} value={eachField.id}>
            {eachField.name}
          </option>
        ))}
      </Form.Select>
      <Form.Label>Select Field Type</Form.Label>
      <Form.Select
        value={rows.fieldTypeId}
        name="fieldTypeId"
        onChange={onChange}
        disabled={!rows.elementTypeId || rows.elementTypeId === "0"}
      >
        {!rows.elementTypeId || rows.elementTypeId === "0" ? (
          <option value="0">-- Select Element Type First --</option>
        ) : null}

        {fieldTypeData.map((eachField) => (
          <option key={eachField.id} value={eachField.id}>
            {eachField.name}
          </option>
        ))}
      </Form.Select>

      <Form.Label htmlFor="langName">Select language Name</Form.Label>
      <Form.Select
        is
        id="langName"
        value={rows.languageId}
        name="languageId"
        onChange={(e) => onChange(e)}
        className="mb-3"
      >
        {language.map((eachLang) => (
          <option key={eachLang.id} value={eachLang.id}>
            {eachLang.name}
          </option>
        ))}
      </Form.Select>

      {/* CORRECTED SNIPPET TYPE DROPDOWN */}
      {/* <Form.Label htmlFor="snippetType">Select Snippet Type</Form.Label>
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
      </Form.Select> */}

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
