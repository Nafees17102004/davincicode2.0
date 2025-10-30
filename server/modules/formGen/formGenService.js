// services/formGenService.js
const formGenRepository = require("../formGen/formGenRepository");

const formGenService = {
  saveFormGen: async (formData) => {
    return await formGenRepository.saveFormGen(formData);
  },
};

module.exports = formGenService;
