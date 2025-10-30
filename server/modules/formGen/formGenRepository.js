// repositories/formGenRepository.js
const pool = require("../../src/config/dbConfig");

const formGenRepository = {
  saveFormGen: async (data) => {
    const {
      ProjectID,
      ProductID,
      LayoutID,
      ModuleID,
      PageName,
      Purpose,
      Tabs,
      CreatedBy,
      Status,
      InactiveReason,
    } = data;

    const query =
      "CALL LT_DCS_SP_SAVE_FORM_GENERATION_DETAILS(?,?,?,?,?,?,?,?,?,?)";

    const [result] = await pool.query(query, [
      ProjectID,
      ProductID,
      LayoutID,
      ModuleID,
      PageName,
      Purpose,
      JSON.stringify(Tabs),
      CreatedBy,
      Status,
      InactiveReason,
    ]);

    const response = result[0][0];
    console.log(response);

    return {
      success: response.success === 1 || response.success === true,
      message: response.message,
      form_id: response.form_id || null,
    };
  },
};

module.exports = formGenRepository;
