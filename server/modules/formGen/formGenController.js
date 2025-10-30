// controllers/formGenController.js
const formGenService = require("../formGen/formGenService");

const formGenController = {
  saveFormGen: async (req, res) => {
    try {
      const response = await formGenService.saveFormGen(req.body);
      return res.status(response.success ? 200 : 400).json(response);
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
};

module.exports = formGenController;
