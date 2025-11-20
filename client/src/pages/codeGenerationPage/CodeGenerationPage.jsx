import React, { useState, useEffect } from "react";
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CAlert,
  CSpinner,
  CBadge,
} from "@coreui/react";
import { useNavigate, useLocation } from "react-router-dom";
import "./CodeGenerationPage.css";

const CodeGenerationPage = ({ codeData }) => {
  const navigate = useNavigate();
  const location = useLocation();

  console.log("Received codeData:", codeData);
  console.log("Location state:", location.state);

  const [formData, setFormData] = useState({});
  const [generatedCode, setGeneratedCode] = useState({
    repository: "",
    controller: "",
    route: "",
    model: "",
    service: "",
  });

  const [activeCodeTab, setActiveCodeTab] = useState("repository");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Function to format code with proper indentation
  const formatCode = (code) => {
    if (!code) return "";

    // Remove extra carriage returns and normalize line endings
    let formattedCode = code.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    // Remove extra whitespace and fix indentation
    let indentLevel = 0;
    const lines = formattedCode.split("\n");
    const formattedLines = lines.map((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return "";

      // Decrease indent level for closing braces
      if (trimmedLine.includes("}") && !trimmedLine.includes("{")) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      // Apply current indent level
      const indentedLine = "    ".repeat(indentLevel) + trimmedLine;

      // Increase indent level for opening braces
      if (trimmedLine.includes("{") && !trimmedLine.includes("}")) {
        indentLevel += 1;
      }

      return indentedLine;
    });

    return formattedLines.filter((line) => line !== "").join("\n");
  };

  useEffect(() => {
    // Check for codeData prop first, then location state
    const dataToUse =
      codeData || location.state?.formData || location.state?.generatedCode;

    if (dataToUse) {
      console.log("Using data:", dataToUse);
      handleReceivedCodeData(dataToUse);
    } else {
      setError(
        "No code data available. Please go back and generate code first."
      );
    }
  }, [location, codeData]);

  const handleReceivedCodeData = (data) => {
    // If data contains generated code files (Controller, Repository, Route, Service)
    if (data.Controller || data.Repository || data.Route || data.Service) {
      console.log("Received generated code files");

      // Map the received code to our state structure with formatting
      const mappedCode = {
        controller: formatCode(data.Controller) || "",
        repository: formatCode(data.Repository) || "",
        route: formatCode(data.Route) || "",
        service: formatCode(data.Service) || "",
        model: formatCode(data.Model) || "",
      };

      setGeneratedCode(mappedCode);
      setActiveCodeTab("repository");
      setSuccess("Generated code loaded successfully!");

      // Set a default formData for display
      setFormData({
        pageName: "Generated Code",
        formName: "Auto-generated Form",
      });
    }
    // If it's form data with pageName
    else if (data.pageName) {
      setFormData(data);
      generateAllCode(data);
    }
    // If it's empty or invalid
    else {
      setError("Invalid code data received. Please regenerate the code.");
    }
  };

  const generateAllCode = async (formDataFromProps = null) => {
    const dataToUse = formDataFromProps || formData;

    if (!dataToUse?.pageName) {
      setError(
        "No form configuration found. Please go back and save your form first."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Generate code using the helper functions with formatting
      const mockGeneratedCode = {
        repository: formatCode(generateRepositoryCode(dataToUse)),
        controller: formatCode(generateControllerCode(dataToUse)),
        route: formatCode(generateRouteCode(dataToUse)),
        model: formatCode(generateModelCode(dataToUse)),
        service: formatCode(generateServiceCode(dataToUse)),
      };

      setGeneratedCode(mockGeneratedCode);
      setActiveCodeTab("repository");
      setSuccess("Code generated successfully from form configuration!");
    } catch (error) {
      console.error("Error generating code:", error);
      setError("Failed to generate code from configuration");
    } finally {
      setLoading(false);
    }
  };

  // Helper functions to generate code based on form data
  const generateRepositoryCode = (formData) => {
    const entityName = formData.pageName.replace(/\s+/g, "");
    return `// ${entityName}Repository.js
const pool = require('../config/database');

class ${entityName}Repository {
  static async findAll() {
    const query = 'SELECT * FROM ${formData.pageName.toLowerCase()}';
    const [rows] = await pool.query(query);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM ${formData.pageName.toLowerCase()} WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  static async create(data) {
    const query = 'INSERT INTO ${formData.pageName.toLowerCase()} SET ?';
    const [result] = await pool.query(query, data);
    return result.insertId;
  }

  static async update(id, data) {
    const query = 'UPDATE ${formData.pageName.toLowerCase()} SET ? WHERE id = ?';
    const [result] = await pool.query(query, [data, id]);
    return result.affectedRows;
  }

  static async delete(id) {
    const query = 'DELETE FROM ${formData.pageName.toLowerCase()} WHERE id = ?';
    const [result] = await pool.query(query, [id]);
    return result.affectedRows;
  }
}

module.exports = ${entityName}Repository;`;
  };

  const generateControllerCode = (formData) => {
    const entityName = formData.pageName.replace(/\s+/g, "");
    return `// ${entityName}Controller.js
const ${entityName}Service = require('../services/${entityName}Service');

class ${entityName}Controller {
  static async getAll(req, res) {
    try {
      const data = await ${entityName}Service.getAll();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching ${formData.pageName.toLowerCase()}' 
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await ${entityName}Service.getById(id);
      if (!data) {
        return res.status(404).json({ 
          success: false, 
          message: '${formData.pageName} not found' 
        });
      }
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching ${formData.pageName.toLowerCase()}' 
      });
    }
  }

  static async create(req, res) {
    try {
      const newItem = await ${entityName}Service.create(req.body);
      res.status(201).json({ success: true, data: newItem });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Error creating ${formData.pageName.toLowerCase()}' 
      });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const updated = await ${entityName}Service.update(id, req.body);
      if (!updated) {
        return res.status(404).json({ 
          success: false, 
          message: '${formData.pageName} not found' 
        });
      }
      res.json({ success: true, message: '${
        formData.pageName
      } updated successfully' });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Error updating ${formData.pageName.toLowerCase()}' 
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ${entityName}Service.delete(id);
      if (!deleted) {
        return res.status(404).json({ 
          success: false, 
          message: '${formData.pageName} not found' 
        });
      }
      res.json({ success: true, message: '${
        formData.pageName
      } deleted successfully' });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Error deleting ${formData.pageName.toLowerCase()}' 
      });
    }
  }
}

module.exports = ${entityName}Controller;`;
  };

  const generateRouteCode = (formData) => {
    const entityName = formData.pageName.replace(/\s+/g, "");
    return `// ${entityName}Routes.js
const express = require('express');
const router = express.Router();
const ${entityName}Controller = require('../controllers/${entityName}Controller');

// @route   GET /api/${formData.pageName.toLowerCase()}
// @desc    Get all ${formData.pageName.toLowerCase()}
// @access  Public
router.get('/', ${entityName}Controller.getAll);

// @route   GET /api/${formData.pageName.toLowerCase()}/:id
// @desc    Get ${formData.pageName.toLowerCase()} by ID
// @access  Public
router.get('/:id', ${entityName}Controller.getById);

// @route   POST /api/${formData.pageName.toLowerCase()}
// @desc    Create new ${formData.pageName.toLowerCase()}
// @access  Public
router.post('/', ${entityName}Controller.create);

// @route   PUT /api/${formData.pageName.toLowerCase()}/:id
// @desc    Update ${formData.pageName.toLowerCase()}
// @access  Public
router.put('/:id', ${entityName}Controller.update);

// @route   DELETE /api/${formData.pageName.toLowerCase()}/:id
// @desc    Delete ${formData.pageName.toLowerCase()}
// @access  Public
router.delete('/:id', ${entityName}Controller.delete);

module.exports = router;`;
  };

  const generateModelCode = (formData) => {
    const entityName = formData.pageName.replace(/\s+/g, "");
    return `// ${entityName}Model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ${entityName} = sequelize.define('${entityName}', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: '${formData.pageName.toLowerCase()}',
  timestamps: false,
  underscored: true
});

module.exports = ${entityName};`;
  };

  const generateServiceCode = (formData) => {
    const entityName = formData.pageName.replace(/\s+/g, "");
    return `// ${entityName}Service.js
const ${entityName}Repository = require('../repositories/${entityName}Repository');

class ${entityName}Service {
  static async getAll() {
    return await ${entityName}Repository.findAll();
  }

  static async getById(id) {
    return await ${entityName}Repository.findById(id);
  }

  static async create(data) {
    return await ${entityName}Repository.create(data);
  }

  static async update(id, data) {
    return await ${entityName}Repository.update(id, data);
  }

  static async delete(id) {
    return await ${entityName}Repository.delete(id);
  }
}

module.exports = ${entityName}Service;`;
  };

  const copyToClipboard = () => {
    const codeToCopy = generatedCode[activeCodeTab];
    if (!codeToCopy) {
      setError("No code available to copy");
      return;
    }

    navigator.clipboard.writeText(codeToCopy).then(() => {
      const originalSuccess = success;
      setSuccess("Code copied to clipboard!");
      setTimeout(() => setSuccess(originalSuccess), 2000);
    });
  };

  const downloadCode = () => {
    if (!generatedCode[activeCodeTab]) {
      setError("No code available to download");
      return;
    }

    const element = document.createElement("a");
    const file = new Blob([generatedCode[activeCodeTab]], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);

    const fileName = formData.pageName
      ? `${formData.pageName}${
          activeCodeTab.charAt(0).toUpperCase() + activeCodeTab.slice(1)
        }.js`
      : `Generated${
          activeCodeTab.charAt(0).toUpperCase() + activeCodeTab.slice(1)
        }.js`;

    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleContinue = () => {
    navigate("/dynamic-form", {
      state: {
        formData,
        generatedCode: true,
      },
    });
  };

  const hasGeneratedCode =
    generatedCode.repository ||
    generatedCode.controller ||
    generatedCode.route ||
    generatedCode.service ||
    generatedCode.model;

  return (
    <div className="code-generation-page-container">
      {/* Main Content - Full width without sidebar */}
      <div className="main-content-section">
        <CContainer fluid>
          {/* Simple Back Button */}
          <div className="mb-4">
            <CButton
              color="outline-secondary"
              onClick={() => navigate(-1)}
              className="back-button"
            >
              <i className="fa fa-arrow-left me-2"></i>
              Back
            </CButton>
          </div>

          {/* Simple Header */}
          <div className="text-center mb-4">
            <h2 className="text-primary">Generated Code</h2>
            {formData.pageName && (
              <CBadge color="primary" className="mt-2 fs-6">
                {formData.pageName}
              </CBadge>
            )}
          </div>

          {codeData === null ? (
            <CAlert color="danger" dismissible onClose={() => setError("")}>
              {error}
            </CAlert>
          ) : (
            <CAlert color="success" dismissible onClose={() => setSuccess("")}>
              {success}
            </CAlert>
          )}

          <CRow className="justify-content-center">
            {/* Code Type Selection Panel */}
            <CCol md={3}>
              <CCard className="code-type-card">
                <CCardHeader className="bg-primary text-white">
                  <h6 className="mb-0">Code Files</h6>
                </CCardHeader>
                <CCardBody className="code-type-buttons p-3">
                  {generatedCode.repository && (
                    <CButton
                      color={
                        activeCodeTab === "repository"
                          ? "primary"
                          : "outline-primary"
                      }
                      className="w-100 mb-2 text-start"
                      onClick={() => setActiveCodeTab("repository")}
                    >
                      <i className="fa fa-database me-2"></i>Repository
                    </CButton>
                  )}
                  {generatedCode.controller && (
                    <CButton
                      color={
                        activeCodeTab === "controller"
                          ? "primary"
                          : "outline-primary"
                      }
                      className="w-100 mb-2 text-start"
                      onClick={() => setActiveCodeTab("controller")}
                    >
                      <i className="fa fa-cogs me-2"></i>Controller
                    </CButton>
                  )}
                  {generatedCode.route && (
                    <CButton
                      color={
                        activeCodeTab === "route"
                          ? "primary"
                          : "outline-primary"
                      }
                      className="w-100 mb-2 text-start"
                      onClick={() => setActiveCodeTab("route")}
                    >
                      <i className="fa fa-route me-2"></i>Routes
                    </CButton>
                  )}
                  {generatedCode.model && (
                    <CButton
                      color={
                        activeCodeTab === "model"
                          ? "primary"
                          : "outline-primary"
                      }
                      className="w-100 mb-2 text-start"
                      onClick={() => setActiveCodeTab("model")}
                    >
                      <i className="fa fa-table me-2"></i>Model
                    </CButton>
                  )}
                  {generatedCode.service && (
                    <CButton
                      color={
                        activeCodeTab === "service"
                          ? "primary"
                          : "outline-primary"
                      }
                      className="w-100 mb-2 text-start"
                      onClick={() => setActiveCodeTab("service")}
                    >
                      <i className="fa fa-gears me-2"></i>Service
                    </CButton>
                  )}
                </CCardBody>
              </CCard>
            </CCol>

            {/* Code Display Panel */}
            <CCol md={9}>
              {hasGeneratedCode ? (
                <CCard className="code-display-card">
                  <CCardHeader className="bg-light d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 text-capitalize text-dark">
                      {activeCodeTab} Code
                    </h5>
                    <div>
                      <CButton
                        color="outline-primary"
                        size="sm"
                        onClick={copyToClipboard}
                        className="me-2"
                      >
                        <i className="fa fa-copy me-1"></i> Copy Code
                      </CButton>
                    </div>
                  </CCardHeader>
                  <CCardBody className="p-0">
                    <pre className="generated-code">
                      {generatedCode[activeCodeTab]}
                    </pre>

                    {/* Action Buttons */}
                    <div className="code-actions p-3">
                      <CButton
                        color="success"
                        onClick={downloadCode}
                        className="me-2"
                      >
                        <i className="fa fa-download me-1"></i>
                        Download{" "}
                        {activeCodeTab.charAt(0).toUpperCase() +
                          activeCodeTab.slice(1)}
                      </CButton>
                      <CButton color="primary" onClick={() => handleContinue()}>
                        <i className="fa fa-arrow-right me-1"></i>
                        Continue to Form Builder
                      </CButton>
                    </div>
                  </CCardBody>
                </CCard>
              ) : (
                <CCard className="text-center placeholder-card">
                  <CCardBody className="py-5">
                    <div className="placeholder-icon">
                      <i className="fa fa-code fa-3x text-muted mb-3"></i>
                    </div>
                    <h4 className="text-muted">No Code Generated</h4>
                    <p className="text-muted">
                      Please go back and generate code first.
                    </p>
                  </CCardBody>
                </CCard>
              )}
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </div>
  );
};

export default CodeGenerationPage;
