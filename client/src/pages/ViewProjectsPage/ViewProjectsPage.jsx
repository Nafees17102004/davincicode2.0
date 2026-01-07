import { useState, useEffect } from "react";
import projectAPI from "../../api/Api";
import ViewProjectsTable from "../../components/ViewProjectsTable/ViewProjectsTable";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

function ViewProjectsPage() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    projectAPI
      .viewProjects()
      .then((response) => {
        const formattedData = response.data.map((eachItem) => ({
          pCode: eachItem.project_code,
          pName: eachItem.project_name,
          lName: eachItem.language_name,
          pStatus: eachItem.c2c_status,
          inactiveReason: eachItem.c2c_inactive_reason,
        }));
        setProjects(formattedData);
      })
      .catch((err) => {
        console.error("Error: ", err);
      });
  };

  const handleBack = () => {
    navigate("/project");
  };

  return (
    <div className="view-projects-page p-4">
      <div className="main-content">
        <ViewProjectsTable rows={projects} />
        <Button onClick={handleBack} variant="danger">
          Back
        </Button>
      </div>
    </div>
  );
}

export default ViewProjectsPage;
