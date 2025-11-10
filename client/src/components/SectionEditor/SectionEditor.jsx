import React, { useState, useEffect } from "react";
import ColumnEditor from "../ColumnEditor/ColumnEditor";
import {
  updateConfig,
  updateField,
} from "../../context/FormBuilderContext/formAction";

const SectionEditor = React.memo(
  ({
    section,
    path,
    dispatch,
    addColumn,
    removeColumn,
    removeSection,
    ...props
  }) => {
    const [tabIndex, sectionIndex] = path;
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [sectionName, setSectionName] = useState(section.sectionType);

    // Use useEffect to sync with prop changes
    useEffect(() => {
      setSectionName(section.sectionType);
    }, [section.sectionType]);

    const handleSectionNameChange = (e) => {
      const newName = e.target.value;
      setSectionName(newName);
      dispatch(
        updateConfig((config) => {
          const newTabs = [...config.tabs];
          newTabs[tabIndex].sections[sectionIndex].sectionType = newName;
          return { ...config, tabs: newTabs };
        })
      );
    };

    return (
      <div className="card mb-4 border-primary shadow-sm">
        <div
          className="card-header text-white d-flex justify-content-between align-items-center p-3"
          style={{ backgroundColor: "#070C37" }}
        >
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
              value={sectionName}
              onChange={handleSectionNameChange}
              className="form-control form-control-sm me-3 fw-bold"
              placeholder="Section Name"
              style={{
                color: "white",
                fontWeight: "bold",
                backgroundColor: "transparent",
                border: "1px solid rgba(255,255,255,0.3)",
                outline: "none",
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = "rgba(255,255,255,0.1)";
                e.target.style.border = "1px solid rgba(255,255,255,0.5)";
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.border = "1px solid rgba(255,255,255,0.3)";
              }}
            />
          </div>
          <div>
            <button
              onClick={() => dispatch(addColumn(tabIndex, sectionIndex))}
              className="btn btn-sm btn-light me-2"
            >
              <i className="fa fa-plus me-1"></i> Add Field
            </button>
            <button
              onClick={() => dispatch(removeSection(tabIndex, sectionIndex))}
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
                dispatch={dispatch}
                updateConfig={updateConfig}
                updateField={updateField}
                removeColumn={removeColumn}
                {...props}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
);

export default SectionEditor;
