import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Alert,
  Badge,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import projectAPI from "../../api/Api";
import LeftTabMenu from "../../components/LeftTabMenu/LeftTabMenu";

const LovDetViewpage = () => {
  const { lovId } = useParams();
  const [lovs, setLovs] = useState(null);
  const [lovDet, setLovDet] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await projectAPI.viewLovById(lovId);
        console.log(res);
        setLovs(res.data.result.project[0]);
        setLovDet(res.data.result.module || []);
      } catch (err) {
        setError("Failed to fetch project details");
        console.error(err);
      }
    };
    fetchProject();
  }, []);

  const handleAddModule = (lovId) => {
    navigate(`/add-lovDet/${lovId}`); // go to Add Module Page
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
          <h2>Lov Details</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          {/* Project Info */}
          {lovs && (
            <Card className="mb-4">
              <Card.Header>Lov Info</Card.Header>
              <Card.Body>
                <Row>
                  <Col>
                    <strong>Lov Name:</strong> {lovs.project_code}
                  </Col>
                  <Col>
                    <strong>Name:</strong> {lovs.project_name}
                  </Col>
                  <Col>
                    <strong>Language:</strong> {lovs.language_name}
                  </Col>
                  <Col>
                    <strong>Status:</strong>{" "}
                    <Badge
                      bg={lovs.status === "active" ? "success" : "secondary"}
                    >
                      {lovs.status}
                    </Badge>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}

          {/* Modules Table */}
          <Card>
            <Card.Header>Lov details</Card.Header>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>LovDet Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Inactive Reason</th>
                    <th>Created User</th>
                  </tr>
                </thead>
                <tbody>
                  {lovDet.length > 0 ? (
                    lovDet.map((l, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{l.module_name}</td>
                        <td>{l.module_desc}</td>
                        <td>{l.status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No LovDets added
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              <div className="d-flex justify-content-start mt-3">
                <Button
                  variant="primary"
                  onClick={() => handleAddModule(lovId)}
                >
                  ➕ Add LovDet
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default LovDetViewpage;
