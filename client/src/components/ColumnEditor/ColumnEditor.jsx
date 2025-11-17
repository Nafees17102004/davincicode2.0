import React from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import "./ColumnEditor.css";

export default function ColumnEditor({
  columns,
  index,
  updateColumn,
  removeColumn,
  submitColumn,
  lists,
  fieldSource,
  fieldSize,
  fieldIcon,
  fieldOrder,
  jsVal,
}) {
  const { spList, tableList, fieldNames, storedProcedures } = lists;

  // const handleChange = (field, value) => {
  //   updateColumn(index, { [field]: value });
  // };

  // const handleValidationSelect = (e) => {
  //   const val = e.target.value;
  //   if (val && !column.validation.includes(val)) {
  //     updateColumn(index, { validation: [...column.validation, val] });
  //   }
  // };

  // const removeValidation = (v) => {
  //   updateColumn(index, {
  //     validation: column.validation.filter((x) => x !== v),
  //   });
  // };

  return (
    <Card className="container-fluid p-3 mb-4 shadow-sm column-card">
      {/* Row 1 */}
      {columns.map((column, idx) => (
        <div key={idx}>
          {/* Render column details here, for example: */}
          <Row className="g-3 mb-2">
            <Col md={4}>
              <Form.Label>Field Source</Form.Label>
              <Form.Select
                value={column.fieldSource}
                onChange={(e) => handleChange("fieldSource", e.target.value)}
              >
                {fieldSource.map((eachItem) => (
                  <option key={eachItem.id} value={eachItem.id}>
                    {eachItem.name}
                  </option>
                ))}
                {/* <option value="">Select</option>
            <option value="sp">SP</option>
            <option value="table">Table</option>
            <option value="custom">Custom</option> */}
              </Form.Select>
            </Col>

            <Col md={4}>
              <Form.Label>Name</Form.Label>
              {column.fieldSource === "sp" && (
                <Form.Select
                  value={column.spName}
                  onChange={(e) => handleChange("spName", e.target.value)}
                >
                  <option value="">Select SP</option>
                  {spList.map((sp) => (
                    <option key={sp}>{sp}</option>
                  ))}
                </Form.Select>
              )}
              {column.fieldSource === "table" && (
                <Form.Select
                  value={column.tableName}
                  onChange={(e) => handleChange("tableName", e.target.value)}
                >
                  <option value="">Select Table</option>
                  {tableList.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </Form.Select>
              )}
              {column.fieldSource === "custom" && (
                <Form.Control
                  type="text"
                  placeholder="Custom Name"
                  value={column.customName}
                  onChange={(e) => handleChange("customName", e.target.value)}
                />
              )}
            </Col>

            <Col md={4}>
              <Form.Label>Parameter / Column / Custom</Form.Label>
              {column.fieldSource === "sp" && (
                <Form.Select
                  value={column.spParameter}
                  onChange={(e) => handleChange("spParameter", e.target.value)}
                >
                  <option value="">Select Parameter</option>
                  {["param1", "param2", "param3"].map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </Form.Select>
              )}
              {column.fieldSource === "table" && (
                <Form.Select
                  value={column.tableColumn}
                  onChange={(e) => handleChange("tableColumn", e.target.value)}
                >
                  <option value="">Select Column</option>
                  {["col1", "col2", "col3"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Form.Select>
              )}
              {column.fieldSource === "custom" && (
                <Form.Control
                  type="text"
                  placeholder="Custom Text"
                  value={column.customText}
                  onChange={(e) => handleChange("customText", e.target.value)}
                />
              )}
            </Col>
          </Row>

          {/* Row 2 */}
          <Row className="g-3 mb-2">
            <Col md={4}>
              <Form.Label>Field Name</Form.Label>
              <Form.Select
                value={column.fieldName}
                onChange={(e) => handleChange("fieldName", e.target.value)}
              >
                <option value="">Select Field</option>
                {fieldNames.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </Form.Select>
            </Col>

            {/* <Col md={4}>
              <Form.Label>Validation</Form.Label>
              <Form.Select onChange={handleValidationSelect}>
                {jsVal.map((eachJs) => (
                  <option key={eachJs.id} value={eachJs.name}>
                    {eachJs.name}
                  </option>
                ))}
              </Form.Select>
              <div className="mt-1 ">
                {column.validation.map((v) => (
                  <span
                    key={v}
                    className="badge bg-secondary me-1"
                    style={{ cursor: "pointer" }}
                    onClick={() => removeValidation(v)}
                  >
                    {v} ✖
                  </span>
                ))}
              </div>
            </Col> */}

            <Col md={4}>
              <Form.Label>Field Icon</Form.Label>
              <Form.Select
                value={column.fieldIcon}
                onChange={(e) => handleChange("fieldIcon", e.target.value)}
              >
                {fieldIcon.map((eachIcon) => (
                  <option key={eachIcon.id} value={eachIcon.name}>
                    {eachIcon.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          {/* Row 3 */}
          <Row className="g-3 mb-2">
            <Col md={4}>
              <Form.Label>Placeholder</Form.Label>
              <Form.Control
                placeholder="Placeholder"
                value={column.placeholder}
                onChange={(e) => handleChange("placeholder", e.target.value)}
              />
            </Col>

            <Col md={4}>
              <Form.Label>Field Order</Form.Label>
              <Form.Select
                value={column.fieldOrder}
                onChange={(e) => handleChange("fieldOrder", e.target.value)}
              >
                {fieldOrder.map((eachOrder) => (
                  <option key={eachOrder.id} value={eachOrder.name}>
                    {eachOrder.name}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={3}>
              <Form.Label>Stored Procedure</Form.Label>
              <Form.Select
                value={column.storedProcedure}
                onChange={(e) =>
                  handleChange("storedProcedure", e.target.value)
                }
              >
                <option value="">Select SP</option>
                {storedProcedures.map((sp) => (
                  <option key={sp}>{sp}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          {/* Row 4: Remove + Submit Buttons */}
          <Row>
            <Col className="d-flex justify-content-end gap-2">
              <Button variant="danger" size="md" className="mt-3">
                Remove
              </Button>
              <Button variant="primary" size="md" className="mt-3">
                Submit
              </Button>
            </Col>
          </Row>
        </div>
      ))}
    </Card>
  );
}
