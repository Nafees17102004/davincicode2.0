// repositories/formGenRepository.js
const pool = require("../../../src/config/dbConfig");

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

    const response = result && result[0] && result[0][0] ? result[0][0] : null;
    if (!response) {
      return {
        success: false,
        message: "DB returned no response",
        formId: null,
      };
    }

    return {
      success: response.success === 1 || response.success === true,
      message: response.message,
      formId: response.insertedId || null,
    };
  },
  getFormGenById: async (formGenId) => {
    try {
      const query = "CALL LT_DCS_SP_GET_FORM_GENERATION_DETAILS(?)";
      const [result] = await pool.query(query, [formGenId]);
      const row = result && result[0] && result[0][0] ? result[0][0] : null;

      return { success: !!row, result: row };
    } catch (error) {
      console.error("Error in fetching the data in Repo: ", error);
      return { success: false, error: "Error in fetching the data in Repo" };
    }
  },
  getSnippetByFsm: async (fieldTypeId, languageId) => {
    try {
      const query = `SELECT cs.Snippet_ID,cs.Snippet_Name,cs.Snippet 
      FROM field_snippet_map fsm 
      JOIN code_snippet cs 
      ON fsm.SNIPPET_ID = cs.Snippet_ID 
      WHERE fsm.FIELD_TYPE_ID = ? AND fsm.LANGUAGE_ID = ?;`;
      const [code] = await pool.query(query, [fieldTypeId, languageId]);
      return code;
    } catch (error) {}
  },
  getLanguageIdByProjectId: async (projectId) => {
    try {
      const query = `SELECT language_id FROM projects WHERE id = ? LIMIT 1`;
      const [rows] = await pool.query(query, [projectId]);
      return rows.length ? rows[0].language_id : null;
    } catch (error) {
      console.error("Error fetching language_id using projectId:", error);
      return null;
    }
  },
};

module.exports = formGenRepository;
