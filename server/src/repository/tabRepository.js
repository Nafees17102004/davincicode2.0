const pool = require("../config/dbConfig");

const tabRepository = {
  insertTab: async (projectId, pageId, tabName, tabImageId, createdUser) => {
    try {
      const query = "CALL SP_INSERT_UPDATE_TAB_TABLE(?,?, ?, ?, ?, ?)";
      const [rows] = await pool.query(query, [
        tabId,
        projectId,
        pageId,
        tabName,
        tabImageId,
        createdUser,
      ]);
      const message = rows?.[0]?.[0]?.message;
      if (message.toLowerCase().includes("error")) {
        return {
          success: false,
          message: message,
        };
      }
      return {
        success: true,
        message: message,
      };
    } catch (err) {
      console.error(
        "Repository Error (insertTab):",
        err.message || err.sqlMessage
      );
      throw new Error(err.message || err.sqlMessage);
    }
  },
  getTabImg: async (tabId) => {
    try {
      const query = "CALL SP_GET_TAB_IMAGE(?)";
      const [rows] = await pool.query(query, [tabId]);
      return rows[0];
    } catch (err) {
      console.error(
        "Repository Error (GetTabImg):",
        err.message || err.sqlMessage
      );
      throw new Error(err.message || err.sqlMessage);
    }
  },
};

module.exports = tabRepository;
