const saveA = async (
  p_TAB_ID, p_FIELD_SOURCE_LOV_DET_ID, p_FIELD_NAME, p_FIELD_SIZE_LOV_DET_ID, p_FIELD_ICON_LOV_DET_ID, p_PLACEHOLDER, p_FIELD_ORDER_LOV_DET_ID, p_C2C_CUSER
) => {
  try {
    const query = `CALL SP_INSERT_ADD_FORM_TABLE(
      ?, ?, ?, ?, ?, ?, ?, ?
    );`;

    const params = [
      p_TAB_ID, p_FIELD_SOURCE_LOV_DET_ID, p_FIELD_NAME, p_FIELD_SIZE_LOV_DET_ID, p_FIELD_ICON_LOV_DET_ID, p_PLACEHOLDER, p_FIELD_ORDER_LOV_DET_ID, p_C2C_CUSER
    ];

    const [rows] = await pool.query(query, params);
    return rows;

  } catch (error) {
    console.error("Repository Error (a):", error);
    throw error;
  }
};

 
 module.exports = {
  saveA,
};

 
const repository = require("../repository/aRepository");

const saveA = async (
  p_TAB_ID, p_FIELD_SOURCE_LOV_DET_ID, p_FIELD_NAME, p_FIELD_SIZE_LOV_DET_ID, p_FIELD_ICON_LOV_DET_ID, p_PLACEHOLDER, p_FIELD_ORDER_LOV_DET_ID, p_C2C_CUSER
) => {
  try {
    const result = await repository.saveA(
      p_TAB_ID, p_FIELD_SOURCE_LOV_DET_ID, p_FIELD_NAME, p_FIELD_SIZE_LOV_DET_ID, p_FIELD_ICON_LOV_DET_ID, p_PLACEHOLDER, p_FIELD_ORDER_LOV_DET_ID, p_C2C_CUSER
    );
    return result;
  } catch (error) {
    console.error("Service Error (a Service):", error);
    throw error;
  }
};

module.exports = { saveA };


const service = require("../service/aService");

const saveA = async (req, res) => {
  try {
    const {
        p_TAB_ID, p_FIELD_SOURCE_LOV_DET_ID, p_FIELD_NAME, p_FIELD_SIZE_LOV_DET_ID, p_FIELD_ICON_LOV_DET_ID, p_PLACEHOLDER, p_FIELD_ORDER_LOV_DET_ID, p_C2C_CUSER
    } = req.body;

    const result = await service.saveA(
      p_TAB_ID, p_FIELD_SOURCE_LOV_DET_ID, p_FIELD_NAME, p_FIELD_SIZE_LOV_DET_ID, p_FIELD_ICON_LOV_DET_ID, p_PLACEHOLDER, p_FIELD_ORDER_LOV_DET_ID, p_C2C_CUSER
    );

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Controller Error (a):", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { saveA };

const express = require("express");
const router = express.Router();
const controller = require("../controller/aController");

router.post("/a", controller.saveA);

module.exports = router;


