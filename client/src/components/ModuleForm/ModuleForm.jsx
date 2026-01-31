import React from "react";
import { Card, Form, Button } from "react-bootstrap";
import ModuleTable from "../ModuleTable/ModuleTable";

const ModuleForm = ({ modules, setModules, handleSubmit }) => {
  // Handles changes in the input fields for each module row
  const handleInputChange = (e, index) => {
    const { name, value, type, checked } = e.target;
    const list = [...modules];
    if (type === "checkbox") {
      list[index][name] = checked ? "inactive" : "active";
    } else {
      list[index][name] = value;
    }
    setModules(list);
  };

  // Adds a new empty row to the modules state
  const handleAddModule = () => {
    setModules([
      ...modules,
      {
        module_id: null,
        module_name: "",
        module_desc: "",
        inactive_reason: null,
        status: 1, // default
      },
    ]);
  };

  return (
    <Card className="shadow">
      <Card.Header className="bg-secondary text-white">
        <h5>Add / Manage Modules</h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <div className="table-responsive">
            <ModuleTable modules={modules} onChange={handleInputChange} />
          </div>
          <div className="d-flex justify-content-between mt-3">
            <Button variant="outline-primary" onClick={handleAddModule}>
              Add More
            </Button>
            <Button variant="success" type="submit">
              Submit All Modules
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ModuleForm;
