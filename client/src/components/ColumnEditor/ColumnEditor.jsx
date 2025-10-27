import React from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import "./ColumnEditor.css";

export default function ColumnEditor({
  columns,
  onChange,
  index,
  updateColumn,
  removeColumn,
  submitColumn,
  lists,
  fieldType,
  fieldSource,
  fieldSize,
  fieldIcon,
  fieldOrder,
  jsVal,
  spParamData,
  tableCol,
  successHighlightedRows,
  errorHighlightedRows,
}) {
  const { spList, tableList, storedProcedures, eventHandler } = lists;

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
    <Card className={`container-fluid mt-3 mb-4 shadow-sm column-card `}>
      {/* Row 1 */}
      {columns.map((column, index) => (
        <div
          key={index}
          className={`p-4 mb-3 rounded ${
            successHighlightedRows.includes(index) ? "success-highlight" : ""
          }
    ${errorHighlightedRows.includes(index) ? "error-highlight" : ""}`}
        >
          {/* Render column details here, for example: */}
          <Row className="p-3 mb-2">Column {column.sNo}</Row>
          <Row className="g-3 mb-2">
            <Col md={4}>
              <Form.Label>Field Source</Form.Label>
              <Form.Select
                value={column.fieldSourceId}
                onChange={(e) =>
                  onChange(index, "fieldSourceId", Number(e.target.value))
                }
              >
                {fieldSource.map((eachItem) => (
                  <option key={eachItem.id} value={eachItem.id}>
                    {eachItem.name}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={4}>
              {column.fieldSourceId === 1 && (
                <>
                  <Form.Label>
                    {column.fieldSourceId === 1
                      ? "Stored Procedure"
                      : column.fieldSourceId === 2
                      ? "Table"
                      : column.fieldSourceId === 3
                      ? "Custom Name"
                      : "Select Source First"}
                  </Form.Label>
                  <Form.Select
                    value={column.spName}
                    onChange={(e) => onChange(index, "spName", e.target.value)}
                  >
                    {spList.map((sp) => (
                      <option value={sp.name} key={sp.id}>
                        {sp.name}
                      </option>
                    ))}
                  </Form.Select>
                </>
              )}
              {column.fieldSourceId === 2 && (
                <>
                  <Form.Label>Table Name</Form.Label>
                  <Form.Select
                    value={column.tableName}
                    onChange={(e) =>
                      onChange(index, "tableName", e.target.value)
                    }
                  >
                    {tableList.map((t) => (
                      <option value={t.name} key={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </Form.Select>
                </>
              )}
              {column.fieldSourceId === 3 && (
                <>
                  <Form.Label>Custom Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Custom Name"
                    value={column.customName}
                    onChange={(e) =>
                      onChange(index, "customName", e.target.value)
                    }
                  />
                </>
              )}
            </Col>

            <Col md={4}>
              {column.fieldSourceId === 1 && (
                <>
                  <Form.Label>
                    {column.fieldSourceId === 1
                      ? "SP Param"
                      : column.fieldSourceId === 2
                      ? "Table Columns"
                      : column.fieldSourceId === 3
                      ? "Custom Name"
                      : "Select Source First"}
                  </Form.Label>
                  <Form.Select
                    value={column.spParam}
                    onChange={(e) => onChange(index, "spParam", e.target.value)}
                  >
                    {(spParamData[index] || []).map((p) => (
                      <option value={p.name} key={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </Form.Select>
                </>
              )}
              {column.fieldSourceId === 2 && (
                <>
                  <Form.Label>Table Columns</Form.Label>
                  <Form.Select
                    value={column.tableColumns}
                    onChange={(e) =>
                      onChange(index, "tableColumns", e.target.value)
                    }
                  >
                    {(tableCol[index] || []).map((c) => (
                      <option value={c.name} key={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </Form.Select>
                </>
              )}
            </Col>
            <Col md={4}>
              <Form.Label>Field Type</Form.Label>
              <Form.Select
                value={column.fieldTypeId}
                onChange={(e) =>
                  onChange(index, "fieldTypeId", Number(e.target.value))
                }
              >
                {fieldType.map((eachItem) => (
                  <option key={eachItem.id} value={eachItem.id}>
                    {eachItem.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          {/* Row 2 */}
          <Row className="g-3 mb-2">
            <Col md={4}>
              <Form.Label>Field Name</Form.Label>
              <Form.Control
                type="text"
                value={column.fieldName}
                onChange={(e) => onChange(index, "fieldName", e.target.value)}
              ></Form.Control>
            </Col>
            <Col md={4}>
              <Form.Label>Placeholder</Form.Label>
              <Form.Control
                placeholder="Placeholder"
                value={column.placeholder}
                onChange={(e) => onChange(index, "placeholder", e.target.value)}
              />
            </Col>
            {column ? (
              <Col md={4} key={index}>
                <Form.Label>Validation</Form.Label>
                <Form.Select
                  value=""
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val && !column.validationIds?.includes(val)) {
                      onChange(index, "validationIds", [
                        ...(column.validationIds || []),
                        val,
                      ]);
                    }
                  }}
                >
                  {jsVal.map((eachJs) => (
                    <option key={eachJs.id} value={eachJs.id}>
                      {eachJs.name}
                    </option>
                  ))}
                </Form.Select>

                {/* Display badges (names from IDs) */}
                <div className="mt-1">
                  {(column.validationIds || []).map((vId) => {
                    const validationObj = jsVal.find((item) => item.id === vId);
                    const validationName = validationObj
                      ? validationObj.name
                      : `ID:${vId}`;
                    return (
                      <span
                        key={vId}
                        className="badge bg-secondary me-1"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          onChange(
                            index,
                            "validationIds",
                            (column.validationIds || []).filter(
                              (id) => id !== vId
                            )
                          )
                        }
                      >
                        {validationName} ✖
                      </span>
                    );
                  })}
                </div>
              </Col>
            ) : null}

            <Col md={4}>
              <Form.Label>Event Handler</Form.Label>
              <Form.Select
                value={column.eventHandler}
                onChange={(e) =>
                  onChange(index, "eventHandler", Number(e.target.value))
                }
              >
                {eventHandler.map((eachItem) => (
                  <option key={eachItem.id} value={eachItem.id}>
                    {eachItem.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label>Field Icon</Form.Label>
              <Form.Select
                value={column.fieldIconId}
                onChange={(e) =>
                  onChange(index, "fieldIconId", Number(e.target.value))
                }
              >
                {fieldIcon.map((eachIcon) => (
                  <option key={eachIcon.id} value={eachIcon.id}>
                    {eachIcon.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label>Field Order</Form.Label>
              <Form.Select
                value={column.fieldOrderId}
                onChange={(e) =>
                  onChange(index, "fieldOrderId", Number(e.target.value))
                }
              >
                {fieldOrder.map((eachOrder) => (
                  <option key={eachOrder.id} value={eachOrder.id}>
                    {eachOrder.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          {/* Row 3 */}
          <Row className="g-3 mb-2">
            <Col md={3}>
              <Form.Label>Saving SP's</Form.Label>
              <Form.Select
                value={column.storedProcedure}
                onChange={(e) =>
                  onChange(index, "storedProcedure", e.target.value)
                }
              >
                {storedProcedures.map((sp) => (
                  <option value={sp.name} key={sp.id}>
                    {sp.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label>Created User</Form.Label>
              <Form.Control
                placeholder="Created User"
                value={column.cUser}
                onChange={(e) => onChange(index, "cUser", e.target.value)}
              />
            </Col>
          </Row>
          {/* Row 4: Remove + Submit Buttons */}
          <Row>
            <Col className="d-flex justify-content-end gap-2">
              <Button
                variant="danger"
                size="md"
                className="mt-3"
                onClick={() => removeColumn(index)}
              >
                Remove
              </Button>
            </Col>
          </Row>
        </div>
      ))}
    </Card>
  );
}
