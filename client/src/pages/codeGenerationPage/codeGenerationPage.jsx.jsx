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
  CFormSelect,
  CBadge,
} from "@coreui/react";
import { useNavigate, useLocation } from "react-router-dom";
import projectAPI from "../../api/Api";
import LeftTabMenu from "../../components/LeftTabMenu/LeftTabMenu";
import "./CodeGenerationPage.css";

const CodeGenerationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [projects, setProjects] = useState([]);
  const [modules, setModules] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const [formData, setFormData] = useState({
    projectId: "",
    moduleId: "",
    languageId: "",
    pageName: "",
    purpose: "",
  });

  const [generatedCode, setGeneratedCode] = useState({
    repository: "",
    controller: "",
    route: "",
    model: "",
  });

  const [activeCodeTab, setActiveCodeTab] = useState("repository");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();

    // Check if we have form data from navigation
    if (location.state?.formData) {
      setFormData(location.state.formData);
    }
  }, [location]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      // Fetch projects
      const projectsResponse = await projectAPI.viewProjects();
      if (projectsResponse.data) {
        setProjects(projectsResponse.data || []);
      }

      // Fetch languages
      const languagesResponse = await projectAPI.getLangauge();
      if (languagesResponse.data) {
        setLanguages(languagesResponse.data || []);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
      setError("Failed to load initial data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch modules when project is selected
  useEffect(() => {
    if (formData.projectId) {
      fetchModules(formData.projectId);
    } else {
      setModules([]);
      setFormData((prev) => ({ ...prev, moduleId: "" }));
    }
  }, [formData.projectId]);

  const fetchModules = async (projectCode) => {
    try {
      const response = await projectAPI.getProjectByCode(projectCode);
      if (response.data && response.data.success) {
        setModules(response.data.result.modules || []);
      }
    } catch (error) {
      console.error("Error fetching modules:", error);
      setError("Failed to load modules");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user makes changes
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleLanguageSelect = (languageId) => {
    setSelectedLanguage(languageId);
    setFormData((prev) => ({ ...prev, languageId }));
  };

  const validateForm = () => {
    if (!formData.projectId) {
      setError("Please select a project");
      return false;
    }
    if (!formData.moduleId) {
      setError("Please select a module");
      return false;
    }
    if (!formData.languageId) {
      setError("Please select a language");
      return false;
    }
    if (!formData.pageName.trim()) {
      setError("Please enter a page name");
      return false;
    }
    return true;
  };

  const generateCode = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Mock code generation - replace with actual API call
      const mockGeneratedCode = {
        repository: `// ${formData.pageName}Repository.js
const pool = require('../config/database');

class ${formData.pageName}Repository {
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

module.exports = ${formData.pageName}Repository;`,

        controller: `// ${formData.pageName}Controller.js
const ${formData.pageName}Service = require('../services/${
          formData.pageName
        }Service');

class ${formData.pageName}Controller {
  static async getAll(req, res) {
    try {
      const data = await ${formData.pageName}Service.getAll();
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
      const data = await ${formData.pageName}Service.getById(id);
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
      const newItem = await ${formData.pageName}Service.create(req.body);
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
      const updated = await ${formData.pageName}Service.update(id, req.body);
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
      const deleted = await ${formData.pageName}Service.delete(id);
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

module.exports = ${formData.pageName}Controller;`,

        route: `// ${formData.pageName}Routes.js
const express = require('express');
const router = express.Router();
const ${formData.pageName}Controller = require('../controllers/${
          formData.pageName
        }Controller');

// @route   GET /api/${formData.pageName.toLowerCase()}
// @desc    Get all ${formData.pageName.toLowerCase()}
// @access  Public
router.get('/', ${formData.pageName}Controller.getAll);

// @route   GET /api/${formData.pageName.toLowerCase()}/:id
// @desc    Get ${formData.pageName.toLowerCase()} by ID
// @access  Public
router.get('/:id', ${formData.pageName}Controller.getById);

// @route   POST /api/${formData.pageName.toLowerCase()}
// @desc    Create new ${formData.pageName.toLowerCase()}
// @access  Public
router.post('/', ${formData.pageName}Controller.create);

// @route   PUT /api/${formData.pageName.toLowerCase()}/:id
// @desc    Update ${formData.pageName.toLowerCase()}
// @access  Public
router.put('/:id', ${formData.pageName}Controller.update);

// @route   DELETE /api/${formData.pageName.toLowerCase()}/:id
// @desc    Delete ${formData.pageName.toLowerCase()}
// @access  Public
router.delete('/:id', ${formData.pageName}Controller.delete);

module.exports = router;`,

        model: `// ${formData.pageName}Model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ${formData.pageName} = sequelize.define('${formData.pageName}', {
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

module.exports = ${formData.pageName};`,
      };

      setGeneratedCode(mockGeneratedCode);
      setSuccess("Code generated successfully!");
    } catch (error) {
      console.error("Error generating code:", error);
      setError(error.response?.data?.message || "Failed to generate code");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const codeToCopy = generatedCode[activeCodeTab];
    navigator.clipboard.writeText(codeToCopy).then(() => {
      // Show temporary success message
      const originalSuccess = success;
      setSuccess("Code copied to clipboard!");
      setTimeout(() => setSuccess(originalSuccess), 2000);
    });
  };

  const downloadCode = () => {
    if (!generatedCode[activeCodeTab]) return;

    const element = document.createElement("a");
    const file = new Blob([generatedCode[activeCodeTab]], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `${formData.pageName}${
      activeCodeTab.charAt(0).toUpperCase() + activeCodeTab.slice(1)
    }.js`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleContinue = () => {
    // Navigate back to form preview with current form data
    navigate("/dynamic-form", {
      state: {
        formData,
        generatedCode: true,
      },
    });
  };

  const getSelectedLanguageName = () => {
    const lang = languages.find((l) => l.id == selectedLanguage);
    return lang ? lang.name : "Not selected";
  };

  return (
    <div className="code-generation-page-container">
      {/* Sidebar */}
      <div className="sidebar-section">
        <LeftTabMenu />
      </div>

      {/* Main Content */}
      <div className="main-content-section">
        <CContainer fluid className="code-generation-page">
          <CRow>
            <CCol>
              <div className="page-header">
                <h2>Code Generation</h2>
                <div className="language-display">
                  <CBadge color="primary">
                    Selected Language: {getSelectedLanguageName()}
                  </CBadge>
                </div>
              </div>

              {error && (
                <CAlert color="danger" dismissible onClose={() => setError("")}>
                  {error}
                </CAlert>
              )}

              {success && (
                <CAlert
                  color="success"
                  dismissible
                  onClose={() => setSuccess("")}
                >
                  {success}
                </CAlert>
              )}

              <CRow>
                {/* Configuration Panel */}
                <CCol md={4}>
                  <CCard className="config-card">
                    <CCardHeader>
                      <h5 className="mb-0">Configuration</h5>
                    </CCardHeader>
                    <CCardBody>
                      <div className="form-section">
                        <div className="mb-3">
                          <label className="form-label">Select Project</label>
                          <CFormSelect
                            name="projectId"
                            value={formData.projectId}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Choose Project...</option>
                            {projects.map((project) => (
                              <option
                                key={project.project_code}
                                value={project.project_code}
                              >
                                {project.project_name} ({project.project_code})
                              </option>
                            ))}
                          </CFormSelect>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Select Module</label>
                          <CFormSelect
                            name="moduleId"
                            value={formData.moduleId}
                            onChange={handleInputChange}
                            disabled={!formData.projectId}
                            required
                          >
                            <option value="">Choose Module...</option>
                            {modules.map((module) => (
                              <option
                                key={module.module_id}
                                value={module.module_id}
                              >
                                {module.module_name}
                              </option>
                            ))}
                          </CFormSelect>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Select Language</label>
                          <CFormSelect
                            name="languageId"
                            value={formData.languageId}
                            onChange={(e) =>
                              handleLanguageSelect(e.target.value)
                            }
                            required
                          >
                            <option value="">Choose Language...</option>
                            {languages.map((language) => (
                              <option key={language.id} value={language.id}>
                                {language.name}
                              </option>
                            ))}
                          </CFormSelect>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Page Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="pageName"
                            value={formData.pageName}
                            onChange={handleInputChange}
                            placeholder="Enter page name"
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">
                            Purpose (Optional)
                          </label>
                          <textarea
                            className="form-control"
                            name="purpose"
                            value={formData.purpose}
                            onChange={handleInputChange}
                            placeholder="Enter purpose of this form"
                            rows="3"
                          />
                        </div>

                        <CButton
                          color="primary"
                          onClick={generateCode}
                          disabled={loading}
                          className="w-100 generate-btn"
                        >
                          {loading ? <CSpinner size="sm" /> : "Generate Code"}
                        </CButton>
                      </div>
                    </CCardBody>
                  </CCard>

                  {/* Code Type Selection */}
                  {generatedCode.repository && (
                    <CCard className="mt-3 code-type-card">
                      <CCardHeader>
                        <h6 className="mb-0">Generated Files</h6>
                      </CCardHeader>
                      <CCardBody className="code-type-buttons">
                        <CButton
                          color={
                            activeCodeTab === "repository"
                              ? "primary"
                              : "secondary"
                          }
                          className="w-100 mb-2"
                          onClick={() => setActiveCodeTab("repository")}
                        >
                          Repository
                        </CButton>
                        <CButton
                          color={
                            activeCodeTab === "controller"
                              ? "primary"
                              : "secondary"
                          }
                          className="w-100 mb-2"
                          onClick={() => setActiveCodeTab("controller")}
                        >
                          Controller
                        </CButton>
                        <CButton
                          color={
                            activeCodeTab === "route" ? "primary" : "secondary"
                          }
                          className="w-100 mb-2"
                          onClick={() => setActiveCodeTab("route")}
                        >
                          Routes
                        </CButton>
                        <CButton
                          color={
                            activeCodeTab === "model" ? "primary" : "secondary"
                          }
                          className="w-100"
                          onClick={() => setActiveCodeTab("model")}
                        >
                          Model
                        </CButton>
                      </CCardBody>
                    </CCard>
                  )}
                </CCol>

                {/* Code Display Panel */}
                <CCol md={8}>
                  {generatedCode.repository ? (
                    <CCard className="code-display-card">
                      <CCardHeader className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0 text-capitalize">
                          {activeCodeTab} Code
                        </h5>
                        <CButton
                          color="outline-primary"
                          size="sm"
                          onClick={copyToClipboard}
                        >
                          Copy Code
                        </CButton>
                      </CCardHeader>
                      <CCardBody>
                        <pre className="generated-code">
                          {generatedCode[activeCodeTab]}
                        </pre>

                        {/* Action Buttons */}
                        <div className="code-actions mt-3">
                          <CButton
                            color="success"
                            onClick={downloadCode}
                            className="me-2"
                          >
                            Download{" "}
                            {activeCodeTab.charAt(0).toUpperCase() +
                              activeCodeTab.slice(1)}
                          </CButton>
                          <CButton color="primary" onClick={handleContinue}>
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
                        <h4 className="text-muted">No Code Generated Yet</h4>
                        <p className="text-muted">
                          Configure your settings and click "Generate Code" to
                          see the generated code here.
                        </p>
                      </CCardBody>
                    </CCard>
                  )}
                </CCol>
              </CRow>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </div>
  );
};

export default CodeGenerationPage;
