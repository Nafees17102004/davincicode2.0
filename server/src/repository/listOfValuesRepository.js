const pool = require("../config/dbConfig");

const insertLov = async (
  lovName,
  lovDescp,
  lovStatus,
  inactiveReason,
  createdUser
) => {
  try {
    // Run the stored procedure
    const callQuery = `CALL SP_INSERT_LIST_OF_VALUES(?,?,?,?,?, @msg, @new_id);`;
    await pool.query(callQuery, [
      lovName,
      lovDescp,
      lovStatus,
      inactiveReason,
      createdUser,
    ]);

    // Fetch OUT parameters
    const [rows] = await pool.query(
      `SELECT @msg AS resultMsg, @new_id AS newId;`
    );
    const output = rows[0];
    console.log(output);

    // Check if SP message indicates an error
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
  } catch (error) {
    console.error("Repository Error:", error);

    // ✅ Handle duplicate entry (SQLSTATE 23000, MySQL error 1062)
    if (error.sqlState === "23000" && error.code === "ER_DUP_ENTRY") {
      // Extract the duplicate value (e.g., 'Shops')
      const valueMatch = error.sqlMessage.match(/Duplicate entry '([^']+)'/i);
      const duplicateValue = valueMatch ? valueMatch[1] : "unknown value";

      return {
        success: false,
        message: `Duplicate entry '${duplicateValue}' already exists.`,
        duplicateValue,
      };
    }

    // ✅ Handle all other SQL or runtime errors
    return {
      success: false,
      message: error.sqlMessage || "Unknown database error occurred",
      error,
    };
  }
};

const getLov = async () => {
  try {
    const query = ""
  } catch (error) {
    
  }
}

module.exports = {
  insertLov,
};
