const tabService = require("../service/tabService");

const tabController = {
  insertTab: async (req, res) => {
    try {
      const tabs = Array.isArray(req.body) ? req.body : [req.body];
      const results = [];
      const errors = [];

      for (const [index, tab] of tabs.entries()) {
        const { tabId, projectId, pageId, tabName, tabImageId, createdUser } =
          tab;

        if (!projectId || !pageId || !tabName || !createdUser) {
          errors.push({
            index,
            err: "All fields are required",
            tab: tab,
          });
          continue;
        }
        try {
          const result = await tabService.insertTab(
            tabId,
            projectId,
            pageId,
            tabName,
            tabImageId,
            createdUser
          );
          if (!result.success) {
            errors.push({
              index,
              err: result.message,
              tab: tab,
            });
            continue;
          }
          results.push({ ...tab, dbresult: result });
        } catch (err) {
          errors.push({ index, err: err.message, tab: tab });
        }
      }
      res.status(errors.length ? 207 : 201).json({
        sucess: errors.length === 0,
        message:
          errors.length === 0
            ? "All Tabs inserted successfully"
            : "Partial success — some inserts failed",
        summary: {
          total: tabs.length,
          inserted: results.length,
          failed: errors.length,
        },
        addedTab: results,
        failedTab: errors,
      });
    } catch (err) {
      console.log("err in controller", err);
      res.status(500).json({
        success: false,
        message: "Server error occurred during Tabs insertion",
        error: err.message || "Failed to insert tab.",
      });
    }
  },
  getTabImg: async (req, res) => {
    try {
      const tabId = req.params.tabId ? parseInt(req.params.tabId) : null;
      const result = await tabService.getTabImg(tabId);
      res.status(200).json({
        success: true,
        message: "Tab images fetched successfully",
        data: result,
      });
    } catch (err) {
      console.log("Error in controller:", err);
      res.status(500).json({
        success: false,
        message: "Server error occurred while fetching tab images",
        error: err.message || "Failed to fetch tab images.",
      });
    }
  },
};

module.exports = tabController;
