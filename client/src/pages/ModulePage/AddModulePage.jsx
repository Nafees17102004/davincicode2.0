import React, { useState } from "react";
import { Container, Card, Button, Form, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import projectAPI from "../../api/Api";

const AddModulePage = () => {
  const [modules, setModules] = useState([
    { m_name: "", m_desc: "", status: "active", inactive_reason: null},
  ]);
  const {pCode} = useParams();

  const navigate = useNavigate();

  // Handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedModules = [...modules];
    updatedModules[index][name] = value;

    // Clear inactive_reason when switching back to active
    if (name === "status" && value === "active") {
      updatedModules[index].inactive_reason = "";
    }

    // Clear previous error on edit
    updatedModules[index].error = "";
    setModules(updatedModules);
  };

  // Add new row
  const handleAddMore = () => {
    setModules([
      ...modules,
      { m_name: "", m_desc: "", status: "active", inactive_reason: "" },
    ]);
  };

  // Submit modules
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formatted = modules.map((m) => ({
        m_name: m.m_name,
        m_desc: m.m_desc,
        status: m.status,
        inactive_reason: m.status === "inactive" ? m.inactive_reason : null,
      }));

      const res = await projectAPI.insertModule(pCode, formatted);
      console.log("API response:", res.data);

      // Clear all previous errors
      const updatedModules = modules.map((m) => ({ ...m, error: "" }));

      // Mark failed modules with error messages
      if (res.data.failedCount > 0) {
        res.data.failedProjects.forEach((p) => {
          updatedModules[p.index].error = p.error;
        });
        setModules(updatedModules);
      } else {
        navigate(`/module/${pCode}`);
      }

    } catch (err) {
      console.error("Error submitting modules:", err.response || err);
    }
  };

  return (
    <Container className="my-5">
      <Card>
        <Card.Header className="bg-primary text-white">
          <h5>Add New Modules</h5>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Table bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Module Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Inactive Reason</th>
                  <th>Error</th>
                </tr>
              </thead>
              <tbody>
                {modules.map((m, i) => (
                  <tr key={i} className={m.error ? "table-danger" : ""}>
                    <td>{i + 1}</td>
                    <td>
                      <Form.Control
                        type="text"
                        name="m_name"
                        value={m.m_name}
                        onChange={(e) => handleInputChange(e, i)}
                        placeholder="Enter module name"
                        required
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        name="m_desc"
                        value={m.m_desc}
                        onChange={(e) => handleInputChange(e, i)}
                        placeholder="Enter description"
                      />
                    </td>
                    <td>
                      <Form.Select
                        name="status"
                        value={m.status}
                        onChange={(e) => handleInputChange(e, i)}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </Form.Select>
                    </td>
                    <td>
                      {m.status === "inactive" && (
                        <Form.Control
                          type="text"
                          name="inactive_reason"
                          value={m.inactive_reason}
                          onChange={(e) => handleInputChange(e, i)}
                          placeholder="Reason for inactivation"
                          required
                        />
                      )}
                    </td>
                    <td className="text-danger">{m.error}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="d-flex justify-content-between mt-3">
              <Button variant="outline-primary" onClick={handleAddMore}>
                ➕ Add More
              </Button>
              <Button variant="success" type="submit">
                ✅ Submit All Modules
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddModulePage;
