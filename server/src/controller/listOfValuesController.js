const listOfValuesService = require("../service/listOfValuesService");

const insertLov = async (req, res) => {
  const { lovName, lovDescription, lovStatus, inactiveReason, cUser } =
    req.body;

  try {
    const result = await listOfValuesService.insertLov(
      lovName,
      lovDescription,
      lovStatus,
      inactiveReason,
      cUser
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
        error: result.error,
      });
    }

    return res.status(201).json({
      success: true,
      message: result.message,
      newId: result.newId,
    });
  } catch (err) {
    console.error("Controller Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error occurred", error: err });
  }
};

module.exports = {
  insertLov,
};
