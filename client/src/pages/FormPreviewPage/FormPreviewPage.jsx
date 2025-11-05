import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import projectAPI from "../../api/Api";
import Toast from "../../components/Toaster/Toaster";
import TabEditor from "../../components/TabEditor/TabEditor";

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

  // API fetch functions (keep the same as before)
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

  const fetchSpParams = async (spName) => {
    try {
      const res = await projectAPI.getLovDropdown("SP_PARAMS", spName);
      const formattedParams = res.data.result.map((each) => ({
        id: each.Id,
        name: each.Name,
      }));
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
        style={{ background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)" }}
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
        style={{ background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)" }}
      >
        <nav
          className="navbar navbar-dark sticky-top shadow-lg mb-4 rounded-3 p-2"
          style={{ backgroundColor: "#070C37" }}
        >
          <div className="container-fluid">
            <button
              onClick={() => navigate("/")}
              className="btn btn-outline-light me-3"
            >
              <i className="fa fa-chevron-left me-1"></i> Back
            </button>
            <span className="navbar-brand h1 mb-0 text-white">
              <i className="fa fa-magic me-2"></i>Dynamic Form Generator V2
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
                className="btn btn-outline-light text-white shadow-sm"
                style={{ backgroundColor: "#070C37" }}
              >
                <i className="fa fa-save me-1"></i> Save Configuration
              </button>
            </div>
          </div>
        </nav>

        {/* --- Project Setup Details --- */}
        <div className="card mb-4 shadow-lg border-0">
          <div
            className="card-header text-white fw-bold p-3"
            style={{ backgroundColor: "#070C37" }}
          >
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
          <h3 className="text-dark fw-light">
            <i className="fa fa-layer-group me-2"></i>Form Tabs (
            {config.tabs.length})
          </h3>
          <button
            onClick={addTab}
            className="btn btn-lg shadow text-white"
            style={{ backgroundColor: "#070C37" }}
          >
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
            showToast={showToast}
            fetchSpParams={fetchSpParams}
            fetchTableColumns={fetchTableColumns}
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
            <h3 className="text-dark border-bottom pb-2">
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
