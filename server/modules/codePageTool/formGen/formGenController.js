// controllers/formGenController.js
const formGenService = require("../formGen/formGenService");

const formGenController = {
  saveFormGen: async (req, res) => {
    try {
      const formData = req.body;
      const response = await formGenService.saveFormGen(req.session, formData);

      console.log("Form ID from sessionID: ", req.session.formId);
      return res.status(response.success ? 200 : 400).json(response);
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
  getFormGenById: async (req, res) => {
    try {
      const formId = req.session.formId || req.query.formId;

      const result = await formGenService.getFormGenById(formId);

      res.status(result.success ? 200 : 400).json(result);
    } catch (err) {
      console.error("Error: ", err);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
};

module.exports = formGenController;
