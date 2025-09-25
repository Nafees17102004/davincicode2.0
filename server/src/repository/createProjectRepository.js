const pool = require('../config/dbConfig');

const insertProject = async (pCode, pName, pLanguageId, pStatus, pInactiveReason) => {
    try {
        const query = "CALL InsertProject(?,?,?,?,?);"
        const result = await pool.query(query, [pCode, pName, pLanguageId, pStatus, pInactiveReason]);
        return result;
    } catch(err){
        console.error("Error: ", err)
    }
}

module.exports = {
    insertProject
}