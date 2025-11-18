const addFormService = require("../service/addFormService");
const { generateFieldCode } = require("../service/fieldGenerator");

const insertFormDetails = async (req, res) => {
  try {
    const formDetailsArray = Array.isArray(req.body) ? req.body : [req.body];
    const result = await addFormService.insertFormDetails(formDetailsArray);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
  // try {
  //   const formDetailsArray = Array.isArray(req.body) ? req.body : [req.body];
  //   const results = [];
  //   const errors = [];
  //   for (const [index, form] of formDetailsArray.entries()) {
  //     const {
  //       tabId,
  //       fieldSourceId,
  //       fieldTypeId,
  //       spName,
  //       spParam,
  //       tableName,
  //       tableColumns,
  //       customName,
  //       fieldName,
  //       fieldSizeId,
  //       fieldIconId,
  //       placeholder,
  //       fieldOrderId,
  //       storedProcedure,
  //       validationIds,
  //       eventHandler,
  //       cUser,
  //     } = form;
  //     try {
  //       const result = await addFormService.insertFormDetails(
  //         tabId,
  //         fieldSourceId,
  //         fieldTypeId,
  //         spName,
  //         spParam,
  //         tableName,
  //         tableColumns,
  //         customName,
  //         fieldName,
  //         fieldSizeId,
  //         fieldIconId,
  //         placeholder,
  //         fieldOrderId,
  //         storedProcedure,
  //         validationIds,
  //         eventHandler,
  //         cUser
  //       );
  //       console.log(result);
  //       if (result.success === 0) {
  //         errors.push({
  //           index,
  //           success: false,
  //           error: result.message,
  //           formData: form,
  //         });
  //         continue;
  //       }
  //       results.push({
  //         index,
  //         success: true,
  //         message: result.message,
  //         formData: result.fieldData,
  //       });
  //     } catch (dbError) {
  //       console.error({ dbError });
  //       errors.push({ dbError });
  //     }
  //   }

  //   res.status(201).json({
  //     success: true,
  //     addedCount: results.length,
  //     failedCount: errors.length,
  //     addedArray: results,
  //     failedArray: errors,
  //   });
  // } catch (error) {
  //   res.status(500).json({ success: false, message: error.message });
  // }
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

const demoGenerateCode = async (req, res) => {
  try {
    const field = {
      FIELD_NAME: "demo101",
      PLACEHOLDER: "Enter your demo",
      FIELD_TYPE: "Textbox",
      SNIPPET_CODE:
        '<input type="text" id="{{fieldName}}" name="{{fieldName}}" placeholder="{{placeholder}}" />',
      VALIDATIONS_JSON: [
        { VALIDATION_RULE: "required" },
        { VALIDATION_RULE: "minLength(3)" },
      ],
    };
    const result = await generateFieldCode(field);
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  insertFormDetails,
  getLovDropdown,
  insertTabDetails,
  demoGenerateCode,
};
