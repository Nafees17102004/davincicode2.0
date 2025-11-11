import React, { useState, useEffect } from "react";
import SectionEditor from "../SectionEditor/SectionEditor";

const TabEditor = React.memo(
  ({
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
    const [tabName, setTabName] = useState(tab.tabName);
    const [tabIcon, setTabIcon] = useState(tab.tabIcon);

    useEffect(() => {
      setTabName(tab.tabName);
      setTabIcon(tab.tabIcon);
    }, [tab.tabName, tab.tabIcon]);

    const handleTabNameChange = (value) => {
      setTabName(value);
      updateConfig((config) => {
        const newTabs = [...config.tabs];
        newTabs[tabIndex].tabName = value;
        return { ...config, tabs: newTabs };
      });
    };

    const handleTabIconChange = (value) => {
      setTabIcon(value);
      updateConfig((config) => {
        const newTabs = [...config.tabs];
        newTabs[tabIndex].tabIcon = value;
        return { ...config, tabs: newTabs };
      });
    };

    const handleRemoveTab = () => {
      console.log("Removing tab:", tabIndex);
      removeTab(tabIndex);
    };

    const handleAddSection = () => {
      console.log("Adding section to tab:", tabIndex);
      addSection(tabIndex);
    };

    const tabColorClass =
      tabIndex % 2 === 0 ? "border-primary" : "border-success";

    return (
      <div className={`card shadow-lg mb-4 ${tabColorClass}`}>
        <div
          className="card-header text-white p-3 d-flex justify-content-between align-items-center"
          style={{
            backgroundColor: "#070C37",
          }}
        >
          <h4 className="mb-0">
            <i className={`fa ${tabIcon} me-3`}></i> Tab #{tabIndex + 1}:{" "}
            {tabName}
          </h4>
          <button
            onClick={handleRemoveTab}
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
                value={tabName}
                onChange={(e) => handleTabNameChange(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Tab Icon <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                value={tabIcon || ""}
                onChange={(e) => handleTabIconChange(e.target.value)}
                required
              >
                <option value="">Select Icon</option>
                {props.iconData &&
                  props.iconData.map((iconName) => (
                    <option key={iconName.id} value={iconName.id}>
                      {iconName.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Add Section Button */}
          <div className="d-flex justify-content-start mb-4">
            <button
              onClick={handleAddSection}
              className="btn shadow-sm text-white"
              style={{ backgroundColor: "#070C37" }}
            >
              <i className="fa fa-plus me-2"></i> Add Section
            </button>
          </div>

          {tab.sections &&
            tab.sections.map((section, sectionIndex) => (
              <SectionEditor
                key={section.section_id || `section-${sectionIndex}`}
                section={section}
                path={[tabIndex, sectionIndex]}
                updateConfig={updateConfig}
                addColumn={addColumn}
                removeColumn={removeColumn}
                removeSection={removeSection}
                {...props}
              />
            ))}
        </div>
      </div>
    );
  }
);

export default TabEditor;
