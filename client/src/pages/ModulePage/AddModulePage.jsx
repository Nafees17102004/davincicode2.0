import React, { useState } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AddModulePage = () => {
  const [moduleName, setModuleName] = useState("");
  const [moduleDesc, setModuleDesc] = useState("");
  const navigate = useNavigate();

  const handleSave = () => {
    const newModule = {
      module_name: moduleName,
      module_desc: moduleDesc,
      status: "active",
    };

    // Save module to localStorage (or context)
    const existing = JSON.parse(localStorage.getItem("tempModules")) || [];
    existing.push(newModule);
    localStorage.setItem("tempModules", JSON.stringify(existing));

    navigate("/project-details"); // go back to details page
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>Add Module</Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Module Name</Form.Label>
              <Form.Control
                type="text"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Module Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={moduleDesc}
                onChange={(e) => setModuleDesc(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" onClick={handleSave}>
              💾 Save Module
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddModulePage;
