const { getSnippet } = require("./snippetRepository");

const snippetService = {
  getSnippet: async (snippetId) => {
    try {
      const result = await getSnippet(snippetId);
      return result;
    } catch (error) {
      console.error("Error in snippetService getSnippet: ", error);
    }
  },
};

module.exports = snippetService;
