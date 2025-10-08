const pool = require("../config/dbConfig");

const logError = async (errName, errDescp, errSteps, cUser) => {
  try {
    const query = `
      INSERT INTO error_log (error_code, err_name, err_descp, err_steps, cDate, cUser)
      VALUES (UUID(), ?, ?, ?, NOW(), ?)
    `;
    await pool.query(query, [errName, errDescp, errSteps, cUser]);
  } catch (logErr) {
    console.error("Error logging failed:", logErr.message);
  }
};

module.exports = { logError };
