const saveRepoDemo = async (
  p_field_type_id, p_language_id, p_snippet_name, p_snippet
) => {
  try {
    const query = `CALL SP_INSERT_UPDATE_SNIPPET(
      ?, ?, ?, ?
    );`;

    const params = [
      p_field_type_id, p_language_id, p_snippet_name, p_snippet
    ];

    const [rows] = await pool.query(query, params);
    return rows;

  } catch (error) {
    console.error("Repository Error (repoDemo):", error);
    throw error;
  }
};

 
 module.exports = {
  saveRepoDemo,
};

 
const repository = require("../repository/repoDemoRepository");

const saveRepoDemo = async (
  p_field_type_id, p_language_id, p_snippet_name, p_snippet
) => {
  try {
    const result = await repository.saveRepoDemo(
      p_field_type_id, p_language_id, p_snippet_name, p_snippet
    );
    return result;
  } catch (error) {
    console.error("Service Error (repoDemo Service):", error);
    throw error;
  }
};

module.exports = { saveRepoDemo };


const service = require("../service/repoDemoService");

const saveRepoDemo = async (req, res) => {
  try {
    const {
        p_field_type_id, p_language_id, p_snippet_name, p_snippet
    } = req.body;

    const result = await service.saveRepoDemo(
      p_field_type_id, p_language_id, p_snippet_name, p_snippet
    );

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Controller Error (repoDemo):", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { saveRepoDemo };

const express = require("express");
const router = express.Router();
const controller = require("../controller/repoDemoController");

router.post("/repo-demo", controller.saveRepoDemo);

module.exports = router;


