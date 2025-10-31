import React, { useState, useCallback, use, useEffect } from "react";
import { Form } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import projectAPI from "../../api/Api";

// --- Placeholder Data ---
const LOOKUPS = {
  projects: [
    { id: "1", name: "Project Alpha" },
    { id: "2", name: "Project Beta" },
  ],
  modules: [
    { id: "101", name: "Core Module" },
    { id: "102", name: "Admin Module" },
  ],
  layouts: [
    { id: "1", name: "Single Column" },
    { id: "2", name: "Dual Column" },
  ],
  tabIcons: [
    "fa-user",
    "fa-cogs",
    "fa-database",
    "fa-file-alt",
    "fa-chart-bar",
    "fa-briefcase",
    "fa-home",
    "fa-wrench",
  ],
  fieldTypes: [
    { id: "1", name: "Text Input" },
    { id: "2", name: "Number Input" },
    { id: "3", name: "Dropdown" },
    { id: "4", name: "Date Picker" },
    { id: "5", name: "Checkbox" },
    { id: "6", name: "Textarea" },
    { id: "7", name: "File Upload" },
  ],
  validations: [
    "Required",
    "Email Format",
    "Numeric Only",
    "Min Length (5)",
    "Max Length (100)",
  ],
  fieldSources: [
    "Static Value",
    "Database Table",
    "Stored Procedure",
    "Custom Logic",
  ],
};

// Utility

// --- Main Component ---
const FormPreviewPage = () => {
  const navigate = useNavigate();
  // const generateId = () =>
  //   Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
  const generateId = () => {
    const min = 1;
    const max = 100;
    const newNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return newNumber;
  };
  console.log(generateId());

  // --- Default Structures ---
  const defaultColumn = (order = 1) => ({
    labelName: "",
    fieldType: 0,
    fieldSourceLovDetId: 0,
    spName: null,
    spParam: null,
    tableName: null,
    tableColumns: null,
    eventHandlers: [],
    placeholder: "Enter data...",
    validations: [],
    fieldIconLovDetId: 0,
    fieldOrderLovDetId: order,
    storingSP: "",
    created_user: "",
  });

  const defaultSection = () => ({
    sectionIndex: generateId(),
    sectionType: "New Section",
    fields: [defaultColumn()],
  });

  const defaultTab = (count) => ({
    tabName: `Tab ${count}`,
    tabIcon: "fa-file-alt",
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
  const ColumnEditor = ({ column, path, updateConfig, removeColumn }) => {
    const [tabIndex, sectionIndex, columnIndex] = path;

    const handleFieldChange = (key, value) => {
      updateConfig((config) => {
        const newTabs = [...config.tabs];
        newTabs[tabIndex].sections[sectionIndex].fields[columnIndex] = {
          ...newTabs[tabIndex].sections[sectionIndex].fields[columnIndex],
          [key]: value,
        };
        return { ...config, tabs: newTabs };
      });
    };

    const InputField = ({
      label,
      value,
      name,
      type = "text",
      options = [],
    }) => {
      const isDropdown = options.length > 0;
      return (
        <div className="mb-3">
          <label className="form-label small text-muted text-uppercase fw-bold">
            {label}
          </label>
          {isDropdown ? (
            <select
              value={value}
              onChange={(e) => handleFieldChange(name, e.target.value)}
              className="form-select form-select-sm"
            >
              {options.map((opt) => (
                <option key={opt.id || opt} value={opt.id || opt}>
                  {opt.name || opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              value={value}
              onChange={(e) => handleFieldChange(name, e.target.value)}
              className="form-control form-control-sm"
              placeholder={label}
            />
          )}
        </div>
      );
    };

    return (
      <div className="bg-white p-3 border rounded mb-3 position-relative shadow-sm">
        <h6 className="text-primary mb-3 border-bottom pb-2">
          <i className={`fa ${column.fieldIconLovDetId} me-2`}></i> Field:{" "}
          {column.labelName || `Column ${columnIndex + 1}`}
        </h6>

        <button
          onClick={() => removeColumn(tabIndex, sectionIndex, columnIndex)}
          className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle"
          title="Remove Column/Field"
        >
          <i className="fa fa-times"></i>
        </button>

        <div className="row g-3">
          <div className="col-md-3">
            <InputField
              label="Field Type"
              name="fieldType"
              value={column.fieldType}
              options={fieldType}
            />
          </div>
          <div className="col-md-3">
            <InputField
              label="Field Source"
              name="fieldSourceLovDetId"
              value={column.fieldSourceLovDetId}
              options={fieldSource}
            />
          </div>
          <div className="col-md-3">
            <InputField
              label="SP Name"
              name="spName"
              value={column.spName}
              options={spList}
            />
          </div>
          <div className="col-md-3">
            <InputField
              label="SP Param"
              name="spParam"
              value={column.spParam}
              options={spParamData}
            />
          </div>
          <div className="col-md-3">
            <InputField
              label="Table Name"
              name="tableName"
              value={column.tableName}
              options={tableList}
            />
          </div>
          <div className="col-md-3">
            <InputField
              label="Table Coumns"
              name="tableColumns"
              value={column.tableColumns}
              options={tableCol}
            />
          </div>
          <div className="col-md-3">
            <InputField
              label="Field Name (Key)"
              name="labelName"
              value={column.labelName}
            />
          </div>
          <div className="col-md-3">
            <InputField
              label="Placeholder"
              name="placeholder"
              value={column.placeholder}
            />
          </div>
          {/* <Form.Label>Validation</Form.Label>
          <Form.Select
            value=""
            onChange={(e) => {
              const val = Number(e.target.value);

              // Ensures we don't add duplicates
              if (val && !(column.validations || []).includes(val)) {
                handleFieldChange("validations", [
                  ...(column.validations || []),
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
          </Form.Select> */}

          {/* Display badges (names from IDs) */}
          {/* <div className="mt-1">
            {(column.validations || []).map((vId) => {
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
                    handleFieldChange(
                      "validations",
                      (column.validations || []).filter((id) => id !== vId)
                    )
                  }
                >
                  {validationName} ✖
                </span>
              );
            })}
          </div> */}

          <div className="col-md-3">
            <InputField
              label="Event Handlers"
              name="eventHandlers"
              value={column.eventHandlers}
              options={eventHandler}
            />
          </div>
          <div className="col-md-3">
            <InputField
              label="Field Order"
              name="fieldOrderLovDetId"
              type="number"
              value={column.fieldOrderLovDetId}
              options={fieldOrder}
            />
          </div>
          <div className="col-md-3">
            <InputField
              label="Field Icon"
              name="fieldIconLovDetId"
              value={column.fieldIconLovDetId}
              options={iconData}
            />
          </div>
          <div className="col-md-3">
            <InputField
              label="Saving SP"
              name="storingSP"
              value={column.storingSP}
            />
          </div>
          <div className="col-md-3">
            <InputField
              label="Created User"
              name="created_user"
              value={column.created_user}
            />
          </div>
        </div>
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
      <div className="card mb-4 border-dark-subtle">
        <div className="card-header bg-dark-subtle d-flex justify-content-between align-items-center p-2">
          <div className="d-flex align-items-center w-50">
            <button
              className="btn btn-sm btn-outline-secondary me-2"
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <i
                className={`fa ${
                  isCollapsed ? "fa-chevron-down" : "fa-chevron-up"
                }`}
              ></i>
            </button>
            <i className="fa fa-layer-group text-dark me-2"></i>
            <input
              type="text"
              value={section.sectionType}
              onChange={handleSectionNameChange}
              className="form-control form-control-sm me-3 border-0 bg-transparent fw-bold text-dark"
              placeholder="Section Name"
            />
          </div>
          <div>
            <button
              onClick={() => addColumn(tabIndex, sectionIndex)}
              className="btn btn-sm btn-success me-2 shadow-sm"
            >
              <i className="fa fa-plus me-1"></i> Add Column/Field
            </button>
            <button
              onClick={() => removeSection(tabIndex, sectionIndex)}
              className="btn btn-sm btn-outline-danger shadow-sm"
            >
              <i className="fa fa-trash-alt"></i> Remove
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
  }) => {
    const handleTabFieldChange = (key, value) => {
      updateConfig((config) => {
        const newTabs = [...config.tabs];
        newTabs[tabIndex][key] = value;
        return { ...config, tabs: newTabs };
      });
    };

    const tabColorClass =
      tabIndex % 2 === 0
        ? "bg-primary-subtle border-primary"
        : "bg-secondary-subtle border-secondary";

    return (
      <div className={`card shadow-lg mb-4 ${tabColorClass}`}>
        <div
          className={`card-header text-white p-3 d-flex justify-content-between align-items-center ${
            tabIndex % 2 === 0 ? "bg-primary" : "bg-secondary"
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
              <label className="form-label fw-bold">Tab Name</label>
              <input
                type="text"
                className="form-control"
                value={tab.tabName}
                onChange={(e) =>
                  handleTabFieldChange("tabName", e.target.value)
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Tab Icon</label>
              <select
                className="form-select"
                value={tab.tabIcon}
                onChange={(e) =>
                  handleTabFieldChange("tabIcon", Number(e.target.value))
                }
              >
                {iconData.map((iconName) => (
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
  console.log(config);
  const [showJson, setShowJson] = useState(false);

  // Dropdown Bind List
  const [fieldSource, setFieldSource] = useState([]);
  const [fieldSize, setFieldSize] = useState([]);
  const [fieldIcon, setFieldIcon] = useState([]);
  const [fieldOrder, setFieldOrder] = useState([]);
  const [jsVal, setJsVal] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [moduleData, setModuleData] = useState([]);
  const [pageData, setPageData] = useState([]);
  const [iconData, setIconData] = useState([]);
  const [spList, setSpList] = useState([]);
  const [spParamData, setSpParamData] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [tableCol, setTableCol] = useState([]);
  const [fieldType, setFieldType] = useState([]);
  const [storedProcedures, setStoredProcedures] = useState([]);
  const [eventHandler, setEventHandler] = useState([]);
  const [layout, setLayout] = useState([]);
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    fetchFieldSrcData();
    fetchFieldSizeData();
    fetchFieldIconData();
    fetchFieldOrderData();
    fetchJsValData();
    fetchProjectData();
    fetchModuleData();
    fetchPageData();
    fetchIconData();
    // fetchTabData();
    fetchSpListData();
    fetchTableListData();
    fetchFieldTypeData();
    fetchStoringSPData();
    fetchEventHandlerData();
    fetchLayoutData();
    fetchProductData();
  }, []);

  const fetchLayoutData = async () => {
    try {
      await projectAPI.getLovDropdown("LAYOUT_TABLE", null).then((res) => {
        const formattedData = res.data.result.map((eachSrc) => ({
          id: eachSrc.Id,
          name: eachSrc.Name,
        }));
        setLayout(formattedData);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFieldSrcData = async () => {
    try {
      await projectAPI
        .getLovDropdown("LIST_OF_VALUES_DETAILS", "field_source")
        .then((res) => {
          const formattedData = res.data.result.map((eachSrc) => ({
            id: eachSrc.Id,
            name: eachSrc.Name,
          }));
          setFieldSource(formattedData);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFieldSizeData = async () => {
    try {
      await projectAPI
        .getLovDropdown("LIST_OF_VALUES_DETAILS", "field_size")
        .then((res) => {
          const formattedData = res.data.result.map((eachSize) => ({
            id: eachSize.Id,
            name: eachSize.Name,
          }));
          setFieldSize(formattedData);
        });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchFieldIconData = async () => {
    try {
      await projectAPI
        .getLovDropdown("LIST_OF_VALUES_DETAILS", "field_icon")
        .then((res) => {
          const formattedData = res.data.result.map((eachSize) => ({
            id: eachSize.Id,
            name: eachSize.Name,
          }));
          setFieldIcon(formattedData);
        });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchFieldOrderData = async () => {
    try {
      await projectAPI
        .getLovDropdown("LIST_OF_VALUES_DETAILS", "field_order")
        .then((res) => {
          const formattedData = res.data.result.map((eachSize) => ({
            id: eachSize.Id,
            name: eachSize.Name,
          }));
          setFieldOrder(formattedData);
        });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchJsValData = async () => {
    try {
      await projectAPI.getLovDropdown("JS_VALIDATIONS", null).then((res) => {
        const formattedData = res.data.result.map((eachSize) => ({
          id: eachSize.Id,
          name: eachSize.Name,
        }));
        setJsVal(formattedData);
      });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchProjectData = async () => {
    try {
      await projectAPI.getLovDropdown("PROJECT_TABLE", null).then((res) => {
        const formattedData = res.data.result.map((eachSize) => ({
          id: eachSize.Id,
          name: eachSize.Name,
        }));
        setProjectData(formattedData);
      });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchModuleData = async () => {
    try {
      await projectAPI.getLovDropdown("MODULE_TABLE", null).then((res) => {
        const formattedData = res.data.result.map((eachSize) => ({
          id: eachSize.Id,
          name: eachSize.Name,
        }));
        setModuleData(formattedData);
      });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchPageData = async () => {
    try {
      await projectAPI.getLovDropdown("PAGE_TABLE", null).then((res) => {
        const formattedData = res.data.result.map((eachSize) => ({
          id: eachSize.Id,
          name: eachSize.Name,
        }));
        setPageData(formattedData);
      });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchIconData = async () => {
    try {
      await projectAPI.getLovDropdown("TAB_IMAGE_TABLE", null).then((res) => {
        const formattedData = res.data.result.map((eachSize) => ({
          id: eachSize.Id,
          name: eachSize.Name,
        }));
        setIconData(formattedData);
      });
    } catch (error) {
      console.error(error);
    }
  };
  // const fetchTabData = async () => {
  //   try {
  //     await projectAPI.getLovDropdown("TAB_TABLE", null).then((res) => {
  //       const formattedData = res.data.result.map((eachSize) => ({
  //         id: eachSize.Id,
  //         name: eachSize.Name,
  //       }));
  //       setTabs(formattedData);
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  const fetchSpListData = async () => {
    try {
      await projectAPI.getLovDropdown("SP_LIST", null).then((res) => {
        const formattedData = res.data.result.map((eachSize) => ({
          id: eachSize.Id,
          name: eachSize.Name,
        }));
        setSpList(formattedData);
      });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchTableListData = async () => {
    try {
      await projectAPI.getLovDropdown("TABLE_LIST", null).then((res) => {
        const formattedData = res.data.result.map((eachSize) => ({
          id: eachSize.Id,
          name: eachSize.Name,
        }));
        setTableList(formattedData);
      });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchFieldTypeData = async () => {
    try {
      await projectAPI.getLovDropdown("FIELD_TYPE", null).then((res) => {
        const formattedData = res.data.result.map((eachSize) => ({
          id: eachSize.Id,
          name: eachSize.Name,
        }));
        setFieldType(formattedData);
      });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchStoringSPData = async () => {
    try {
      await projectAPI.getLovDropdown("STORING_SP", null).then((res) => {
        const formattedData = res.data.result.map((eachSrc) => ({
          id: eachSrc.Id,
          name: eachSrc.Name,
        }));
        setStoredProcedures(formattedData);
      });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchEventHandlerData = async () => {
    try {
      await projectAPI
        .getLovDropdown("FORM_EVENT_HANDLER", null)
        .then((res) => {
          const formattedData = res.data.result.map((eachSrc) => ({
            id: eachSrc.Id,
            name: eachSrc.Name,
          }));
          setEventHandler(formattedData);
        });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchProductData = async () => {
    try {
      await projectAPI.getLovDropdown("PRODUCT_TABLE", null).then((res) => {
        const formattedData = res.data.result.map((eachSrc) => ({
          id: eachSrc.Id,
          name: eachSrc.Name,
        }));
        setProductData(formattedData);
      });
    } catch (error) {
      console.error(error);
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

  const handleSubmitConfig = async (e) => {
    e.preventDefault();
    try {
      await projectAPI
        .insertFormGen(config)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.error(err);
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

      <div
        className=" min-vh-100 p-3"
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
              Dynamic Form Generator V1
            </span>
            <div className="d-flex">
              <button
                onClick={() => setShowJson(!showJson)}
                className="btn btn-outline-secondary me-2"
              >
                <i
                  className={`fa ${showJson ? "fa-eye-slash" : "fa-eye"} me-1`}
                ></i>{" "}
                {showJson ? "Hide Config" : "Show JSON"}
              </button>
              <button
                onClick={(e) => handleSubmitConfig(e)}
                className="btn btn-success shadow-sm"
              >
                <i className="fa fa-save me-1"></i> Save Configuration
              </button>
            </div>
          </div>
        </nav>

        {/* --- Project Setup Details --- */}
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-primary text-white fw-bold">
            Project Setup Details
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label fw-bold">Project ID</label>
                <select
                  className="form-select"
                  value={config.projectId}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      projectId: e.target.value,
                    }))
                  }
                >
                  {projectData.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold">Module ID</label>
                <select
                  className="form-select"
                  value={config.moduleId}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, moduleId: e.target.value }))
                  }
                >
                  {moduleData.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold">Product ID</label>
                <select
                  className="form-select"
                  value={config.productId}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      productId: Number(e.target.value),
                    }))
                  }
                >
                  {productData.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold">Layout ID</label>
                <select
                  className="form-select"
                  value={config.layoutId}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, layoutId: e.target.value }))
                  }
                >
                  {layout.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Page Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={config.pageName}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, pageName: e.target.value }))
                  }
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Purpose</label>
                <textarea
                  className="form-control"
                  value={config.purpose}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, purpose: e.target.value }))
                  }
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* --- Tabs --- */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="text-secondary fw-light">
            Form Tabs ({config.tabs.length})
          </h3>
          <button onClick={addTab} className="btn btn-primary btn-lg">
            <i className="fa fa-plus me-2"></i> Add Tab
          </button>
        </div>

        {config.tabs.map((tab, tabIndex) => (
          <TabEditor
            key={tab.tab_id}
            tab={tab}
            tabIndex={tabIndex}
            updateConfig={updateConfig}
            addSection={addSection}
            removeSection={removeSection}
            addColumn={addColumn}
            removeColumn={removeColumn}
            removeTab={removeTab}
          />
        ))}

        {showJson && (
          <div className="mt-5">
            <h3 className="text-secondary border-bottom pb-2">
              Final JSON Output
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
