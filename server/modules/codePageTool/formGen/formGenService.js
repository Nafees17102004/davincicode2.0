const fs = require("fs");
const handleBarJs = require("handlebars");
const path = require("path");

// services/formGenService.js
const formGenRepository = require("./formGenRepository");

// Form Gen Utils
const formGenUtils = require("../../../src/utils/codeGenUtils");

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

      handleBarJs.registerHelper("pascalCase", function (str) {
        if (!str) return "";
        return str
          .toString()
          .replace(/[-_\s]+(.)?/g, (match, chr) =>
            chr ? chr.toUpperCase() : ""
          )
          .replace(/^(.)/, (chr) => chr.toUpperCase());
      });

      handleBarJs.registerHelper("camelCase", function (str) {
        if (!str) return "";
        return str
          .toString()
          .replace(/[-_\s]+(.)?/g, (match, chr) =>
            chr ? chr.toUpperCase() : ""
          )
          .replace(/^(.)/, (chr) => chr.toLowerCase());
      });

      // Handlebars expects raw "result", not service wrapper
      const payload = data.result;

      for (const tab of payload.Tabs) {
        for (const section of tab.Sections) {
          for (const field of section.Fields) {
            if (
              field.spName &&
              field.spName !== "null" &&
              field.spName.trim() !== ""
            ) {
              field.spParams = await formGenUtils.getSpParams(field.spName);
              
            } else {
              field.spParams = [];
            }
          }
        }
      }

      for (const tab of payload.Tabs) {
        for (const section of tab.Sections) {
          for (const field of section.Fields) {
            // console.log(field);
          }
        }
      }

      // Generate component code
      const output = template(payload);

      const outputPath = path.join(__dirname, "GeneratedForm.js");
      fs.writeFileSync(outputPath, output);

      console.log("✅ React Form Generated →", outputPath);

      return output; // Let controller respond with download or view later
    } catch (error) {
      console.error("❌ Code Generation Failed:", error);
      throw error;
    }
  },
};

module.exports = formGenService;
