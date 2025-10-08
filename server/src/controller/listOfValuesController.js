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

module.exports = { insertLov };
