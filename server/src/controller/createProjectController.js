const createProjectService = require('../service/createProjectService');

const insertProject = async (req,res) =>{
    try {
    const projects = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];
    const errors = [];

    for (const [index, project] of projects.entries()) {
      const { pCode, pName, pLanguageId, pStatus, pInactiveReason } = project;

      // validation
      if (!pCode || !pName || !pLanguageId || !pStatus || !pInactiveReason) {
        errors.push({ index, error: "All fields are required", employee: project });
        continue; // skip this one, continue with next
      }

      try {
        const [result] = await createProjectService.insertProject(
          pCode, 
          pName, 
          pLanguageId, 
          pStatus, 
          pInactiveReason
        );
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
      failedProjects: errors
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
    insertProject
}