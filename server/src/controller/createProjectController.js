const createProjectService = require("../service/createProjectService");

const insertProject = async (req, res) => {
  try {
    const projects = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];
    const errors = [];

    for (const [index, project] of projects.entries()) {
      const {pCode, pName, pLanguageId, pStatus, pInactiveReason } = project;

      // validation
      if (!pCode || !pName || !pLanguageId || !pStatus) {
        errors.push({
          index,
          error: "All fields are required",
          employee: project,
        });
        continue; // skip this one, continue with next
      }

      try {
        const result = await createProjectService.insertProject(
          pCode,
          pName,
          pLanguageId,
          pStatus,
          pInactiveReason
        );
        if (!result || result.affectedRows === 0) {
          errors.push({
            index,
            error: "Duplicate Error",
            projects: project,
          });
          continue;
        }
        results.push({ ...project, dbResult: result });
      } catch (dbErr) {
        errors.push({ index, error: dbErr.message, employee: project });
      }
    }

    res.status(201).json({
      message: "Processing completed",
      addedCount: results.length,
      failedCount: errors.length,
      addedProjects: results,
      failedProjects: errors,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const viewProjectDetails = async (req, res) => {
  try {
    const result = await createProjectService.viewProjectDetails();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const insertLanguage = async (req, res) => {
  try {
    const language = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];
    const errors = [];

    for (const [index, lang] of language.entries()) {
      const { lName, lStatus, lInactiveReason } = lang;
      if (!lName || !lStatus) {
        errors.push({
          index,
          error: "All fields are required",
          language: lang,
        });
        continue; // skip this one, continue with next
      }
      try {
        const result = await createProjectService.insertLanguage(
          lName,
          lStatus,
          lInactiveReason
        );
        if (!result || result.affectedRows == 0) {
          errors.push({
            index,
            error: "Duplicate Error",
            language: lang,
          });
          continue;
        }
        results.push({ ...lang, dbResult: result });
      } catch (dbErr) {
        errors.push({ index, error: dbErr.message, language: lang });
      }
    }
    res.status(201).json({
      message: "Processing completed",
      addedCount: results.length,
      failedCount: errors.length,
      addedLanguages: results,
      failedLanguages: errors,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getLanguage = async (req, res) => {
  try {
    const result = await createProjectService.getLanguage();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFieldTypes = async (req, res) => {
  try {
    const result = await createProjectService.getFieldTypes();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const insertFieldTypes = async (req, res) => {
  try {
    const FieldArray = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];
    const errors = [];

    for (const [index, field] of FieldArray.entries()) {
      const {
        fieldTypeId,
        elementTypeId,
        fieldName,
        fStatus,
        fInactiveReason,
        cUser,
      } = field;
      if (!fieldName || !fStatus) {
        errors.push({
          index,
          error: "All fields are required",
          FieldArray: field,
        });
        continue; // skip this one, continue with next
      }
      try {
        const result = await createProjectService.insertFieldTypes(
          fieldTypeId,
          elementTypeId,
          fieldName,
          fStatus,
          fInactiveReason,
          cUser
        );
        if (!result || result.affectedRows == 0) {
          errors.push({
            index,
            error: "Duplicate Error",
            FieldArray: field,
          });
          continue;
        }
        results.push({ ...field, dbResult: result });
      } catch (dbErr) {
        errors.push({ index, error: dbErr.message, FieldArray: field });
      }
    }
    res.status(201).json({
      message: "Processing completed",
      addedCount: results.length,
      failedCount: errors.length,
      addedFields: results,
      failedFields: errors,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSnippetById = async (req, res) => {
  try {
    const s_id = req.params.s_id;
    const result = await createProjectService.getSnippetById(s_id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  insertProject,
  viewProjectDetails,
  insertLanguage,
  getLanguage,
  getFieldTypes,
  getSnippetById,
  insertFieldTypes,
};
