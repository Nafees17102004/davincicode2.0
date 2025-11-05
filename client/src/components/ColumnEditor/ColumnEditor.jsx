import React, { useState, useEffect } from "react";
import EventHandlerModal from "../EventHandlerModal/EventHandlerModal";

const ColumnEditor = ({
  column,
  path,
  updateConfig,
  removeColumn,
  eventHandler,
  fieldSource,
  fieldType,
  fieldOrder,
  fieldIcon,
  jsVal,
  spList,
  tableList,
  storedProcedures,
  spParamData,
  tableCol,
  showToast,
  fetchSpParams,
  fetchTableColumns,
}) => {
  const [tabIndex, sectionIndex, columnIndex] = path;
  const [showEventModal, setShowEventModal] = useState(false);
  const [localColumn, setLocalColumn] = useState(column);

  // Sync with prop changes
  useEffect(() => {
    setLocalColumn(column);
  }, [column]);

  const handleFieldChange = (key, value) => {
    const updatedColumn = { ...localColumn, [key]: value };
    setLocalColumn(updatedColumn);

    // Reset chain values
    if (key === "fieldSourceLovDetId") {
      updatedColumn.spName = null;
      updatedColumn.spParam = null;
      updatedColumn.tableName = null;
      updatedColumn.tableColumns = null;
    }

    if (key === "spName") {
      updatedColumn.spParam = null;
      updatedColumn.tableName = null;
      updatedColumn.tableColumns = null;
      if (value && fetchSpParams) fetchSpParams(value);
    }

    if (key === "tableName") {
      updatedColumn.spName = null;
      updatedColumn.spParam = null;
      updatedColumn.tableColumns = null;
      if (value && fetchTableColumns) fetchTableColumns(value);
    }

    // Handle event handlers checkbox
    if (key === "hasEvents" && !value) {
      updatedColumn.eventHandlers = [];
    }

    updateConfig((config) => {
      const newTabs = [...config.tabs];
      newTabs[tabIndex].sections[sectionIndex].fields[columnIndex] =
        updatedColumn;
      return { ...config, tabs: newTabs };
    });
  };

  const handleAddEventHandler = (eventObj) => {
    const updatedColumn = {
      ...localColumn,
      eventHandlers: [...localColumn.eventHandlers, eventObj],
    };
    setLocalColumn(updatedColumn);

    updateConfig((config) => {
      const newTabs = [...config.tabs];
      newTabs[tabIndex].sections[sectionIndex].fields[columnIndex] =
        updatedColumn;
      return { ...config, tabs: newTabs };
    });
  };

  const handleRemoveEventHandler = (eventId) => {
    const updatedColumn = {
      ...localColumn,
      eventHandlers: localColumn.eventHandlers.filter((e) => e.id !== eventId),
    };
    setLocalColumn(updatedColumn);

    updateConfig((config) => {
      const newTabs = [...config.tabs];
      newTabs[tabIndex].sections[sectionIndex].fields[columnIndex] =
        updatedColumn;
      return { ...config, tabs: newTabs };
    });
  };

  return (
    <div className="bg-white p-4 border rounded mb-3 position-relative shadow-sm">
      <h6
        className="mb-3 border-bottom pb-2 d-flex align-items-center"
        style={{ color: "#070C37" }}
      >
        <i className={`fa ${localColumn.fieldIconLovDetId} me-2`}></i>
        Field: {localColumn.labelName || `Column ${columnIndex + 1}`}
      </h6>

      <button
        onClick={() => removeColumn(tabIndex, sectionIndex, columnIndex)}
        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle"
        title="Remove Column/Field"
      >
        <i className="fa fa-times"></i>
      </button>

      {/* Row 1 - Required Fields */}
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <label className="form-label fw-semibold">
            Field Source <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            value={localColumn.fieldSourceLovDetId || ""}
            onChange={(e) =>
              handleFieldChange("fieldSourceLovDetId", e.target.value)
            }
            required
          >
            {fieldSource &&
              fieldSource.map((eachItem) => (
                <option key={eachItem.id} value={eachItem.id}>
                  {eachItem.name}
                </option>
              ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label fw-semibold">
            Field Type <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            value={localColumn.fieldType || ""}
            onChange={(e) => handleFieldChange("fieldType", e.target.value)}
            required
          >
            {fieldType &&
              fieldType.map((eachItem) => (
                <option key={eachItem.id} value={eachItem.id}>
                  {eachItem.name}
                </option>
              ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label fw-semibold">
            Field Order <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            value={localColumn.fieldOrderLovDetId || ""}
            onChange={(e) =>
              handleFieldChange("fieldOrderLovDetId", e.target.value)
            }
            required
          >
            {fieldOrder &&
              fieldOrder.map((eachOrder) => (
                <option key={eachOrder.id} value={eachOrder.id}>
                  {eachOrder.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Field Source Specific Fields */}
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          {localColumn.fieldSourceLovDetId === "1" && (
            <>
              <label className="form-label fw-semibold">Stored Procedure</label>
              <select
                className="form-select"
                value={localColumn.spName || ""}
                onChange={(e) => handleFieldChange("spName", e.target.value)}
              >
                {spList &&
                  spList.map((sp) => (
                    <option key={sp.id} value={sp.name}>
                      {sp.name}
                    </option>
                  ))}
              </select>
            </>
          )}
          {localColumn.fieldSourceLovDetId === "2" && (
            <>
              <label className="form-label fw-semibold">Table Name</label>
              <select
                className="form-select"
                value={localColumn.tableName || ""}
                onChange={(e) => handleFieldChange("tableName", e.target.value)}
              >
                {tableList &&
                  tableList.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name}
                    </option>
                  ))}
              </select>
            </>
          )}
        </div>

        <div className="col-md-4">
          {localColumn.fieldSourceLovDetId === "1" && localColumn.spName && (
            <>
              <label className="form-label fw-semibold">SP Param</label>
              <select
                className="form-select"
                value={localColumn.spParam || ""}
                onChange={(e) => handleFieldChange("spParam", e.target.value)}
              >
                <option value="">Select Param</option>
                {(spParamData || []).map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </>
          )}
          {localColumn.fieldSourceLovDetId === "2" && localColumn.tableName && (
            <>
              <label className="form-label fw-semibold">Table Columns</label>
              <select
                className="form-select"
                value={localColumn.tableColumns || ""}
                onChange={(e) =>
                  handleFieldChange("tableColumns", e.target.value)
                }
              >
                <option value="">Select Column</option>
                {(tableCol || []).map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>

      {/* Row 2 - Field Details */}
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <label className="form-label fw-semibold">Field Name</label>
          <input
            type="text"
            className="form-control"
            value={localColumn.labelName}
            onChange={(e) => handleFieldChange("labelName", e.target.value)}
            placeholder="Enter field name"
          />
        </div>

        <div className="col-md-4">
          <label className="form-label fw-semibold">Placeholder</label>
          <input
            type="text"
            className="form-control"
            value={localColumn.placeholder}
            onChange={(e) => handleFieldChange("placeholder", e.target.value)}
            placeholder="Enter placeholder text"
          />
        </div>
      </div>

      {/* Field Icon */}
      <div className="row g-3 mb-2">
        <div className="col-md-4">
          <label className="form-label fw-semibold">Field Icon</label>
          <select
            className="form-select"
            value={localColumn.fieldIconLovDetId || ""}
            onChange={(e) =>
              handleFieldChange("fieldIconLovDetId", e.target.value)
            }
          >
            {fieldIcon &&
              fieldIcon.map((eachIcon) => (
                <option key={eachIcon.id} value={eachIcon.id}>
                  {eachIcon.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Validations and Event Handlers */}
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <label className="form-label fw-semibold">Validations</label>
          <select
            className="form-select"
            value=""
            onChange={(e) => {
              const val = e.target.value;
              if (val && !(localColumn.validations || []).includes(val)) {
                handleFieldChange("validations", [
                  ...(localColumn.validations || []),
                  val,
                ]);
              }
            }}
          >
            {jsVal &&
              jsVal.map((eachJs) => (
                <option key={eachJs.id} value={eachJs.id}>
                  {eachJs.name}
                </option>
              ))}
          </select>

          {/* Validation Badges */}
          <div className="mt-2">
            {(localColumn.validations || []).map((vId) => {
              const validationObj = (jsVal || []).find(
                (item) => item.id === vId
              );
              const validationName = validationObj
                ? validationObj.name
                : `ID:${vId}`;
              return (
                <span
                  key={vId}
                  className="badge me-1 mb-1 text-white"
                  style={{
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    backgroundColor: "#070C37",
                  }}
                  onClick={() =>
                    handleFieldChange(
                      "validations",
                      (localColumn.validations || []).filter((id) => id !== vId)
                    )
                  }
                >
                  {validationName} <i className="fa fa-times ms-1"></i>
                </span>
              );
            })}
          </div>
        </div>

        <div className="col-md-6">
          <div className="d-flex align-items-center mb-2">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={localColumn.hasEvents || false}
                onChange={(e) =>
                  handleFieldChange("hasEvents", e.target.checked)
                }
                id={`event-checkbox-${localColumn.column_id}`}
              />
              <label
                className="form-check-label fw-semibold"
                htmlFor={`event-checkbox-${localColumn.column_id}`}
              >
                Event Handlers
              </label>
            </div>
            {(localColumn.hasEvents ||
              localColumn.eventHandlers?.length > 0) && (
              <button
                className="btn btn-sm btn-outline-primary ms-2"
                style={{ borderColor: "#070C37", color: "#070C37" }}
                onClick={() => setShowEventModal(true)}
              >
                <i className="fa fa-cog me-1"></i> Manage Events
              </button>
            )}
          </div>

          {/* Event Handler Badges */}
          <div className="mt-1">
            {(localColumn.eventHandlers || []).map((event) => (
              <span
                key={event.id}
                className="badge me-1 mb-1 text-white"
                style={{
                  fontSize: "0.75rem",
                  backgroundColor: "#070C37",
                }}
              >
                {event.eventName}: {event.functionName}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Fields */}
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label fw-semibold">Saving SP</label>
          <select
            className="form-select"
            value={localColumn.storingSP}
            onChange={(e) => handleFieldChange("storingSP", e.target.value)}
          >
            {storedProcedures &&
              storedProcedures.map((sp) => (
                <option key={sp.id} value={sp.name}>
                  {sp.name}
                </option>
              ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold">Created User</label>
          <input
            type="text"
            className="form-control"
            value={localColumn.created_user}
            onChange={(e) => handleFieldChange("created_user", e.target.value)}
            placeholder="Enter user name"
          />
        </div>
      </div>

      {/* Event Handler Modal */}
      <EventHandlerModal
        show={showEventModal}
        onClose={() => setShowEventModal(false)}
        eventHandlers={localColumn.eventHandlers || []}
        onAddEventHandler={handleAddEventHandler}
        onRemoveEventHandler={handleRemoveEventHandler}
        eventHandler={eventHandler}
      />
    </div>
  );
};

export default ColumnEditor;
