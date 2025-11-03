// services/formGenService.js
const formGenRepository = require("./formGenRepository");

const formGenService = {
  saveFormGen: async (session, formData) => {
    try {
    } catch (error) {}
    const result = await formGenRepository.saveFormGen(formData);
    const { formId } = result;

    session.formId = formId;

    return { result };
  },
  getFormGenById: async (formId) => {
    try {
      if (!formId) return { success: false, error: "formId missing" };
      const formDetails = await formGenRepository.getFormGenById(formId);
      const jsonData = formDetails.result.FormJson;

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
