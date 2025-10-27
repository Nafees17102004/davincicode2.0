const addFormRepo = require("../repository/addFormRepository");

const insertFormDetails = async (
  tabId,
  fieldSourceId,
  fieldTypeId,
  spName,
  spParam,
  tableName,
  tableColumns,
  customName,
  fieldName,
  fieldSizeId,
  fieldIconId,
  placeholder,
  fieldOrderId,
  storedProcedure,
  validationIds,
  eventHandler,
  cUser
) => {
  try {
    const result = await addFormRepo.insertFormDetails(
      tabId,
      fieldSourceId,
      fieldTypeId,
      spName,
      spParam,
      tableName,
      tableColumns,
      customName,
      fieldName,
      fieldSizeId,
      fieldIconId,
      placeholder,
      fieldOrderId,
      storedProcedure,
      validationIds,
      eventHandler,
      cUser
    );
    if (result?.success && result?.insertedId) {
      const fieldData = await addFormRepo.getFormFieldById(result.insertedId);
      return {
        success: 1,
        message: result.message,
        insertedId: result.insertedId,
        tabId: result.tabId,
        fieldData,
      };
    }
    return {
      success: 0,
      message: result.message,
    };
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
