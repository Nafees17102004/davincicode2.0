const service = require("../service/codeGenService");

const getProjectDetails = async (req, res) => {
  try {
    const project_code = req.params.p_code;
    if (!project_code) {
      return res.status(400).json({ message: "missing field" });
    }
    const result = await service.getProjectDetails(project_code);
    res.status(200).json({ success: "true", result });
  } catch (err) {
    res.status(500).json(err);
  }
};

const insertModule = async (req, res) => {
  try {
    const modules = Array.isArray(req.body) ? req.body : [req.body];
    const project_id = req.params.project_id;
    const results = [];
    const errors = [];

    for (const [index, module] of modules.entries()) {
      const { m_name, m_desc, status, inactive_reason } = module;

      if (!project_id || !m_name || !status) {
        errors.push({
          index,
          error: "All fields are required",
          module: module,
        });
        continue; // skip this one, continue with next
      }

      try {
        const result = await service.insertModule(
          project_id,
          m_name,
          m_desc,
          status,
          inactive_reason
        );
        results.push({ ...module, dbResult: result });
      } catch (err) {
        errors.push({ index, error: err.message, module: module });
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
    console.error("err in controller", err);
    res.status(400).json({
      success: false,
      message: err.sqlMessage || err.message,
    });
  }
};

const insertSnippet = async (req, res) => {
  try {
    const snippets = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];
    const errors = [];

    for (const [index, snip] of snippets.entries()) {
      const {
        fieldTypeId,
        languageId,
        snippetTypeId,
        snippetName,
        snippet,
      } = snip;

      if (!fieldTypeId || !languageId || !snippetTypeId || !snippetName || !snippet) {
        errors.push({ index, error: "All fields are required", snippet: snip });
        continue;
      }

      try {
        const result = await service.insertSnippet(
          fieldTypeId,
          languageId,
          snippetTypeId,
          snippetName,
          snippet
        );
        results.push({ ...snip, dbResult: result });
      } catch (err) {
        errors.push({ index, error: err.message, snip: snip });
      }
    }
    res.status(201).json({
      message: "Processing completed",
      addedCount: results.length,
      failedCount: errors.length,
      addedSnippets: results,
      failedSnippets: errors,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add after existing exports and functions:
const insertFormGen = async (req, res) => {
  try {
    const { formName, formConfig } = req.body;
    if (!formName || !formConfig) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const result = await service.insertFormGen(formName, formConfig);
    res.status(201).json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getListOfValuesDetails = async (req, res) => {
  try {
    const lovId = req.params.lovId ? parseInt(req.params.lovId) : null;

    const result = await service.getListOfValuesDetails(lovId);
    res.status(200).json({ sucess: true, result });
  } catch (err) {
    console.log("err in controller", err);
    res.status(500).json({ sucess: false, message: err.message });
  }
};

const insertListOfValuesDetails = async (req, res) => {
  try {
    const lovDets = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];
    const errors = [];

    for (const [index, lovDet] of lovDets.entries()) {
      const {
        lovId,
        lovDetName,
        lovDetDescp,
        lovDetStatus,
        inActiveReason,
        cUser,
      } = lovDet;

      if (!lovId || !lovDetName || !cUser) {
        errors.push({ index, err: "All fields are required", lovDet: lovDet });
        continue;
      }
      try {
        const result = await service.insertListOfValuesDetails(
          lovId,
          lovDetName,
          lovDetDescp,
          lovDetStatus,
          inActiveReason,
          cUser
        );
        if (!result.success) {
          errors.push({
            index,
            error: result.message,
            lovDet,
          });
          continue;
        }
        results.push({ ...lovDet, dbresult: result });
      } catch (err) {
        errors.push({ index, err: err.message, lovDet: lovDet });
      }
    }
    res.status(errors.length ? 207 : 201).json({
      sucess: errors.length === 0,
      message:
        errors.length === 0
          ? "All LovDets inserted successfully"
          : "Partial success — some inserts failed",
      summary: {
        total: lovDets.length,
        inserted: results.length,
        failed: errors.length,
      },
      addedLovDet: results,
      failedLovDet: errors,
    });
  } catch (err) {
    console.log("err in controller", err);
    res.status(500).json({
      success: false,
      message: "Server error occurred during LOVDETS insertion",
      error: err.message,
    });
  }
};

const updateListOfValuesDetail = async (req, res) => {
  try {
    const { lovId, lovDetId } = req.params;
    const { lovDetName, lovDetDescp, lovDetStatus, inActiveReason, uUser } =
      req.body;

    if (!lovDetId || !lovId || !lovDetName || !lovDetDescp || !uUser) {
      res.status(404).json({ message: "All fields are required!" });
    }

    const result = await service.updateListOfValuesDetail(
      lovId,
      lovDetId,
      lovDetName,
      lovDetDescp,
      lovDetStatus,
      inActiveReason,
      uUser
    );
    console.log(result);
    res.status(200).json({ success: true, result });
  } catch (err) {
    console.log("err in controller", err);
    res.status(500).json({ message: err.message });
  }
};

// Add to module.exports:
module.exports = {
  insertModule,
  getProjectDetails,
  insertSnippet,
  insertFormGen,
  getListOfValuesDetails,
  insertListOfValuesDetails,
  updateListOfValuesDetail,
};
