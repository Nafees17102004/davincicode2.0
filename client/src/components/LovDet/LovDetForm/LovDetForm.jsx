import React, { useState } from "react";
import { Button } from "react-bootstrap";
import LovDetFormDataGrid from "../LovDetFormDataGrid/LovDetFormDataGrid";
import projectAPI from "../../../api/Api";
import { useNavigate } from "react-router-dom";

function LovDetForm() {
  const [rows, setRows] = useState([]);
  const [idCounter, setIdCounter] = useState(1);
  const navigate = useNavigate();

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        sNO: idCounter,
        lovId: 0,
        lovDetName: "",
        lovDetDescp: "",
        lovDetStatus: "active",
        inActiveReason: null,
        cUser: "",
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
      .insertLovDet(rows)
      .then((response) => {
        console.log("Response:", response.data);
        // Projects added: ${response.data.summary.inserted}, Failed: ${response.data.summary.failed}
        alert(`${response.data.errors.map((eachItem) => eachItem.error)}`);
      })
      .catch((error) => {
        console.error("There was an error!", error);
        alert("An error occurred while submitting the projects.");
      });
    setRows([]);
    useNavigate("/view-projects");
  };
  return (
    <div className="project-form-container mt-4">
      <div className="project-form-header">
        <h3 className="project-page-heading">LovDets Creation</h3>
        <Button onClick={handleAddRow} className="create-project-btn">
          Create Lov
        </Button>
      </div>

      <LovDetFormDataGrid rows={rows} onChange={handleChange} />

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

export default LovDetForm;
