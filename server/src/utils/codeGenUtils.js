const pool = require("../config/dbConfig");

const codeGenUtils = {
  getSpParams: async (spName) => {
    try {
      const query = `SELECT PARAMETER_NAME, DATA_TYPE
    FROM INFORMATION_SCHEMA.PARAMETERS
    WHERE SPECIFIC_NAME = ?
    ORDER BY ORDINAL_POSITION;`;
      const [rows] = await pool.query(query, [spName]);
      return rows.map((eachRow) => ({
        name: eachRow.PARAMETER_NAME,
        type: eachRow.DATA_TYPE,
      }));
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = codeGenUtils;
