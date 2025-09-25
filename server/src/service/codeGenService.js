// src/service/codeGenService.js
const repo = require("../repository/codeGenRepository");

const getProjectDetails=async(project_code)=>{
    try {
    const [result]=await repo.getProjectDetails(project_code);
    return result[0,1];
  } catch (err) {
    console.error("err in service", err);
    throw err; // rethrow to controller
  }
}

const insertModule = async (project_id, name, status, inactive_reason) => {
  try {
    return await repo.insertModule(project_id, name, status, inactive_reason);
  } catch (err) {
    console.error("err in service", err);
    throw err; // rethrow to controller
  }
};



module.exports = { insertModule ,getProjectDetails};
