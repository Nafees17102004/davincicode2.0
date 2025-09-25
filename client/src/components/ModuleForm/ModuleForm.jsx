import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Row, Col, Card } from "react-bootstrap";

const ModuleForm = () => {
  const [modules, setModules] = useState([
    { name: "", description: "", inactiveReason: null, status: "" },
  ]);

  const handleChange = (index, field, value) => {
    const newModules = [...modules];
    newModules[index][field] = value;
    setModules(newModules);
  };

  const addModule = () => {
    setModules([
      ...modules,
      { name: "", description: "", inactiveReason: null, status: "" },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/add-project", { modules }); // ✅ Adjust if backend expects a different body
      alert("Modules added successfully!");
      setModules([
        { name: "", description: "", inactiveReason: null, status: "" },
      ]);
    } catch (err) {
      alert("Error adding modules");
    }
  };

  return (
    <Card className="p-4">
      <h4>Add Modules</h4>
      <Form onSubmit={handleSubmit}>
        {modules.map((module, index) => (
          <div key={index} className="mb-3 border p-3 rounded bg-light">
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Module Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={module.name}
                    onChange={(e) => handleChange(index, "name", e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    value={module.description}
                    onChange={(e) =>
                      handleChange(index, "description", e.target.value)
                    }
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={module.status}
                    onChange={(e) => handleChange(index, "status", e.target.value)}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </div>
        ))}
        <Button variant="secondary" onClick={addModule} className="me-2">
          Add Module
        </Button>
        <Button type="submit" variant="primary">
          Submit
        </Button>
      </Form>
    </Card>
  );
};

export default ModuleForm;
