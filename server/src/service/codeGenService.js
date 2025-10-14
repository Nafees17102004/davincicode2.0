// src/service/codeGenService.js
const repo = require("../repository/codeGenRepository");

const getProjectDetails = async (project_code) => {
  try {
    const [result] = await repo.getProjectDetails(project_code);
    const [project, module] = result;
    return { project, module };
  } catch (err) {
    console.error("err in service", err);
    throw err; // rethrow to controller
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
    return await repo.insertModule(
      project_id,
      m_name,
      m_desc,
      status,
      inactive_reason
    );
  } catch (err) {
    console.error("err in service", err);
    throw err; // rethrow to controller
  }
};

const insertSnippet = async (fieldTypeId, languageId, snippetName, snippet) => {
  try {
    const result = await repo.insertSnippet(
      fieldTypeId,
      languageId,
      snippetName,
      snippet
    );
    return result;
  } catch (err) {
    console.error("Error :", err);
    throw err;
  }
};

// Add after existing exports and functions:
const insertFormGen = async (formName, formConfig) => {
  try {
    return await repo.insertFormGen(formName, formConfig);
  } catch (err) {
    console.error("err in service", err);
    throw err;
  }
};

const getListOfValuesDetails = async (lovId) => {
  try {
    const result = await repo.getListOfValuesDetails(lovId);
    return result;
  } catch (err) {
    console.log("err in service", err);
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
    const result = await repo.insertListOfValuesDetails(
      lovId,
      lovDetName,
      lovDetDescp,
      lovDetStatus,
      inActiveReason,
      cUser
    );
    return result;
  } catch (err) {
    console.log("err in service", err);
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
    const result = await repo.updateListOfValuesDetail(
      lovId,
      lovDetId,
      lovDetName,
      lovDetDescp,
      lovDetStatus,
      inActiveReason,
      uUser
    );
    return result;
  } catch (err) {
    console.log("err in service", err);
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
