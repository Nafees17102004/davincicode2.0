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
  const [lovs, setLovs] = useState({});
  const [lovDet, setLovDet] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLov = async () => {
      try {
        const res = await projectAPI.getLovWithDet(lovId);
        const formattedLovDetData = res.data.result.map((eachItem) => ({
          lovDetName: eachItem.LOV_DET_NAME,
          lovDetDescp: eachItem.LOV_DET_DESCP,
          lovDetStatus: eachItem.c2c_status,
          lovDetInactiveReason: eachItem.c2c_inactive_reason,
          lovDetCUser: eachItem.DET_CREATED_USER,
        }));
        const formattedLovData = res.data.result.map((eachItem) => ({
          lovName: eachItem.LOV_NAME,
          lovDescp: eachItem.LOV_DESCRIPTION,
          lovStatus: eachItem.c2c_status,
          lovCUser: eachItem.LOV_CREATED_USER,
        }));
        setLovDet(formattedLovDetData);
        setLovs(formattedLovData[0]);
      } catch (err) {
        setError("Failed to fetch project details");
        console.error(err);
      }
    };
    fetchLov();
  }, []);

  const handleAddModule = (lovId) => {
    navigate(`/add-lovDet/${lovId}`); // go to Add Module Page
  };

  return (
    <div className="d-flex p-4">
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
                    <strong>Lov Name:</strong> {lovs.lovName}
                  </Col>
                  <Col>
                    <strong>Description:</strong> {lovs.lovDescp}
                  </Col>
                  <Col>
                    <strong>Created User:</strong> {lovs.lovCUser}
                  </Col>
                  <Col>
                    <strong>Status:</strong>{" "}
                    <Badge bg={lovs.c2c_status ? "success" : "secondary"}>
                      {lovs.c2c_status ? "Active" : "Inactive"}
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
                        <td>{l.lovDetName}</td>
                        <td>{l.lovDetDescp}</td>
                        <td>{l.lovDetStatus ? "Active" : "Inactive"}</td>
                        <td>
                          {l.lovDetInactiveReason === null ||
                          l.lovDetInactiveReason === ""
                            ? "No Inactive Reason"
                            : ""}
                        </td>
                        <td>{l.lovDetCUser}</td>
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
