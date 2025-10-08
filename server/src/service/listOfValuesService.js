const listOfValuesRepository = require("../repository/listOfValuesRepository");

const insertLov = async (
  lovName,
  lovDescp,
  lovStatus,
  inactiveReason,
  createdUser
) => {
  try {
    const result = await listOfValuesRepository.insertLov(
      lovName,
      lovDescp,
      lovStatus,
      inactiveReason,
      createdUser
    );

    // Check if repository detected a failure
    if (!result.success) {
      return {
        success: false,
        message: result.message,
        error: result.error,
      };
    }

    return {
      success: true,
      message: result.message,
      newId: result.newId,
    };
  } catch (error) {
    console.error("Service Error:", error);
    return {
      success: false,
      message: "Service layer error occurred",
      error,
    };
  }
};

module.exports = { insertLov };
