import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// --- Placeholder Data ---
const LOOKUPS = {
  projects: [{ id: "1", name: "Project Alpha" }, { id: "2", name: "Project Beta" }],
  modules: [{ id: "101", name: "Core Module" }, { id: "102", name: "Admin Module" }],
  layouts: [{ id: "1", name: "Single Column" }, { id: "2", name: "Dual Column" }],
  tabIcons: ["fa-user", "fa-cogs", "fa-database", "fa-file-alt", "fa-chart-bar", "fa-briefcase", "fa-home", "fa-wrench"],
  fieldTypes: [
    { id: "1", name: "Text Input" },
    { id: "2", name: "Number Input" },
    { id: "3", name: "Dropdown" },
    { id: "4", name: "Date Picker" },
    { id: "5", name: "Checkbox" },
    { id: "6", name: "Textarea" },
    { id: "7", name: "File Upload" }
  ],
  validations: ["Required", "Email Format", "Numeric Only", "Min Length (5)", "Max Length (100)"],
  fieldSources: ["Static Value", "Database Table", "Stored Procedure", "Custom Logic"]
};

// Utility
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

// --- Default Structures ---
const defaultColumn = (order = 1) => ({
  column_id: generateId(),
  field_name: "",
  field_type_id: "1",
  field_source: "Static Value",
  placeholder: "Enter data...",
  validation: "Required",
  field_icon: "fa-tag",
  field_order: order,
  saving_sp: "",
  created_user: "Admin"
});

const defaultSection = () => ({
  section_id: generateId(),
  section_name: "New Section",
  columns: [defaultColumn()]
});

const defaultTab = (count) => ({
  tab_id: generateId(),
  tab_name: `Tab ${count}`,
  tab_icon: "fa-file-alt",
  sections: [defaultSection()]
});

const initialState = {
  projectId: "1",
  moduleId: "101",
  layoutId: "1",
  pageName: "New Dynamic Page",
  purpose: "Define dynamic form structure based on master tables.",
  tabs: []
};

// --- Column Editor ---
const ColumnEditor = ({ column, path, updateConfig, removeColumn }) => {
  const [tabIndex, sectionIndex, columnIndex] = path;

  const handleFieldChange = (key, value) => {
    updateConfig((config) => {
      const newTabs = [...config.tabs];
      newTabs[tabIndex].sections[sectionIndex].columns[columnIndex] = {
        ...newTabs[tabIndex].sections[sectionIndex].columns[columnIndex],
        [key]: value
      };
      return { ...config, tabs: newTabs };
    });
  };

  const InputField = ({ label, value, name, type = "text", options = [] }) => {
    const isDropdown = options.length > 0;
    return (
      <div className="mb-3">
        <label className="form-label small text-muted text-uppercase fw-bold">{label}</label>
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
        <i className={`fa ${column.field_icon} me-2`}></i> Field: {column.field_name || `Column ${columnIndex + 1}`}
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
          <InputField label="Field Type" name="field_type_id" value={column.field_type_id} options={LOOKUPS.fieldTypes} />
        </div>
        <div className="col-md-3">
          <InputField label="Field Source" name="field_source" value={column.field_source} options={LOOKUPS.fieldSources} />
        </div>
        <div className="col-md-3">
          <InputField label="Field Name (Key)" name="field_name" value={column.field_name} />
        </div>
        <div className="col-md-3">
          <InputField label="Placeholder" name="placeholder" value={column.placeholder} />
        </div>
        <div className="col-md-3">
          <InputField label="Validation" name="validation" value={column.validation} options={LOOKUPS.validations} />
        </div>
        <div className="col-md-3">
          <InputField label="Field Order" name="field_order" type="number" value={column.field_order} />
        </div>
        <div className="col-md-3">
          <InputField label="Field Icon" name="field_icon" value={column.field_icon} options={LOOKUPS.tabIcons} />
        </div>
        <div className="col-md-3">
          <InputField label="Saving SP" name="saving_sp" value={column.saving_sp} />
        </div>
        <div className="col-md-3">
          <InputField label="Created User" name="created_user" value={column.created_user} />
        </div>
      </div>
    </div>
  );
};

// --- Section Editor ---
const SectionEditor = ({ section, path, updateConfig, addColumn, removeColumn, removeSection }) => {
  const [tabIndex, sectionIndex] = path;
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSectionNameChange = (e) => {
    const newName = e.target.value;
    updateConfig((config) => {
      const newTabs = [...config.tabs];
      newTabs[tabIndex].sections[sectionIndex].section_name = newName;
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
            <i className={`fa ${isCollapsed ? "fa-chevron-down" : "fa-chevron-up"}`}></i>
          </button>
          <i className="fa fa-layer-group text-dark me-2"></i>
          <input
            type="text"
            value={section.section_name}
            onChange={handleSectionNameChange}
            className="form-control form-control-sm me-3 border-0 bg-transparent fw-bold text-dark"
            placeholder="Section Name"
          />
        </div>
        <div>
          <button onClick={() => addColumn(tabIndex, sectionIndex)} className="btn btn-sm btn-success me-2 shadow-sm">
            <i className="fa fa-plus me-1"></i> Add Column/Field
          </button>
          <button onClick={() => removeSection(tabIndex, sectionIndex)} className="btn btn-sm btn-outline-danger shadow-sm">
            <i className="fa fa-trash-alt"></i> Remove
          </button>
        </div>
      </div>

      <div className={`collapse ${!isCollapsed ? "show" : ""}`}>
        <div className="card-body bg-light">
          {section.columns.map((column, columnIndex) => (
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
const TabEditor = ({ tab, tabIndex, updateConfig, addSection, removeSection, addColumn, removeColumn, removeTab }) => {
  const handleTabFieldChange = (key, value) => {
    updateConfig((config) => {
      const newTabs = [...config.tabs];
      newTabs[tabIndex][key] = value;
      return { ...config, tabs: newTabs };
    });
  };

  const tabColorClass = tabIndex % 2 === 0 ? "bg-primary-subtle border-primary" : "bg-secondary-subtle border-secondary";

  return (
    <div className={`card shadow-lg mb-4 ${tabColorClass}`}>
      <div className={`card-header text-white p-3 d-flex justify-content-between align-items-center ${tabIndex % 2 === 0 ? "bg-primary" : "bg-secondary"}`}>
        <h4 className="mb-0"><i className={`fa ${tab.tab_icon} me-3`}></i> Tab #{tabIndex + 1}: {tab.tab_name}</h4>
        <button onClick={() => removeTab(tabIndex)} className="btn btn-sm btn-light text-danger shadow-sm">
          <i className="fa fa-trash-alt me-1"></i> Remove Tab
        </button>
      </div>

      <div className="card-body">
        <div className="row mb-4 g-3 p-3 border rounded bg-white shadow-sm">
          <div className="col-md-6">
            <label className="form-label fw-bold">Tab Name</label>
            <input type="text" className="form-control" value={tab.tab_name} onChange={(e) => handleTabFieldChange("tab_name", e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Tab Icon</label>
            <select className="form-select" value={tab.tab_icon} onChange={(e) => handleTabFieldChange("tab_icon", e.target.value)}>
              {LOOKUPS.tabIcons.map(iconName => (
                <option key={iconName} value={iconName}>{iconName.replace("fa-", "").toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>

        {tab.sections.map((section, sectionIndex) => (
          <SectionEditor
            key={section.section_id}
            section={section}
            path={[tabIndex, sectionIndex]}
            updateConfig={updateConfig}
            addColumn={addColumn}
            removeColumn={removeColumn}
            removeSection={removeSection}
          />
        ))}

        <button onClick={() => addSection(tabIndex)} className="btn btn-warning shadow-sm">
          <i className="fa fa-plus me-2"></i> Add Section
        </button>
      </div>
    </div>
  );
};

// --- Main Component ---
const FormPreviewPage = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState(initialState);
  const [showJson, setShowJson] = useState(false);

  const updateConfig = useCallback((updater) => setConfig(prev => updater(prev)), []);

  const addTab = () => updateConfig(config => ({ ...config, tabs: [...config.tabs, defaultTab(config.tabs.length + 1)] }));
  const removeTab = (tabIndex) => updateConfig(config => ({ ...config, tabs: config.tabs.filter((_, i) => i !== tabIndex) }));
  const addSection = (tabIndex) => updateConfig(config => { const newTabs = [...config.tabs]; newTabs[tabIndex].sections.push(defaultSection()); return { ...config, tabs: newTabs }; });
  const removeSection = (tabIndex, sectionIndex) => updateConfig(config => { const newTabs = [...config.tabs]; newTabs[tabIndex].sections.splice(sectionIndex, 1); return { ...config, tabs: newTabs }; });
  const addColumn = (tabIndex, sectionIndex) => updateConfig(config => { const newTabs = [...config.tabs]; const cols = newTabs[tabIndex].sections[sectionIndex].columns; cols.push(defaultColumn(cols.length + 1)); return { ...config, tabs: newTabs }; });
  const removeColumn = (tabIndex, sectionIndex, columnIndex) => updateConfig(config => { const newTabs = [...config.tabs]; newTabs[tabIndex].sections[sectionIndex].columns.splice(columnIndex, 1); return { ...config, tabs: newTabs }; });

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />

      <div className=" min-vh-100 p-3" style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
        <nav className="navbar navbar-dark bg-dark sticky-top shadow-lg mb-4 rounded-3 p-2">
          <div className="container-fluid">
            <button onClick={() => navigate("/")} className="btn btn-outline-light me-3">
              <i className="fa fa-chevron-left me-1"></i> Back
            </button>
            <span className="navbar-brand h1 mb-0 text-warning">Dynamic Form Generator V1</span>
            <div className="d-flex">
              <button onClick={() => setShowJson(!showJson)} className="btn btn-outline-secondary me-2">
                <i className={`fa ${showJson ? "fa-eye-slash" : "fa-eye"} me-1`}></i> {showJson ? "Hide Config" : "Show JSON"}
              </button>
              <button onClick={() => console.log("Saved Config:", JSON.stringify(config, null, 2))} className="btn btn-success shadow-sm">
                <i className="fa fa-save me-1"></i> Save Configuration
              </button>
            </div>
          </div>
        </nav>

        {/* --- Project Setup Details --- */}
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-primary text-white fw-bold">Project Setup Details</div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label fw-bold">Project ID</label>
                <select className="form-select" value={config.projectId} onChange={(e) => setConfig(prev => ({ ...prev, projectId: e.target.value }))}>
                  {LOOKUPS.projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold">Module ID</label>
                <select className="form-select" value={config.moduleId} onChange={(e) => setConfig(prev => ({ ...prev, moduleId: e.target.value }))}>
                  {LOOKUPS.modules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold">Layout ID</label>
                <select className="form-select" value={config.layoutId} onChange={(e) => setConfig(prev => ({ ...prev, layoutId: e.target.value }))}>
                  {LOOKUPS.layouts.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Page Name</label>
                <input type="text" className="form-control" value={config.pageName} onChange={(e) => setConfig(prev => ({ ...prev, pageName: e.target.value }))} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Purpose</label>
                <textarea className="form-control" value={config.purpose} onChange={(e) => setConfig(prev => ({ ...prev, purpose: e.target.value }))}></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* --- Tabs --- */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="text-secondary fw-light">Form Tabs ({config.tabs.length})</h3>
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
            <h3 className="text-secondary border-bottom pb-2">Final JSON Output</h3>
            <pre className="bg-dark text-white p-4 rounded shadow-lg overflow-auto" style={{ maxHeight: "500px" }}>
              {JSON.stringify(config, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </>
  );
};

export default FormPreviewPage;
