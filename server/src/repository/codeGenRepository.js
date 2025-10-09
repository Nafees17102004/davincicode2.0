const pool = require("../config/dbConfig");

const getProjectDetails = async (project_code) => {
  try {
    const query = "CALL GetProjectDetails(?);";
    const data = [project_code];
    const result = await pool.query(query, data);
    return result;
  } catch (err) {
    console.error("err in repo", err);
    throw err; // rethrow so service/controller can handle
  }
};

const insertModule = async (
  project_id,
  m_name,
  m_desc,
  status,
  inactive_reason
) => {
  try {
    const query = "CALL InsertModule(?,?,?,?,?)";
    const data = [project_id, m_name, m_desc, status, inactive_reason];
    const result = await pool.query(query, data);
    return result[0];
  } catch (err) {
    console.error("err in repo", err);
    throw err; // rethrow so service/controller can handle
  }
};

const insertSnippet = async (fieldTypeId, languageId, snippetName, snippet) => {
  try {
    const query = "Call InsertSnippet(?,?,?,?)";
    const data = [fieldTypeId, languageId, snippetName, snippet];
    const result = await pool.query(query, data);
    return result[0];
  } catch (err) {
    console.error("Error in Repository.insertSnippet:", err);
    throw err;
  }
};

// Add after existing exports and functions:
const insertFormGen = async (formName, formConfig) => {
  try {
    const query = "CALL InsertFormGen(?, ?)";
    const data = [formName, JSON.stringify(formConfig)];
    const result = await pool.query(query, data);
    return result[0];
  } catch (err) {
    console.error("err in repo", err);
    throw err;
  }
};

const getListOfValuesDetails = async (lovId) => {
  try {
    const query = "CALL SP_GET_LIST_OF_VALUES_DETAILS(?)";

    const [result] = await pool.query(query, [lovId]);
    return result[0];
  } catch (err) {
    console.log("err in Repo", err);
  }
};

const insertListOfValuesDetails = async (
  lovId,
  lovDetName,
  lovDetDescp,
  lovDetStatus,
  inActiveReason,
  cUser
) => {
  try {
    const query =
      "CALL SP_INSERT_LIST_OF_VALUES_DETAILS(?,?,?,?,?,?, @p_RESULT_MSG, @p_NEW_ID)";
    await pool.query(query, [
      lovId,
      lovDetName,
      lovDetDescp,
      lovDetStatus,
      inActiveReason,
      cUser,
    ]);
    const [result] = await pool.query(
      "SELECT @p_RESULT_MSG as resultMsg, @p_NEW_ID as newId;"
    );
    const output = result[0];

    if (output.resultMsg && output.resultMsg.toLowerCase().includes("error")) {
      return {
        success: false,
        message: output.resultMsg,
      };
    }

    return {
      success: true,
      message: output.resultMsg,
      newId: output.newId,
    };
  } catch (err) {
    console.log("err in repo", err);
  }
};

const updateListOfValuesDetail = async (
  lovId,
  lovDetId,
  lovDetName,
  lovDetDescp,
  lovDetStatus,
  inActiveReason,
  uUser
) => {
  try {
    const query =
      "CALL SP_UPDATE_LIST_OF_VALUES_DETAILS(?,?,?,?,?,?,?,@p_RESULT_MSG);";
    await pool.query(query, [
      lovId,
      lovDetId,
      lovDetName,
      lovDetDescp,
      lovDetStatus,
      inActiveReason,
      uUser,
    ]);

    const [result] = await pool.query("SELECT @p_RESULT_MSG as resultMsg;");
    return result;
  } catch (err) {
    console.log("err in repo", err);
  }
};
// Add to module.exports:
module.exports = {
  insertModule,
  getProjectDetails,
  insertSnippet,
  insertFormGen,
  getListOfValuesDetails,
  insertListOfValuesDetails,
  updateListOfValuesDetail,
};
