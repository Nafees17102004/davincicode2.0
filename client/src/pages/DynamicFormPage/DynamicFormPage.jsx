import React from "react";
import FormBuilder from "../../components/FormBuilder/FormBuilder";
import "./DynamicFormPage.css";

function DynamicFormPage() {
  return (
    <div className="dynamic-form-page container py-4">
      <h3 className="mb-3">FORM BUILDER</h3>
      <FormBuilder />
    </div>
  );
}

export default DynamicFormPage;
