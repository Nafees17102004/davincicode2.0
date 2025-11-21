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
  getSnippetsByElementAndLanguage: async (
    fieldTypeId, // Field Type Id from the form Gen Payload
    elementTypeId, // Element Type Id from default id value
    languageId // Language Id from getLanguageIdByProjectId using projectId
  ) => {
    // React code snippet query
    const reactQuery = `
    SELECT
        ft.FIELD_NAME AS component_name,
        cs.Snippet AS component_code
    FROM dcs_l_element_field_lang_snippet_map map
    JOIN code_snippet cs 
        ON cs.Snippet_ID = map.snippet_id
    JOIN field_type ft
        ON ft.FIELD_TYPE_ID = map.field_type_id
    WHERE map.field_type_id = ?
    LIMIT 1;
    `;

    // Params required for react code snippet
    const reactParams = [fieldTypeId];

    // Obtaining the react code snippet from the DB
    const [reactRows] = await pool.query(reactQuery, reactParams);

    // Node code snippet query
    const nodeQuery = `
    SELECT 
        ft.FIELD_NAME AS layer_name,
        cs.Snippet AS snippet
    FROM dcs_l_element_field_lang_snippet_map map
    JOIN code_snippet cs 
        ON cs.Snippet_ID = map.snippet_id
    JOIN field_type ft
        ON ft.FIELD_TYPE_ID = map.field_type_id
    WHERE map.element_type_id = ?
      AND map.language_id = ?
      AND map.c2c_status = 1
    ORDER BY ft.FIELD_NAME;
  `;

    // Params required for node code snippet
    const nodeParams = [elementTypeId, languageId];

    // Obtaining the node code snippet from the DB
    const [nodeRows] = await pool.query(nodeQuery, nodeParams);

    // Return the obtained code
    return {
      component: reactRows.length ? reactRows[0] : null,
      node_layers_raw: nodeRows,
    };
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
