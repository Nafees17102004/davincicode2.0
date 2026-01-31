const pool = require("../config/dbConfig");

const insertProject = async (
  pCode,
  pName,
  pLanguageId,
  pStatus,
  pInactiveReason,
) => {
  try {
    const query = "CALL InsertProject(?,?,?,?,?);";
    const result = await pool.query(query, [
      pCode,
      pName,
      pLanguageId,
      pStatus,
      pInactiveReason,
    ]);
    return result[0];
  } catch (err) {
    console.error("Error: ", err);
  }
};

const viewProjectDetails = async () => {
  try {
    const query = "CALL GetAllProjects();";
    const result = await pool.query(query);
    return result[0][0];
  } catch (err) {
    console.error("Error: ", err);
  }
};

const insertLanguage = async (lName, lStatus, lInactiveReason) => {
  try {
    const query = "CALL insertLanguage(?,?,?);";
    const result = pool.query(query, [lName, lStatus, lInactiveReason]);
    return result[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getLanguage = async () => {
  try {
    const query = "CALL GetLanguage()";
    const [result] = await pool.query(query);
    return result[0];
  } catch (err) {
    console.error("Error: ", err);
  }
};

const getFieldTypes = async () => {
  try {
    const query = "CALL GetFieldTypes()";
    const [result] = await pool.query(query);
    return result[0];
  } catch (err) {
    console.error("Error: ", err);
  }
};

const insertFieldTypes = async (
  fieldTypeId,
  elementTypeId,
  fieldName,
  fStatus,
  fInactiveReason,
  cUser,
) => {
  try {
    const query = "CALL LT_DCS_SP_INSERT_UPDATE_FIELD_TYPE(?,?,?,?,?,?)";

    const result = await pool.query(query, [
      fieldTypeId,
      elementTypeId,
      fieldName,
      fStatus,
      fInactiveReason,
      cUser,
    ]);
    return result[0];
  } catch (err) {
    console.error("Repo Error: ", err);
  }
};

const getSnippetById = async (s_id) => {
  try {
    const query = "CALL GetSnippetById(?)";
    const [result] = await pool.query(query, [s_id]);
    return result[0];
  } catch (err) {
    console.err("Error:", err);
  }
};

module.exports = {
  insertProject,
  viewProjectDetails,
  insertLanguage,
  getLanguage,
  getFieldTypes,
  getSnippetById,
  insertFieldTypes,
};
