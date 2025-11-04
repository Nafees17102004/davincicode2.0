import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import projectAPI from "../../api/Api";

// Toast Component
const Toast = ({ messages, removeToast }) => {
  return (
    <div
      className="toast-container position-fixed top-0 end-0 p-3"
      style={{ zIndex: 9999 }}
    >
      {messages.map((toast) => (
        <div
          key={toast.id}
          className={`toast show ${
            toast.type === "success"
              ? "bg-success"
              : toast.type === "error"
              ? "bg-danger"
              : "bg-warning"
          }`}
          role="alert"
        >
          <div className="toast-header">
            <strong className="me-auto">
              {toast.type === "success"
                ? "Success"
                : toast.type === "error"
                ? "Error"
                : "Warning"}
            </strong>
            <button
              type="button"
              className="btn-close"
              onClick={() => removeToast(toast.id)}
            ></button>
          </div>
          <div className="toast-body text-white">{toast.message}</div>
        </div>
      ))}
    </div>
  );
};

// Event Handler Modal Component
const EventHandlerModal = ({
  show,
  onClose,
  eventHandlers,
  onAddEventHandler,
  onRemoveEventHandler,
  eventHandler,
}) => {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [functionName, setFunctionName] = useState("");

  const handleAdd = () => {
    if (selectedEvent && functionName.trim()) {
      onAddEventHandler({
        eventId: selectedEvent,
        functionName: functionName.trim(),
      });
      setSelectedEvent("");
      setFunctionName("");
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Manage Event Handlers</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {/* Add New Event Handler */}
            <div className="row g-3 mb-4 p-3 border rounded bg-light">
              <div className="col-md-5">
                <label className="form-label fw-semibold">Event Handler</label>
                <select
                  className="form-select"
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                >
                  {eventHandler &&
                    eventHandler.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col-md-5">
                <label className="form-label fw-semibold">Function Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter function name"
                  value={functionName}
                  onChange={(e) => setFunctionName(e.target.value)}
                />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button
                  className="btn btn-success w-100"
                  onClick={handleAdd}
                  disabled={!selectedEvent || !functionName.trim()}
                >
                  <i className="fa fa-plus me-1"></i> Add
                </button>
              </div>
            </div>

            {/* Event Handlers List */}
            <div className="border rounded">
              <div className="table-responsive">
                <table className="table table-striped table-hover mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>Event Handler</th>
                      <th>Function Name</th>
                      <th>Section Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventHandlers.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center text-muted py-3">
                          No event handlers added
                        </td>
                      </tr>
                    ) : (
                      eventHandlers.map((event) => (
                        <tr key={event.id}>
                          <td className="fw-semibold">{event.eventName}</td>
                          <td>
                            <code className="text-primary">
                              {event.functionName}
                            </code>
                          </td>
                          <td>
                            <span className="badge bg-info">
                              {event.sectionName}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => onRemoveEventHandler(event.id)}
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
const FormPreviewPage = () => {
  const navigate = useNavigate();

  // Toast state management
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const generateId = () => {
    const min = 1;
    const max = 100;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // --- Default Structures ---
  const defaultColumn = (order = 1) => ({
    column_id: generateId(),
    labelName: "",
    fieldType: "",
    fieldSourceLovDetId: "",
    spName: null,
    spParam: null,
    tableName: null,
    tableColumns: null,
    eventHandlers: [],
    placeholder: "Enter data...",
    validations: [],
    fieldIconLovDetId: "",
    fieldOrderLovDetId: order,
    storingSP: "",
    created_user: "",
    hasEvents: false,
  });

  const defaultSection = () => ({
    sectionIndex: generateId(),
    sectionType: "New Section",
    fields: [defaultColumn()],
  });

  const defaultTab = (count) => ({
    tabName: `Tab ${count}`,
    tabIcon: "",
    sections: [defaultSection()],
  });

  const initialState = {
    projectId: "",
    productId: "",
    moduleId: "",
    layoutId: "",
    pageName: "",
    purpose: "",
    tabs: [],
  };

  // --- Column Editor ---
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
  }) => {
    const [tabIndex, sectionIndex, columnIndex] = path;
    const [showEventModal, setShowEventModal] = useState(false);

    const fetchSpParams = async (spName) => {
      try {
        const res = await projectAPI.getLovDropdown("SP_PARAMS", spName);
        const formattedParams = res.data.result.map((each) => ({
          id: each.Id,
          name: each.Name,
        }));
        // You might want to handle this differently since spParamData is now passed as prop
        setSpParamData(formattedParams);
      } catch (error) {
        console.error("Error fetching SP Params data: ", error);
        showToast("Error fetching stored procedure parameters", "error");
      }
    };

    const fetchTableColumns = async (tableName) => {
      try {
        const res = await projectAPI.getLovDropdown("TABLE_COLS", tableName);
        const formattedParams = res.data.result.map((each) => ({
          id: each.Id,
          name: each.Name,
        }));
        setTableCol(formattedParams);
      } catch (error) {
        console.error("Error fetching Table Columns data: ", error);
        showToast("Error fetching table columns", "error");
      }
    };

    const handleFieldChange = (key, value) => {
      updateConfig((config) => {
        const newTabs = [...config.tabs];
        const field =
          newTabs[tabIndex].sections[sectionIndex].fields[columnIndex];

        field[key] = value;

        // Reset chain values
        if (key === "fieldSourceLovDetId") {
          field.spName = null;
          field.spParam = null;
          field.tableName = null;
          field.tableColumns = null;
        }

        if (key === "spName") {
          field.spParam = null;
          field.tableName = null;
          field.tableColumns = null;
          if (value) fetchSpParams(value);
        }

        if (key === "tableName") {
          field.spName = null;
          field.spParam = null;
          field.tableColumns = null;
          if (value) fetchTableColumns(value);
        }

        // Handle event handlers checkbox
        if (key === "hasEvents" && !value) {
          field.eventHandlers = [];
        }

        return { ...config, tabs: newTabs };
      });
    };
    console.log(moduleData);
    const handleAddEventHandler = (eventObj) => {
      updateConfig((config) => {
        const newTabs = [...config.tabs];
        const field =
          newTabs[tabIndex].sections[sectionIndex].fields[columnIndex];
        field.eventHandlers = [...field.eventHandlers, eventObj];
        return { ...config, tabs: newTabs };
      });
    };

    const handleRemoveEventHandler = (eventId) => {
      updateConfig((config) => {
        const newTabs = [...config.tabs];
        const field =
          newTabs[tabIndex].sections[sectionIndex].fields[columnIndex];
        field.eventHandlers = field.eventHandlers.filter(
          (e) => e.id !== eventId
        );
        return { ...config, tabs: newTabs };
      });
    };

    return (
      <div className="bg-white p-4 border rounded mb-3 position-relative shadow-sm">
        <h6 className="text-primary mb-3 border-bottom pb-2 d-flex align-items-center">
          <i className={`fa ${column.fieldIconLovDetId} me-2`}></i>
          Field: {column.labelName || `Column ${columnIndex + 1}`}
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
              value={column.fieldSourceLovDetId || ""}
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
              value={column.fieldType || ""}
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
              value={column.fieldOrderLovDetId || ""}
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
            {column.fieldSourceLovDetId === "1" && (
              <>
                <label className="form-label fw-semibold">
                  Stored Procedure
                </label>
                <select
                  className="form-select"
                  value={column.spName || ""}
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
            {column.fieldSourceLovDetId === "2" && (
              <>
                <label className="form-label fw-semibold">Table Name</label>
                <select
                  className="form-select"
                  value={column.tableName || ""}
                  onChange={(e) =>
                    handleFieldChange("tableName", e.target.value)
                  }
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
            {column.fieldSourceLovDetId === "1" && column.spName && (
              <>
                <label className="form-label fw-semibold">SP Param</label>
                <select
                  className="form-select"
                  value={column.spParam || ""}
                  onChange={(e) => handleFieldChange("spParam", e.target.value)}
                >
                  {(spParamData || []).map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </>
            )}
            {column.fieldSourceLovDetId === "2" && column.tableName && (
              <>
                <label className="form-label fw-semibold">Table Columns</label>
                <select
                  className="form-select"
                  value={column.tableColumns || ""}
                  onChange={(e) =>
                    handleFieldChange("tableColumns", e.target.value)
                  }
                >
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
              value={column.labelName}
              onChange={(e) => handleFieldChange("labelName", e.target.value)}
              placeholder="Enter field name"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold">Placeholder</label>
            <input
              type="text"
              className="form-control"
              value={column.placeholder}
              onChange={(e) => handleFieldChange("placeholder", e.target.value)}
              placeholder="Enter placeholder text"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold">Field Icon</label>
            <select
              className="form-select"
              value={column.fieldIconLovDetId || ""}
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

        {/* Row 3 - Validations and Event Handlers */}
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Validations</label>
            <select
              className="form-select"
              value=""
              onChange={(e) => {
                const val = e.target.value;
                if (val && !(column.validations || []).includes(val)) {
                  handleFieldChange("validations", [
                    ...(column.validations || []),
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
              {(column.validations || []).map((vId) => {
                const validationObj = jsVal.find((item) => item.id === vId);
                const validationName = validationObj
                  ? validationObj.name
                  : `ID:${vId}`;
                return (
                  <span
                    key={vId}
                    className="badge bg-primary me-1 mb-1"
                    style={{ cursor: "pointer", fontSize: "0.8rem" }}
                    onClick={() =>
                      handleFieldChange(
                        "validations",
                        (column.validations || []).filter((id) => id !== vId)
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
                  checked={column.hasEvents || false}
                  onChange={(e) =>
                    handleFieldChange("hasEvents", e.target.checked)
                  }
                  id={`event-checkbox-${column.column_id}`}
                />
                <label
                  className="form-check-label fw-semibold"
                  htmlFor={`event-checkbox-${column.column_id}`}
                >
                  Event Handlers
                </label>
              </div>
              {(column.hasEvents || column.eventHandlers?.length > 0) && (
                <button
                  className="btn btn-sm btn-outline-primary ms-2"
                  onClick={() => setShowEventModal(true)}
                >
                  <i className="fa fa-cog me-1"></i> Manage Events
                </button>
              )}
            </div>

            {/* Event Handler Badges */}
            <div className="mt-1">
              {(column.eventHandlers || []).map((event) => (
                <span
                  key={event.id}
                  className="badge bg-success me-1 mb-1"
                  style={{ fontSize: "0.75rem" }}
                >
                  {event.eventName}: {event.functionName}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Row 4 - Additional Fields */}
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Saving SP</label>
            <select
              className="form-select"
              value={column.storingSP}
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
              value={column.created_user}
              onChange={(e) =>
                handleFieldChange("created_user", e.target.value)
              }
              placeholder="Enter user name"
            />
          </div>
        </div>

        {/* Event Handler Modal */}
        <EventHandlerModal
          show={showEventModal}
          onClose={() => setShowEventModal(false)}
          eventHandlers={column.eventHandlers || []}
          onAddEventHandler={handleAddEventHandler}
          onRemoveEventHandler={handleRemoveEventHandler}
          eventHandler={eventHandler}
        />
      </div>
    );
  };

  // --- Section Editor ---
  const SectionEditor = ({
    section,
    path,
    updateConfig,
    addColumn,
    removeColumn,
    removeSection,
    ...props
  }) => {
    const [tabIndex, sectionIndex] = path;
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleSectionNameChange = (e) => {
      const newName = e.target.value;
      updateConfig((config) => {
        const newTabs = [...config.tabs];
        newTabs[tabIndex].sections[sectionIndex].sectionType = newName;
        return { ...config, tabs: newTabs };
      });
    };

    return (
      <div className="card mb-4 border-primary shadow-sm">
        <div className="card-header bg-gradient-primary text-white d-flex justify-content-between align-items-center p-3">
          <div className="d-flex align-items-center w-50">
            <button
              className="btn btn-sm btn-light me-2"
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <i
                className={`fa ${
                  isCollapsed ? "fa-chevron-down" : "fa-chevron-up"
                }`}
              ></i>
            </button>
            <i className="fa fa-layer-group me-2"></i>
            <input
              type="text"
              value={section.sectionType}
              onChange={handleSectionNameChange}
              className="form-control form-control-sm me-3 border-0 bg-transparent fw-bold text-white"
              placeholder="Section Name"
              style={{ color: "white", fontWeight: "bold" }}
            />
          </div>
          <div>
            <button
              onClick={() => addColumn(tabIndex, sectionIndex)}
              className="btn btn-sm btn-light me-2"
            >
              <i className="fa fa-plus me-1"></i> Add Field
            </button>
            <button
              onClick={() => removeSection(tabIndex, sectionIndex)}
              className="btn btn-sm btn-outline-light"
            >
              <i className="fa fa-trash-alt"></i>
            </button>
          </div>
        </div>

        <div className={`collapse ${!isCollapsed ? "show" : ""}`}>
          <div className="card-body bg-light">
            {section.fields.map((column, columnIndex) => (
              <ColumnEditor
                key={column.column_id}
                column={column}
                path={[tabIndex, sectionIndex, columnIndex]}
                updateConfig={updateConfig}
                removeColumn={removeColumn}
                {...props}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // --- Tab Editor ---
  const TabEditor = ({
    tab,
    tabIndex,
    updateConfig,
    addSection,
    removeSection,
    addColumn,
    removeColumn,
    removeTab,
    ...props
  }) => {
    const handleTabFieldChange = (key, value) => {
      updateConfig((config) => {
        const newTabs = [...config.tabs];
        newTabs[tabIndex][key] = value;
        return { ...config, tabs: newTabs };
      });
    };

    const tabColorClass =
      tabIndex % 2 === 0 ? "border-primary" : "border-success";

    return (
      <div className={`card shadow-lg mb-4 ${tabColorClass}`}>
        <div
          className={`card-header text-white p-3 d-flex justify-content-between align-items-center ${
            tabIndex % 2 === 0 ? "bg-gradient-primary" : "bg-gradient-success"
          }`}
        >
          <h4 className="mb-0">
            <i className={`fa ${tab.tabIcon} me-3`}></i> Tab #{tabIndex + 1}:{" "}
            {tab.tabName}
          </h4>
          <button
            onClick={() => removeTab(tabIndex)}
            className="btn btn-sm btn-light text-danger shadow-sm"
          >
            <i className="fa fa-trash-alt me-1"></i> Remove Tab
          </button>
        </div>

        <div className="card-body">
          <div className="row mb-4 g-3 p-3 border rounded bg-white shadow-sm">
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Tab Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={tab.tabName}
                onChange={(e) =>
                  handleTabFieldChange("tabName", e.target.value)
                }
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Tab Icon <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                value={tab.tabIcon || ""}
                onChange={(e) =>
                  handleTabFieldChange("tabIcon", e.target.value)
                }
                required
              >
                {props.iconData &&
                  props.iconData.map((iconName) => (
                    <option key={iconName.id} value={iconName.id}>
                      {iconName.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {tab.sections.map((section, sectionIndex) => (
            <SectionEditor
              key={section.sectionIndex}
              section={section}
              path={[tabIndex, sectionIndex]}
              updateConfig={updateConfig}
              addColumn={addColumn}
              removeColumn={removeColumn}
              removeSection={removeSection}
              {...props}
            />
          ))}

          <button
            onClick={() => addSection(tabIndex)}
            className="btn btn-warning shadow-sm"
          >
            <i className="fa fa-plus me-2"></i> Add Section
          </button>
        </div>
      </div>
    );
  };

  const [config, setConfig] = useState(initialState);
  const [retrivedFormGenData, setRetrivedFormGenData] = useState([]);
  const [showJson, setShowJson] = useState(false);
  const [isModuleEnabled, setIsModuleEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [spParamData, setSpParamData] = useState([]);
  const [tableCol, setTableCol] = useState([]);

  // Dropdown Bind Lists with default empty arrays
  const [fieldSource, setFieldSource] = useState([]);
  const [fieldIcon, setFieldIcon] = useState([]);
  const [fieldOrder, setFieldOrder] = useState([]);
  const [jsVal, setJsVal] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [moduleData, setModuleData] = useState([]);
  const [iconData, setIconData] = useState([]);
  const [spList, setSpList] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [fieldType, setFieldType] = useState([]);
  const [storedProcedures, setStoredProcedures] = useState([]);
  const [eventHandler, setEventHandler] = useState([]);
  const [layout, setLayout] = useState([]);
  const [productData, setProductData] = useState([]);

  // const [formId, setFormId] = useState(null);
  // console.log(formId)

  useEffect(() => {
    setIsModuleEnabled(!!config.projectId);
    if (!config.projectId) {
      setConfig((prev) => ({ ...prev, moduleId: "" }));
    }
  }, [config.projectId]);

  useEffect(() => {
    // const formId = sessionStorage.getItem("formId");
    // setFormId(formId);
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchFieldSrcData(),
          fetchFieldIconData(),
          fetchFieldOrderData(),
          fetchJsValData(),
          fetchProjectData(),
          fetchIconData(),
          fetchSpListData(),
          fetchTableListData(),
          fetchFieldTypeData(),
          fetchStoringSPData(),
          fetchEventHandlerData(),
          fetchLayoutData(),
          fetchProductData(),
          // fetchFormGenData(),
        ]);
        showToast("All data loaded successfully", "success");
      } catch (error) {
        console.error("Error loading data:", error);
        showToast("Error loading some data. Using fallback values.", "warning");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);
  // API fetch functions
  const fetchFieldSrcData = async () => {
    try {
      const res = await projectAPI.getLovDropdown(
        "LIST_OF_VALUES_DETAILS",
        "field_source"
      );
      const formattedData = res.data.result.map((eachSrc) => ({
        id: eachSrc.Id,
        name: eachSrc.Name,
      }));
      setFieldSource(formattedData);
    } catch (error) {
      console.error("Error fetching field source:", error);
      // Set fallback data
      // setFieldSource([
      //   { id: "1", name: "Static Value" },
      //   { id: "2", name: "Database Table" },
      //   { id: "3", name: "Stored Procedure" },
      // ]);
    }
  };

  const fetchFieldIconData = async () => {
    try {
      const res = await projectAPI.getLovDropdown(
        "LIST_OF_VALUES_DETAILS",
        "field_icon"
      );
      const formattedData = res.data.result.map((each) => ({
        id: each.Id,
        name: each.Name,
      }));
      setFieldIcon(formattedData);
    } catch (error) {
      console.error("Error fetching field icon:", error);
      setFieldIcon([
        { id: "1", name: "fa-user" },
        { id: "2", name: "fa-cog" },
      ]);
    }
  };

  const fetchFieldOrderData = async () => {
    try {
      const res = await projectAPI.getLovDropdown(
        "LIST_OF_VALUES_DETAILS",
        "field_order"
      );
      const formattedData = res.data.result.map((each) => ({
        id: each.Id,
        name: each.Name,
      }));
      setFieldOrder(formattedData);
    } catch (error) {
      console.error("Error fetching field order:", error);
      setFieldOrder([
        { id: "1", name: "1" },
        { id: "2", name: "2" },
        { id: "3", name: "3" },
      ]);
    }
  };

  const fetchJsValData = async () => {
    try {
      const res = await projectAPI.getLovDropdown("JS_VALIDATIONS", null);
      const formattedData = res.data.result.map((each) => ({
        id: each.Id,
        name: each.Name,
      }));
      setJsVal(formattedData);
    } catch (error) {
      console.error("Error fetching JS validations:", error);
      setJsVal([
        { id: "1", name: "Required" },
        { id: "2", name: "Email" },
      ]);
    }
  };

  const fetchProjectData = async () => {
    try {
      const res = await projectAPI.getLovDropdown("PROJECT_TABLE", null);
      const formattedData = res.data.result.map((each) => ({
        id: each.Id,
        name: each.Name,
      }));
      setProjectData(formattedData);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjectData([
        { id: "1", name: "Project Alpha" },
        { id: "2", name: "Project Beta" },
      ]);
    }
  };

  const fetchIconData = async () => {
    try {
      const res = await projectAPI.getLovDropdown("TAB_IMAGE_TABLE", null);
      const formattedData = res.data.result.map((each) => ({
        id: each.Id,
        name: each.Name,
      }));
      setIconData(formattedData);
    } catch (error) {
      console.error("Error fetching icons:", error);
      setIconData([
        { id: "1", name: "fa-user" },
        { id: "2", name: "fa-cog" },
      ]);
    }
  };

  const fetchSpListData = async () => {
    try {
      const res = await projectAPI.getLovDropdown("SP_LIST", null);
      const formattedData = res.data.result.map((each) => ({
        id: each.Id,
        name: each.Name,
      }));
      setSpList(formattedData);
    } catch (error) {
      console.error("Error fetching SP list:", error);
      setSpList([
        { id: "1", name: "sp_getUsers" },
        { id: "2", name: "sp_getProducts" },
      ]);
    }
  };

  const fetchTableListData = async () => {
    try {
      const res = await projectAPI.getLovDropdown("TABLE_LIST", null);
      const formattedData = res.data.result.map((each) => ({
        id: each.Id,
        name: each.Name,
      }));
      setTableList(formattedData);
    } catch (error) {
      console.error("Error fetching table list:", error);
      setTableList([
        { id: "1", name: "Users" },
        { id: "2", name: "Products" },
      ]);
    }
  };

  const fetchFieldTypeData = async () => {
    try {
      const res = await projectAPI.getLovDropdown("FIELD_TYPE", null);
      const formattedData = res.data.result.map((each) => ({
        id: each.Id,
        name: each.Name,
      }));
      setFieldType(formattedData);
    } catch (error) {
      console.error("Error fetching field types:", error);
      setFieldType([
        { id: "1", name: "Text Input" },
        { id: "2", name: "Number Input" },
      ]);
    }
  };

  const fetchStoringSPData = async () => {
    try {
      const res = await projectAPI.getLovDropdown("STORING_SP", null);
      const formattedData = res.data.result.map((each) => ({
        id: each.Id,
        name: each.Name,
      }));
      setStoredProcedures(formattedData);
    } catch (error) {
      console.error("Error fetching storing SP:", error);
      setStoredProcedures([
        { id: "1", name: "sp_saveUser" },
        { id: "2", name: "sp_saveProduct" },
      ]);
    }
  };

  const fetchEventHandlerData = async () => {
    try {
      const res = await projectAPI.getLovDropdown("FORM_EVENT_HANDLER", null);
      const formattedData = res.data.result.map((each) => ({
        id: each.Id,
        name: each.Name,
      }));
      setEventHandler(formattedData);
    } catch (error) {
      console.error("Error fetching event handlers:", error);
      setEventHandler([
        { id: "1", name: "onChange" },
        { id: "2", name: "onClick" },
      ]);
    }
  };

  const fetchLayoutData = async () => {
    try {
      const res = await projectAPI.getLovDropdown("LAYOUT_TABLE", null);
      const formattedData = res.data.result.map((each) => ({
        id: each.Id,
        name: each.Name,
      }));
      setLayout(formattedData);
    } catch (error) {
      console.error("Error fetching layouts:", error);
      setLayout([
        { id: "1", name: "Single Column" },
        { id: "2", name: "Two Column" },
      ]);
    }
  };

  const fetchProductData = async () => {
    try {
      const res = await projectAPI.getLovDropdown("PRODUCT_TABLE", null);
      const formattedData = res.data.result.map((each) => ({
        id: each.Id,
        name: each.Name,
      }));
      setProductData(formattedData);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProductData([
        { id: "1", name: "Product A" },
        { id: "2", name: "Product B" },
      ]);
    }
  };

  const updateConfig = useCallback(
    (updater) => setConfig((prev) => updater(prev)),
    []
  );

  const addTab = () =>
    updateConfig((config) => ({
      ...config,
      tabs: [...config.tabs, defaultTab(config.tabs.length + 1)],
    }));

  const removeTab = (tabIndex) =>
    updateConfig((config) => ({
      ...config,
      tabs: config.tabs.filter((_, i) => i !== tabIndex),
    }));

  const addSection = (tabIndex) =>
    updateConfig((config) => {
      const newTabs = [...config.tabs];
      newTabs[tabIndex].sections.push(defaultSection());
      return { ...config, tabs: newTabs };
    });

  const removeSection = (tabIndex, sectionIndex) =>
    updateConfig((config) => {
      const newTabs = [...config.tabs];
      newTabs[tabIndex].sections.splice(sectionIndex, 1);
      return { ...config, tabs: newTabs };
    });

  const addColumn = (tabIndex, sectionIndex) =>
    updateConfig((config) => {
      const newTabs = [...config.tabs];
      const cols = newTabs[tabIndex].sections[sectionIndex].fields;
      cols.push(defaultColumn(cols.length + 1));
      return { ...config, tabs: newTabs };
    });

  const removeColumn = (tabIndex, sectionIndex, columnIndex) =>
    updateConfig((config) => {
      const newTabs = [...config.tabs];
      newTabs[tabIndex].sections[sectionIndex].fields.splice(columnIndex, 1);
      return { ...config, tabs: newTabs };
    });
  const fetchModuleData = async (projectId) => {
    try {
      const res = await projectAPI.getLovDropdown("MODULE_TABLE", projectId);
      const formattedData = res.data.result.map((each) => ({
        id: each.Id,
        name: each.Name,
      }));
      setModuleData(formattedData);
    } catch (error) {
      console.error("Error fetching modules:", error);
      setModuleData([
        { id: "1", name: "Core Module" },
        { id: "2", name: "Admin Module" },
      ]);
    }
  };
  // Data processing before storing the data inside form generation table
  const processConfigForSave = (config) => {
    const newConfig = { ...config };

    newConfig.tabs = newConfig.tabs.map((tab) => ({
      ...tab,
      sections: tab.sections.map((sec) => ({
        ...sec,
        fields: sec.fields.map((field) => ({
          ...field,

          // ✅ Convert validations to [{ jsId }]
          validations: (field.validations || []).map((vId) => ({
            jsId: vId,
          })),

          // ✅ Keep event handlers structure: [{ eventId, functionName }]
          eventHandlers: (field.eventHandlers || []).map((ev) => ({
            eventId: ev.eventId,
            functionName: ev.functionName,
          })),
        })),
      })),
    }));

    return newConfig;
  };

  const handleSubmitConfig = async (e) => {
    e.preventDefault();
    // Data before storing them on the DB *finalPayload*
    const finalPayload = processConfigForSave(config);
    // Validation
    if (
      !config.projectId ||
      !config.moduleId ||
      !config.productId ||
      !config.layoutId ||
      !config.pageName
    ) {
      showToast("Please fill all required fields in Project Setup", "error");
      return;
    }

    if (config.tabs.length === 0) {
      showToast("Please add at least one tab", "error");
      return;
    }

    for (let tab of config.tabs) {
      if (!tab.tabName || !tab.tabIcon) {
        showToast("Please fill all required fields in tabs", "error");
        return;
      }
    }

    try {
      await projectAPI
        .insertFormGen(finalPayload)
        .then(async (res) => {
          console.log(res.data);
          showToast("Configuration saved successfully!", "success");

          const formResponse = await projectAPI.viewFormGenList();
          setRetrivedFormGenData(formResponse.data);
          console.log("Fetched Form Data:", formResponse.data);
        })
        .catch((err) => {
          console.error(err);
          showToast("Error saving configuration", "error");
        });
    } catch (error) {
      showToast("Error saving configuration", "error");
    }
  };

  if (isLoading) {
    return (
      <div
        className="min-vh-100 d-flex justify-content-center align-items-center"
        style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
      >
        <div className="text-center text-white">
          <div className="spinner-border mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4>Loading Form Builder...</h4>
        </div>
      </div>
    );
  }
  console.log(config);
  const fetchFormGenData = async () => {
    try {
      projectAPI
        .viewFormGenList()
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.error("Error in fetching data: ", err);
        });
    } catch (error) {}
  };
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
      />

      {/* Toast Container */}
      <Toast messages={toasts} removeToast={removeToast} />

      <div
        className="min-vh-100 p-3"
        style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
      >
        <nav className="navbar navbar-dark bg-dark sticky-top shadow-lg mb-4 rounded-3 p-2">
          <div className="container-fluid">
            <button
              onClick={() => navigate("/")}
              className="btn btn-outline-light me-3"
            >
              <i className="fa fa-chevron-left me-1"></i> Back
            </button>
            <span className="navbar-brand h1 mb-0 text-warning">
              <i className="fa fa-magic me-2"></i>Dynamic Form Generator V1
            </span>
            <div className="d-flex">
              <button
                onClick={() => setShowJson(!showJson)}
                className="btn btn-outline-light me-2"
              >
                <i
                  className={`fa ${showJson ? "fa-eye-slash" : "fa-eye"} me-1`}
                ></i>
                {showJson ? "Hide Config" : "Show JSON"}
              </button>
              <button
                onClick={handleSubmitConfig}
                className="btn btn-success shadow-sm"
              >
                <i className="fa fa-save me-1"></i> Save Configuration
              </button>
            </div>
          </div>
        </nav>

        {/* --- Project Setup Details --- */}
        <div className="card mb-4 shadow-lg border-0">
          <div className="card-header bg-gradient-primary text-white fw-bold p-3">
            <i className="fa fa-cog me-2"></i>Project Setup Details
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Project ID <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  value={config.projectId}
                  onChange={(e) => {
                    const selectedProjectId = e.target.value;

                    // 1. Update project in config state
                    setConfig((prev) => ({
                      ...prev,
                      projectId: selectedProjectId,
                      moduleId: "", // clear selected module
                    }));

                    // 2. Fetch modules for selected project
                    if (selectedProjectId) {
                      fetchModuleData(selectedProjectId);
                    }
                  }}
                  required
                >
                  {projectData.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Module ID <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select ${
                    !isModuleEnabled ? "bg-light text-muted" : ""
                  }`}
                  value={config.moduleId}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, moduleId: e.target.value }))
                  }
                  disabled={!isModuleEnabled}
                  required
                >
                  {isModuleEnabled &&
                    moduleData.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Product ID <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  value={config.productId}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      productId: e.target.value,
                    }))
                  }
                  required
                >
                  {productData.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Layout ID <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  value={config.layoutId}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, layoutId: e.target.value }))
                  }
                  required
                >
                  {layout.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-8">
                <label className="form-label fw-semibold">
                  Page Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={config.pageName}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, pageName: e.target.value }))
                  }
                  placeholder="Enter page name"
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Purpose</label>
                <textarea
                  className="form-control"
                  value={config.purpose}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, purpose: e.target.value }))
                  }
                  placeholder="Describe the purpose of this form..."
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* --- Tabs Section --- */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="text-white fw-light">
            <i className="fa fa-layer-group me-2"></i>Form Tabs (
            {config.tabs.length})
          </h3>
          <button onClick={addTab} className="btn btn-primary btn-lg shadow">
            <i className="fa fa-plus me-2"></i> Add Tab
          </button>
        </div>

        {config.tabs.map((tab, tabIndex) => (
          <TabEditor
            key={tab.tab_id || tabIndex}
            tab={tab}
            tabIndex={tabIndex}
            updateConfig={updateConfig}
            addSection={addSection}
            removeSection={removeSection}
            addColumn={addColumn}
            removeColumn={removeColumn}
            removeTab={removeTab}
            fieldSource={fieldSource}
            fieldType={fieldType}
            fieldOrder={fieldOrder}
            fieldIcon={fieldIcon}
            jsVal={jsVal}
            spList={spList}
            tableList={tableList}
            storedProcedures={storedProcedures}
            eventHandler={eventHandler}
            iconData={iconData}
            spParamData={spParamData}
            tableCol={tableCol}
          />
        ))}

        {config.tabs.length === 0 && (
          <div className="text-center py-5 bg-white rounded shadow">
            <i className="fa fa-inbox fa-3x text-muted mb-3"></i>
            <h4 className="text-muted">No tabs added yet</h4>
            <p className="text-muted">
              Click the "Add Tab" button to get started
            </p>
          </div>
        )}

        {showJson && (
          <div className="mt-5">
            <h3 className="text-white border-bottom pb-2">
              <i className="fa fa-code me-2"></i>Final JSON Output
            </h3>
            <pre
              className="bg-dark text-white p-4 rounded shadow-lg overflow-auto"
              style={{ maxHeight: "500px" }}
            >
              {JSON.stringify(config, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </>
  );
};

export default FormPreviewPage;
