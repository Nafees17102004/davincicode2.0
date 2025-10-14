const listOfValuesService = require("../service/listOfValuesService");
// const { logError } = require("../utils/errorLogger"); optional error log helper

const insertLov = async (req, res) => {
  try {
    // Handle both single object and array
    const lovArray = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];
    const errors = [];

    for (const [index, lov] of lovArray.entries()) {
      const { lovName, lovDescp, lovStatus, inactiveReason, createdUser } = lov;

      // 🔹 Input validation
      if (!lovName || !createdUser) {
        errors.push({
          index,
          lov,
          error: "Missing required fields: 'lovName' or 'createdUser'",
        });
        continue;
      }

      try {
        // 🔹 Call service layer for each LOV
        const result = await listOfValuesService.insertLov(
          lovName,
          lovDescp,
          lovStatus,
          inactiveReason,
          createdUser
        );

        // 🔹 Handle backend (SP or SQL) level errors
        if (!result.success) {
          errors.push({
            index,
            lov,
            error: result.message,
          });

          // Optional: log errors into DB or file
          // await logError(
          //   "SP_INSERT_LIST_OF_VALUES",
          //   result.message,
          //   JSON.stringify(lov),
          //   createdUser
          // );

          continue;
        }

        // 🔹 Success case
        results.push({
          index,
          lov,
          newId: result.newId,
          message: result.message,
        });
      } catch (err) {
        // 🔹 Catch unexpected exceptions
        const errMsg = err.message || "Unknown server error";
        errors.push({ index, lov, error: errMsg });

        // Log detailed error
        // await logError(
        //   "insertLovController",
        //   errMsg,
        //   JSON.stringify(lov),
        //   createdUser
        // );
      }
    }

    // 🔹 Send summarized response
    res.status(errors.length ? 207 : 201).json({
      success: errors.length === 0,
      message:
        errors.length === 0
          ? "All LOVs inserted successfully"
          : "Partial success — some inserts failed",
      summary: {
        total: lovArray.length,
        inserted: results.length,
        failed: errors.length,
      },
      results,
      errors,
    });
  } catch (err) {
    console.error("Controller Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error occurred during LOV insertion",
      error: err.message,
    });
  }
};

const updateLov = async (req, res) => {
  try {
    const id = req.params.l_id;
    const { lovName, lovDescp, lovStatus, inactiveReason, updatedUser } =
      req.body;
    if (!lovName || !lovDescp || !updatedUser) {
      res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }
    const result = await listOfValuesService.updateLov(
      id,
      lovName,
      lovDescp,
      lovStatus,
      inactiveReason,
      updatedUser
    );

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.error });
    }

    return res.status(200).json({
      success: true,
      message: result.message || result.error,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Server error occured",
      error: error.message,
    });
  }
};

const getLov = async (req, res) => {
  try {
    const l_id = req.params.l_id ? req.params.l_id : null;

    const result = await listOfValuesService.getLov(l_id);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getLovWithDet = async (req, res) => {
  try {
    const lovId = req.params.lovId;
    if (!lovId) {
      return res
        .status(400)
        .json({ success: false, message: "lovId is required" });
    }
    const result = await listOfValuesService.getLovWithDet(lovId);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error("getLovWithDet error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred",
      error: error.message,
    });
  }
};

module.exports = { insertLov, updateLov, getLov, getLovWithDet };
