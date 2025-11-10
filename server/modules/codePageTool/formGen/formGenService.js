const fs = require("fs");
const handleBarJs = require("handlebars");
const path = require("path");

// services/formGenService.js
const formGenRepository = require("./formGenRepository");

const formGenService = {
  saveFormGen: async (session, formData) => {
    try {
    } catch (error) {}
    const result = await formGenRepository.saveFormGen(formData);

    return {
      success: result.success,
      message: result.message,
      formId: result.formId || null,
    };
  },
  getFormGenById: async (formId) => {
    try {
      if (!formId) return { success: false, error: "formId missing" };
      const formDetails = await formGenRepository.getFormGenById(formId);
      // only set session if save succeeded and we have a formId
      if (!formDetails || !formDetails.result) {
        return { success: false, error: "Form not found" };
      }
      const jsonData = formDetails.result.FormJson;
      if (typeof jsonData === "string") {
        try {
          jsonData = JSON.parse(jsonData);
        } catch (err) {
          console.warn("FormJson parse warning:", err);
          // if parse fails, return raw
        }
      }

      if (!jsonData) return { success: false, error: "Form JSON missing" };

      const transformData = (jsonData) => {
        return {
          ...jsonData,
          Tabs: jsonData.Tabs.map((tab, tabIndex) => ({
            tabIndex: tabIndex,
            ...tab,
            Sections: tab.Sections.map((section, sectionIndex) => ({
              sectionIndex: sectionIndex,
              ...section,
              Fields: section.Fields.map((field, fieldIndex) => ({
                fieldIndex: fieldIndex,
                ...field,
              })),
            })),
          })),
        };
      };
      const finalFormDetails = transformData(jsonData);

      return { success: true, result: finalFormDetails };
    } catch (error) {
      console.error("Error in Service Layer: ", error);
      return { success: false, error: "Error in Service Layer" };
    }
  },
  generateCode: async (data) => {
    try {
      const templatePath = path.join(__dirname, "formTemplate.hbs");

      // Read file, not just reference its path
      const templateContent = fs.readFileSync(templatePath, "utf-8");

      // Compile properly
      const template = handleBarJs.compile(templateContent);

      // Handlebars expects raw "result", not service wrapper
      const payload = data.result;
      console.log(data.result);

      // Generate component code
      const output = template(payload);
      console.log(output);

      const outputPath = path.join(__dirname, "GeneratedForm.jsx");
      fs.writeFileSync(outputPath, output);

      console.log("✅ React Form Generated →", outputPath);

      return outputPath; // Let controller respond with download or view later
    } catch (error) {
      console.error("❌ Code Generation Failed:", error);
      throw error;
    }
  },
};

module.exports = formGenService;
