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
};

module.exports = formGenService;
