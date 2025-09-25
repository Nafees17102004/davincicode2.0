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

const insertModule = async (project_id, name, status, inactive_reason) => {
  try {
    const query = "CALL InsertModule(?,?,?,?)";
    const data = [project_id, name, status, inactive_reason];
    const result = await pool.query(query, data);
    return result[0];
  } catch (err) {
    console.error("err in repo", err);
    throw err; // rethrow so service/controller can handle
  }
};

module.exports = { insertModule,getProjectDetails };
