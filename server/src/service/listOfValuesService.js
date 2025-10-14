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

const updateLov = async (
  lovId,
  lovName,
  lovDescp,
  lovStatus,
  inactiveReason,
  updatedUser
) => {
  try {
    const result = await listOfValuesRepository.updateLov(
      lovId,
      lovName,
      lovDescp,
      lovStatus,
      inactiveReason,
      updatedUser
    );

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
    };
  } catch (error) {
    console.error("SP error occured");

    return {
      success: false,
      message: "Service layer occured",
      error,
    };
  }
};

const getLov = async (l_id) => {
  try {
    const result = await listOfValuesRepository.getLov(l_id);
    return result;
  } catch (error) {
    console.error("Service error: ", error);
  }
};

const getLovWithDet = async (lovId) => {
  try {
    const result = await listOfValuesRepository.getLovWithDet(lovId);
    return result;
  } catch (error) {
    console.error("Error in service layer: ", error);
  }
};

module.exports = { insertLov, updateLov, getLov, getLovWithDet };
