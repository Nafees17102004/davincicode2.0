import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Table, Alert, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import projectAPI from "../../api/Api";
import LeftTabMenu from "../../components/LeftTabMenu/LeftTabMenu";

const ModulePage = () => {
  const [project, setProject] = useState(null);
  const [modules, setModules] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await projectAPI.getProjectByCode("ERP001");
        setProject(res.data.result.project[0]);
        setModules(res.data.result.module || []);
      } catch (err) {
        setError("Failed to fetch project details");
        console.error(err);
      }
    };
    fetchProject();
  }, []);

  const handleAddModule = () => {
    navigate("/add-module"); // go to Add Module Page
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div style={{ width: "250px" }}>
        <LeftTabMenu />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Container fluid>
          <h2>Project Details</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          {/* Project Info */}
          {project && (
            <Card className="mb-4">
              <Card.Header>Project Info</Card.Header>
              <Card.Body>
                <Row>
                  <Col><strong>Code:</strong> {project.project_code}</Col>
                  <Col><strong>Name:</strong> {project.project_name}</Col>
                  <Col><strong>Language:</strong> {project.language_name}</Col>
                  <Col>
                    <strong>Status:</strong>{" "}
                    <Badge bg={project.status === "active" ? "success" : "secondary"}>
                      {project.status}
                    </Badge>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}

          {/* Modules Table */}
          <Card>
            <Card.Header>Modules</Card.Header>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Module Name</th>
                    <th>Description</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {modules.length > 0 ? (
                    modules.map((m, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{m.module_name}</td>
                        <td>{m.module_desc}</td>
                        <td>{m.status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No modules added
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              <div className="d-flex justify-content-start mt-3">
                <Button variant="primary" onClick={handleAddModule}>
                  ➕ Add Module
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default ModulePage;
