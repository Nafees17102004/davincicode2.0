const express = require('express');
const router = express.Router();

const createProjectController = require('../controller/createProjectController');
const controller = require("../controller/codeGenController");

// Get request
router.get('/projects', createProjectController.viewProjectDetails);
router.get("/getLanguage", createProjectController.getLanguage);
router.get("/getFieldTypes", createProjectController.getFieldTypes);
router.get("/getSnippetById/:s_id", createProjectController.getSnippetById);
router.get("/getProjectDetails/:p_code", controller.getProjectDetails);

// Post request
router.post('/add-project', createProjectController.insertProject);
router.post("/insertModule/:project_id",controller.insertModule);
router.post('/add-lang', createProjectController.insertLanguage);
router.post('/add-field-type', createProjectController.insertFieldTypes);


module.exports = router;