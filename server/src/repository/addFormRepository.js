const pool = require("../config/dbConfig");

const insertFormDetails = async (
  tabId,
  fieldSourceId,
  FieldName,
  fieldSizeId,
  fieldIconId,
  placeholder,
  fieldOrderId,
  cUser
) => {
  try {
    const query = "CALL SP_INSERT_ADD_FORM_TABLE(?,?,?,?,?,?,?,?);";
    const [rows] = await pool.query(query, [
      tabId,
      fieldSourceId || null,
      FieldName,
      fieldSizeId || null,
      fieldIconId || null,
      placeholder || null,
      fieldOrderId || null,
      cUser,
    ]);

    // ✅ Your stored procedure should end with:
    // SELECT 1 AS success, 'Inserted successfully' AS message;

    const [result] = rows && rows[0] ? rows[0] : null;
    console.log(result);

    if (result && result.success !== undefined) {
      return {
        success: result.success,
        message: result.message,
      };
    } else {
      return {
        success: 0,
        message: "Unexpected response from stored procedure.",
      };
    }
  } catch (error) {
    console.error("Repo Error:", error.sqlMessage || error.message);
    return {
      success: 0,
      message: error.sqlMessage || "Database error occurred.",
    };
  }
};
const getLovDropdown = async (listName, lovName) => {
  try {
    const query = "CALL SP_BIND_DROPDOWN(?,?)";
    const [rows] = await pool.query(query, [listName, lovName]);
    return rows[0];
  } catch (error) {
    throw new error;
  }
};

module.exports = {
  insertFormDetails,
  getLovDropdown,
};
