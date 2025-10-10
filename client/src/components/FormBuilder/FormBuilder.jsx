import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Table } from "react-bootstrap";
import ColumnEditor from "../ColumnEditor/ColumnEditor";
import "./FormBuilder.css";

export default function FormBuilder() {
  const spList = ["sp_get_users", "sp_get_products"];
  const tableList = ["users", "orders"];
  const customList = ["custom_json_1", "custom_json_2"];
  const fieldNames = ["id", "name", "email", "amount"];
  const validationOptions = ["required", "email", "number", "minLength", "maxLength"];
  const icons = ["fa-user", "fa-database", "fa-table", "fa-cog"];
  const storedProcedures = ["sp_save", "sp_update"];

  const [showTabForm, setShowTabForm] = useState(false);
  const [tabData, setTabData] = useState({ name: "", icon: "" });
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [tabSubmitClicked, setTabSubmitClicked] = useState(false);

  const handleAddTabClick = () => setShowTabForm(true);

  const handleSubmitTab = () => {
    setTabSubmitClicked(true);
    if (!tabData.name.trim()) return;
    const newTab = {
      id: Date.now(),
      name: tabData.name,
      icon: tabData.icon,
      columns: [],
      submittedColumns: [],
    };
    setTabs([...tabs, newTab]);
    setTabData({ name: "", icon: "" });
    setShowTabForm(false);
    setTabSubmitClicked(false);
    setActiveTab(tabs.length);
  };

  const handleRemoveTab = (id) => {
    setTabs(tabs.filter((t) => t.id !== id));
    setActiveTab(null);
  };

  const addColumn = () => {
    const newCol = {
      id: Date.now(),
      fieldSource: "",
      spName: "",
      spParameter: "",
      tableName: "",
      tableColumn: "",
      customName: "",
      customText: "",
      fieldName: "",
      validation: [],
      fieldIcon: "",
      placeholder: "",
      fieldOrder: "",
      storedProcedure: "",
    };
    const updated = [...tabs];
    updated[activeTab].columns.push(newCol);
    setTabs(updated);
  };

  const updateColumn = (index, updates) => {
    const updated = [...tabs];
    updated[activeTab].columns[index] = { ...updated[activeTab].columns[index], ...updates };
    setTabs(updated);
  };

  const removeColumn = (index) => {
    const updated = [...tabs];
    updated[activeTab].columns.splice(index, 1);
    setTabs(updated);
  };

  const submitColumn = (index) => {
    const updated = [...tabs];
    const col = updated[activeTab].columns[index];
    updated[activeTab].submittedColumns.push(col);
    updated[activeTab].columns.splice(index, 1);
    setTabs(updated);
  };

  // ✅ Move submitted column back to edit
  const backToEdit = (index) => {
    const updated = [...tabs];
    const col = updated[activeTab].submittedColumns[index];
    updated[activeTab].columns.push(col);
    updated[activeTab].submittedColumns.splice(index, 1);
    setTabs(updated);
  };

  return (
    <Container className="py-4">
      {!showTabForm && (
        <Button  className="mb-5" variant="primary" onClick={handleAddTabClick}>
          + Add Tab
        </Button>
      )}

      {showTabForm && (
        <Card className="p-3 mb-4 shadow-sm mt-3">
          <Row className="g-3 align-items-end">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Tab Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Tab Name"
                  value={tabData.name}
                  onChange={(e) => setTabData({ ...tabData, name: e.target.value })}
                />
                 {tabSubmitClicked && !tabData.name.trim() && (
                  <div style={{ color: "red", fontSize: "0.85rem" }}>
                    * Tab Name is required
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Tab Icon</Form.Label>
                <Form.Select
                  value={tabData.icon}
                  onChange={(e) => setTabData({ ...tabData, icon: e.target.value })}
                >
                  <option value="">Select Icon</option>
                  {icons.map((ic) => (
                    <option key={ic}>{ic}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Button variant="success" onClick={handleSubmitTab}>
                Submit
              </Button>
            </Col>
          </Row>
        </Card>
      )}

      <Row>
        {/* Tabs List */}
        <Col md={3}>
          {tabs.map((tab, i) => (
            <Card
              key={tab.id}
              className={`p-3 mb-3 shadow-sm ${activeTab === i ? "border-primary" : ""}`}
              onClick={() => setActiveTab(i)}
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <i className={`me-2 ${tab.icon}`}></i>
                  <strong>{tab.name}</strong>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveTab(tab.id);
                  }}
                >
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </Col>

        {/* Active Tab Columns */}
        <Col md={9}>
          {activeTab !== null && tabs[activeTab] && (
            <>
              <Card className="p-3 mb-3 shadow-sm d-flex flex-row justify-content-between align-items-center">
                <h5 className="m-0">{tabs[activeTab].name} Columns</h5>
                <Button variant="success" size="sm" onClick={addColumn}>
                  + Add Column
                </Button>
              </Card>

              {tabs[activeTab].columns.map((col, idx) => (
                <ColumnEditor
                  key={col.id}
                  column={col}
                  index={idx}
                  updateColumn={updateColumn}
                  removeColumn={removeColumn}
                  submitColumn={submitColumn} // ✅ Pass submit function
                  lists={{ spList, tableList, customList, fieldNames, validationOptions, icons, storedProcedures }}
                />
              ))}

              {/* Submitted Columns Table */}
              {tabs[activeTab].submittedColumns.length > 0 && (
                <Card className="p-3 shadow-sm mt-4">
                  <h5>Entered Data</h5>
                  <Table bordered hover responsive className="mt-2">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Field Source</th>
                        <th>Field Name</th>
                        <th>Validation</th>
                        <th>Placeholder</th>
                        <th>Stored Procedure</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tabs[activeTab].submittedColumns.map((c, i) => (
                        <tr key={c.id}>
                          <td>{i + 1}</td>
                          <td>{c.fieldSource}</td>
                          <td>{c.fieldName}</td>
                          <td>{c.validation.join(", ")}</td>
                          <td>{c.placeholder}</td>
                          <td>{c.storedProcedure}</td>
                          <td>
                            <Button size="sm" variant="secondary" onClick={() => backToEdit(i)}>
                              Back
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}
