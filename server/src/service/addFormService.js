const addFormRepo = require("../repository/addFormRepository");
const handleBar = require("./fieldGenerator");

const insertFormDetails = async (formDetailsArray) => {
  const results = [];
  const errors = [];
  const codeBlocks = [];
  for (const form of formDetailsArray) {
    try {
      const result = await addFormRepo.insertFormDetails(
        form.tabId,
        form.fieldSourceId,
        form.fieldTypeId,
        form.spName,
        form.spParam,
        form.tableName,
        form.tableColumns,
        form.customName,
        form.fieldName,
        form.fieldSizeId,
        form.fieldIconId,
        form.placeholder,
        form.fieldOrderId,
        form.storedProcedure,
        form.validationIds,
        form.eventHandler,
        form.cUser
      );
      if (result.success) {
        const field = await addFormRepo.getFormFieldById(result.insertedId);
        console.log({ field });
        const html = await handleBar.generateFieldCode(field);
        codeBlocks.push(html);
        results.push({ success: true, field, html });
      } else {
        errors.push({ success: false, error: result.message, formData: form });
      }
    } catch (error) {
      errors.push({ success: false, error: error.message, form });
    }
  }
  const finalForm = codeBlocks.join("\n");
  console.log(finalForm);
  return {
    success: true,
    addedCount: results.length,
    failedCount: errors.length,
    addedArray: results,
    failedArray: errors,
    generatedHTML: finalForm,
  };
  // try {
  //   const result = await addFormRepo.insertFormDetails(
  //     tabId,
  //     fieldSourceId,
  //     fieldTypeId,
  //     spName,
  //     spParam,
  //     tableName,
  //     tableColumns,
  //     customName,
  //     fieldName,
  //     fieldSizeId,
  //     fieldIconId,
  //     placeholder,
  //     fieldOrderId,
  //     storedProcedure,
  //     validationIds,
  //     eventHandler,
  //     cUser
  //   );
  //   if (result?.success && result?.insertedId) {
  //     const fieldData = await addFormRepo.getFormFieldById(result.insertedId);
  //     return {
  //       success: 1,
  //       message: result.message,
  //       insertedId: result.insertedId,
  //       tabId: result.tabId,
  //       fieldData,
  //     };
  //   }
  //   return {
  //     success: 0,
  //     message: result.message,
  //   };
  // } catch (error) {
  //   console.error({ success: false, message: error.message });
  //   return {
  //     success: 0,
  //     message: "Internal service error occurred.",
  //   };
  // }
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
