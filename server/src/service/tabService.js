const tabRepository = require("../repository/tabRepository");

const tabService = {
  insertTab: async (
    tabId,
    projectId,
    pageId,
    tabName,
    tabImageId,
    createdUser
  ) => {
    try {
      const result = await tabRepository.insertTab(
        tabId,
        projectId,
        pageId,
        tabName,
        tabImageId,
        createdUser
      );
      return result;
    } catch (err) {
      console.error("Service Error (insertTab):", err.message);
      throw new Error(err.sqlMessage || err.message);
    }
  },
  getTabImg: async (tabId) => {
    try {
      const result = await tabRepository.getTabImg(tabId);
      return result;
    } catch (err) {
      console.error("Service Error (getTabImg):", err.message);
      throw new Error(err.sqlMessage || err.message);
    }
  },
};

module.exports = tabService;
