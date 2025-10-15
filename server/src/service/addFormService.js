const addFormRepo = require("../repository/addFormRepository");

const insertFormDetails = async (
  tabId,
  fieldSourceId,
  FieldName,
  fieldSizeId,
  fieldIconId,
  placeholder,
  fieldOrderId,
  cUser
) => {
  try {
    const result = await addFormRepo.insertFormDetails(
      tabId,
      fieldSourceId,
      FieldName,
      fieldSizeId,
      fieldIconId,
      placeholder,
      fieldOrderId,
      cUser
    );
    return result;
  } catch (error) {
    console.error({ success: false, message: error.message });
    return {
      success: 0,
      message: "Internal service error occurred.",
    };
  }
};
const getLovDropdown = async (listName, lovName) => {
  try {
    const result = await addFormRepo.getLovDropdown(listName, lovName);
    return result;
  } catch (error) {
    throw new error();
  }
};
const insertTabDetails = async (
  projectId,
  pageId,
  tabName,
  tabImageId,
  CUser
) => {
  try {
    const result = await addFormRepo.insertTabDetails(
      projectId,
      pageId,
      tabName,
      tabImageId,
      CUser
    );
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  insertFormDetails,
  getLovDropdown,
  insertTabDetails,
};
