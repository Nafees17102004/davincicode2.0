const pool = require("../config/dbConfig");

const getProjectDetails=async(project_code)=>{
    try {
    const query = "CALL GetProjectDetails(?);";
    const data = [project_code];
    const result = await pool.query(query, data);
    return result;
  } catch (err) {
    console.error("err in repo", err);
    throw err; // rethrow so service/controller can handle
  }
}

const insertModule = async (project_id,m_name,m_desc,status,inactive_reason) => {
  try {
    const query = "CALL InsertModule(?,?,?,?,?)";
    const data = [project_id,m_name,m_desc,status,inactive_reason];
    const result = await pool.query(query, data);
    return result[0];
  } catch (err) {
    console.error("err in repo", err);
    throw err; // rethrow so service/controller can handle
  }
};

const insertSnippet=async(fieldTypeId,languageId,snippetName,snippet)=>{
  try{
  const query="Call InsertSnippet(?,?,?,?)";
  const data=[fieldTypeId,languageId,snippetName,snippet];
  const result= await pool.query(query,data);
  return result[0];
  }catch(err){
    console.error("Error in Repository.insertSnippet:",err);
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

// Add to module.exports:
module.exports = { insertModule,getProjectDetails ,insertSnippet,insertFormGen};
