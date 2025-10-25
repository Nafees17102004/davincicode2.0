const addFormService = require("../service/addFormService");

const insertFormDetails = async (req, res) => {
  try {
    const formDetailsArray = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];
    const errors = [];
    for (const [index, form] of formDetailsArray.entries()) {
      const {
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
        cUser,
      } = form;
      try {
        const result = await addFormService.insertFormDetails(
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
        if (result.success === 0) {
          errors.push({
            index,
            success: false,
            error: result.message,
            formData: form,
          });
          continue;
        }
        results.push({
          index,
          success: true,
          message: result.message,
          formData: form,
        });
      } catch (dbError) {
        console.error({ dbError });
        errors.push({ dbError });
      }
    }

    res.status(201).json({
      success: true,
      addedCount: results.length,
      failedCount: errors.length,
      addedArray: results,
      failedArray: errors,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getLovDropdown = async (req, res) => {
  try {
    const { listName, lovName } = req.params;
    const result = await addFormService.getLovDropdown(listName, lovName);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const insertTabDetails = async (req, res) => {
  try {
    const { projectId, pageId, tabName, tabImageId, CUser } = req.body;
    const result = await addFormService.insertTabDetails(
      projectId,
      pageId,
      tabName,
      tabImageId,
      CUser
    );
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  insertFormDetails,
  getLovDropdown,
  insertTabDetails,
};
