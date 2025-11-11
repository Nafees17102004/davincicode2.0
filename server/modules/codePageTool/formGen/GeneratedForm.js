const pool = require("../config/dbConfig.js");

      const insertDetails = async (
        p_COLUMN_ID, p_SECTION_ID, p_TAB_ID, p_FIELD_SOURCE_ID, p_FIELD_TYPE_ID, p_SP_NAME, p_SP_PARAM, p_TABLE_NAME, p_TABLE_COLUMNS, p_CUSTOM_NAME, p_FIELD_NAME, p_FIELD_SIZE_ID, p_FIELD_ICON_ID, p_PLACEHOLDER, p_FIELD_ORDER_ID, p_STORED_PROCEDURE, p_VALIDATION_IDS, p_FORM_EVENT_HANDLER_ID, p_CUSER
      ) => { try { const query = `CALL
      SP_INSERT_FORM_FIELD_WITH_VALIDATIONS(
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      );`; const params = [
        p_COLUMN_ID, p_SECTION_ID, p_TAB_ID, p_FIELD_SOURCE_ID, p_FIELD_TYPE_ID, p_SP_NAME, p_SP_PARAM, p_TABLE_NAME, p_TABLE_COLUMNS, p_CUSTOM_NAME, p_FIELD_NAME, p_FIELD_SIZE_ID, p_FIELD_ICON_ID, p_PLACEHOLDER, p_FIELD_ORDER_ID, p_STORED_PROCEDURE, p_VALIDATION_IDS, p_FORM_EVENT_HANDLER_ID, p_CUSER
      ]; const [rows] = await pool.query(query, params); return rows; } catch
      (error) { console.error("Repository Error ():", error); throw
      error; } };
      const insertRepoDemoDetails = async (
        p_Project_ID, p_Product_ID, p_Layout_ID, p_Module_ID, p_PageName, p_Purpose, p_TabStructure, p_EBMS_User, p_EBMS_Status, p_EBMS_Inactive_Reason
      ) => { try { const query = `CALL
      LT_DCS_SP_SAVE_FORM_GENERATION_DETAILS(
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      );`; const params = [
        p_Project_ID, p_Product_ID, p_Layout_ID, p_Module_ID, p_PageName, p_Purpose, p_TabStructure, p_EBMS_User, p_EBMS_Status, p_EBMS_Inactive_Reason
      ]; const [rows] = await pool.query(query, params); return rows; } catch
      (error) { console.error("Repository Error (repo demo):", error); throw
      error; } };

module.exports = {
      insertDetails,
      insertRepoDemoDetails,
};