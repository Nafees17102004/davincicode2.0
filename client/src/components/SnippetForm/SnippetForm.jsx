import React, { useState } from "react";
import SnippetTable from "../SnippetTable/SnippetTable";
import { Button } from "react-bootstrap";
import projectAPI from "../../api/Api";
import { useNavigate } from "react-router-dom";

function SnippetForm() {
  const [rows, setRows] = useState([]);
  const [idCounter, setIdCounter] = useState(1);
  const navigate = useNavigate();

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        id: idCounter,
        fieldTypeId: 0,
        languageId: 0,
        snippetName: "",
        snippet: "",
      },
    ]);
    setIdCounter(idCounter + 1);
  };

  console.log(rows);

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    projectAPI
      .insertSnippet(rows)
      .then((response) => {
        console.log("Response:", response.data);
        alert(
          `snippet added: ${response.data.addedCount}, Failed: ${response.data.failedCount}`
        );
      })
      .catch((error) => {
        console.error("There was an error!", error);
        alert("An error occurred while submitting the projects.");
      });
    setRows([]);
  };
  return (
    <div className="project-form-container mt-4">
      <div className="project-form-header">
        <h3 className="project-page-heading">Snippet Creation</h3>
        <Button onClick={handleAddRow} className="create-project-btn">
          Create Snippet
        </Button>
      </div>

      <SnippetTable rows={rows} onChange={handleChange} />

      <div className="project-btn-container">
        <Button onClick={handleSubmit} className="submit-btn">
          Submit
        </Button>
        <Button
          className="view-project-btn"
          onClick={() => navigate("/view-projects")}
        >
          View Stored Data
        </Button>
      </div>
    </div>
  );
}

export default SnippetForm;
