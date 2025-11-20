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

const CodeGenerationPage = ({ codeData, setShowGeneratedCode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  console.log("Received codeData:", codeData);
  console.log("Location state:", location.state);

  const [formData, setFormData] = useState({});
  const [generatedCode, setGeneratedCode] = useState({
    // Backend Code
    repository: "",
    controller: "",
    route: "",
    model: "",
    service: "",

    // Frontend Code
    reactComponent: "",
  });

  const [activeCodeTab, setActiveCodeTab] = useState("repository");
  const [activeSection, setActiveSection] = useState("backend");
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
    console.log("Processing received data:", data);

    // Check if data has the structure we see in console
    if (data.backendCode || data.frontendCode) {
      console.log(
        "Received code data with backendCode and frontendCode structure"
      );

      // Extract backend code from backendCode object
      const backendCode = data.backendCode || {};
      const frontendCode = data.frontendCode || "";

      // Map the received code to our state structure with formatting
      const mappedCode = {
        // Backend Code from backendCode object
        controller: formatCode(backendCode.Controller || "") || "",
        repository: formatCode(backendCode.Repository || "") || "",
        route: formatCode(backendCode.Route || "") || "",
        service: formatCode(backendCode.Service || "") || "",
        model: formatCode(backendCode.Model || "") || "",

        // Frontend Code - ONLY use the actual code from backend, NO fallback generation
        reactComponent: formatCode(frontendCode) || "",
      };

      console.log("Mapped code structure:", {
        backend: {
          controller: !!mappedCode.controller,
          repository: !!mappedCode.repository,
          route: !!mappedCode.route,
          service: !!mappedCode.service,
          model: !!mappedCode.model,
        },
        frontend: {
          reactComponent: !!mappedCode.reactComponent,
        },
      });

      setGeneratedCode(mappedCode);

      // Set active section based on what code is available
      if (
        mappedCode.controller ||
        mappedCode.repository ||
        mappedCode.route ||
        mappedCode.service
      ) {
        setActiveSection("backend");
        setActiveCodeTab("repository");
      } else if (mappedCode.reactComponent) {
        setActiveSection("frontend");
        setActiveCodeTab("reactComponent");
      }

      setSuccess("Generated code loaded successfully from backend!");

      // Set formData for display
      setFormData({
        pageName: data.pageName || "Generated Code",
        formName: data.formName || "Auto-generated Form",
      });
    }
    // If it's form data with pageName but no generated code yet
    else if (data.pageName) {
      setFormData(data);
      setError(
        "No generated code found in the response. Please check if code generation completed successfully."
      );
    }
    // If it's empty or invalid
    else {
      setError("Invalid code data received. Please regenerate the code.");
      console.log("Invalid data structure:", data);
    }
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
        }.txt`
      : `Generated${
          activeCodeTab.charAt(0).toUpperCase() + activeCodeTab.slice(1)
        }.txt`;

    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleContinue = () => {
    setShowGeneratedCode(false);
    // navigate("/form-preview", {
    //   state: {
    //     formData,
    //     generatedCode: true,
    //   },
    // });
  };

  // Check if we have any backend code
  const hasBackendCode =
    generatedCode.repository ||
    generatedCode.controller ||
    generatedCode.route ||
    generatedCode.service ||
    generatedCode.model;

  // Check if we have any frontend code
  const hasFrontendCode = generatedCode.reactComponent;

  const hasGeneratedCode = hasBackendCode || hasFrontendCode;

  // Backend tabs configuration
  const backendTabs = [
    {
      key: "repository",
      label: "Repository",
      icon: "fa-database",
      available: !!generatedCode.repository,
    },
    {
      key: "controller",
      label: "Controller",
      icon: "fa-cogs",
      available: !!generatedCode.controller,
    },
    {
      key: "route",
      label: "Routes",
      icon: "fa-route",
      available: !!generatedCode.route,
    },
    {
      key: "model",
      label: "Model",
      icon: "fa-table",
      available: !!generatedCode.model,
    },
    {
      key: "service",
      label: "Service",
      icon: "fa-gears",
      available: !!generatedCode.service,
    },
  ];

  // Frontend tabs configuration - Only show React Component
  const frontendTabs = [
    {
      key: "reactComponent",
      label: "React Component",
      icon: "fa-code",
      available: !!generatedCode.reactComponent,
    },
  ];

  return (
    <div className="code-generation-page-container">
      <div className="main-content-section">
        <CContainer fluid>
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

          <div className="text-center mb-4">
            <h2 className="text-primary">Generated Code</h2>
            {formData.pageName && (
              <CBadge color="primary" className="mt-2 fs-6">
                {formData.pageName}
              </CBadge>
            )}
            <p className="text-muted mt-2">Showing actual code from database</p>
          </div>

          {error && (
            <CAlert color="danger" dismissible onClose={() => setError("")}>
              {error}
            </CAlert>
          )}

          {success && (
            <CAlert color="success" dismissible onClose={() => setSuccess("")}>
              {success}
            </CAlert>
          )}

          <div className="section-toggle mb-4 text-center">
            <CButton
              color={
                activeSection === "backend" ? "primary" : "outline-primary"
              }
              className="me-2"
              onClick={() => {
                setActiveSection("backend");
                const firstAvailable = backendTabs.find((tab) => tab.available);
                if (firstAvailable) {
                  setActiveCodeTab(firstAvailable.key);
                }
              }}
              disabled={!hasBackendCode}
            >
              <i className="fa fa-server me-2"></i>
              Backend Code{" "}
              {hasBackendCode &&
                `(${backendTabs.filter((tab) => tab.available).length})`}
            </CButton>
            <CButton
              color={
                activeSection === "frontend" ? "primary" : "outline-primary"
              }
              onClick={() => {
                setActiveSection("frontend");
                const firstAvailable = frontendTabs.find(
                  (tab) => tab.available
                );
                if (firstAvailable) {
                  setActiveCodeTab(firstAvailable.key);
                }
              }}
              disabled={!hasFrontendCode}
            >
              <i className="fa fa-desktop me-2"></i>
              Frontend Code{" "}
              {hasFrontendCode &&
                `(${frontendTabs.filter((tab) => tab.available).length})`}
            </CButton>
          </div>

          <CRow className="justify-content-center">
            <CCol md={3}>
              <CCard className="code-type-card">
                <CCardHeader className="bg-primary text-white">
                  <h6 className="mb-0">
                    {activeSection === "backend"
                      ? "Backend Files"
                      : "Frontend Files"}
                  </h6>
                </CCardHeader>
                <CCardBody className="code-type-buttons p-3">
                  {activeSection === "backend"
                    ? backendTabs.map(
                        (tab) =>
                          tab.available && (
                            <CButton
                              key={tab.key}
                              color={
                                activeCodeTab === tab.key
                                  ? "primary"
                                  : "outline-primary"
                              }
                              className="w-100 mb-2 text-start"
                              onClick={() => setActiveCodeTab(tab.key)}
                            >
                              <i className={`fa ${tab.icon} me-2`}></i>
                              {tab.label}
                            </CButton>
                          )
                      )
                    : frontendTabs.map(
                        (tab) =>
                          tab.available && (
                            <CButton
                              key={tab.key}
                              color={
                                activeCodeTab === tab.key
                                  ? "primary"
                                  : "outline-primary"
                              }
                              className="w-100 mb-2 text-start"
                              onClick={() => setActiveCodeTab(tab.key)}
                            >
                              <i className={`fa ${tab.icon} me-2`}></i>
                              {tab.label}
                            </CButton>
                          )
                      )}

                  {activeSection === "backend" && !hasBackendCode && (
                    <p className="text-muted text-center mt-3">
                      No backend code available
                    </p>
                  )}
                  {activeSection === "frontend" && !hasFrontendCode && (
                    <p className="text-muted text-center mt-3">
                      No frontend code available
                    </p>
                  )}
                </CCardBody>
              </CCard>
            </CCol>

            <CCol md={9}>
              {hasGeneratedCode ? (
                <CCard className="code-display-card">
                  <CCardHeader className="bg-light d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 text-capitalize text-dark">
                      {activeCodeTab.replace(/([A-Z])/g, " $1")} Code
                      <CBadge color="success" className="ms-2">
                        From Database
                      </CBadge>
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
                      {generatedCode[activeCodeTab] ||
                        "No code content available for this file."}
                    </pre>

                    <div className="code-actions p-3">
                      <CButton
                        color="success"
                        onClick={downloadCode}
                        className="me-2"
                        disabled={!generatedCode[activeCodeTab]}
                      >
                        <i className="fa fa-download me-1"></i>
                        Download{" "}
                        {activeCodeTab.charAt(0).toUpperCase() +
                          activeCodeTab.slice(1)}
                      </CButton>
                      <CButton color="primary" onClick={handleContinue}>
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
                    <CButton
                      color="secondary"
                      onClick={() => navigate(-1)}
                      className="mt-3"
                    >
                      <i className="fa fa-arrow-left me-1"></i>
                      Go Back
                    </CButton>
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
