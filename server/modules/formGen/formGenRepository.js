// repositories/formGenRepository.js
const pool = require("../../src/config/dbConfig");

const formGenRepository = {
  saveFormGen: async (data) => {
    const {
      projectId,
      productId,
      layoutId,
      moduleId,
      pageName,
      purpose,
      tabs,
      createdBy,
      status,
      inactiveReason,
    } = data;

    const query =
      "CALL LT_DCS_SP_SAVE_FORM_GENERATION_DETAILS(?,?,?,?,?,?,?,?,?,?)";

    const [result] = await pool.query(query, [
      projectId,
      productId,
      layoutId,
      moduleId,
      pageName,
      purpose,
      JSON.stringify(tabs),
      createdBy,
      status,
      inactiveReason,
    ]);

    const response = result[0][0];
    console.log(response);

    return {
      success: response.success === 1 || response.success === true,
      message: response.message,
      insertedId: response.insertedId || null,
    };
  },
};

module.exports = formGenRepository;
