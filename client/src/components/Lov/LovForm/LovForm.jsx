import React, { useState } from "react";
import { Button } from "react-bootstrap";
import LovFormDataGrid from "../LovFormDataGrid/LovFormDataGrid";
import projectAPI from "../../../api/Api";
import { useNavigate } from "react-router-dom";

function LovForm() {
  const [rows, setRows] = useState([]);
  const [idCounter, setIdCounter] = useState(1);
  const navigate = useNavigate();

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        sNO: idCounter,
        lovName: "",
        lovDescp: "",
        lovStatus: "active",
        inactiveReason: null,
        createdUser: "",
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
      .insertLov(rows)
      .then((response) => {
        console.log("Response:", response.data);
        if (!response.data.errors) {
          alert(
            `Projects added: ${response.data.summary.inserted}, Failed: ${response.data.summary.failed}`
          );
        } else {
          alert(`${response.data.errors.map((eachItem) => eachItem.error)}`);
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
        alert("An error occurred while submitting the projects.");
      });
    setRows([]);
    navigate("/view-lov");
  };
  return (
    <div className="project-form-container mt-4">
      <div className="project-form-header">
        <h3 className="project-page-heading">Lov Creation</h3>
        <Button onClick={handleAddRow} className="create-project-btn">
          Create Lov
        </Button>
      </div>

      <LovFormDataGrid rows={rows} onChange={handleChange} />

      <div className="project-btn-container">
        <Button onClick={handleSubmit} className="submit-btn">
          Submit
        </Button>
        <Button
          className="view-project-btn"
          onClick={() => navigate("/view-lov")}
        >
          View Stored Data
        </Button>
      </div>
    </div>
  );
}

export default LovForm;
