// services/formGenService.js
const formGenRepository = require("../formGen/formGenRepository");

const formGenService = {
  saveFormGen: async (formData) => {
    const result = await formGenRepository.saveFormGen(formData);
    const { formId } = result;
    console.log(formId);
    // sessionStorage["formId"] = formId; // Storing formId in session
    // const formDetails = await formGenRepository.getFormGenById(formId);
    // console.log(formDetails);
    return { result };
  },
};

module.exports = formGenService;
