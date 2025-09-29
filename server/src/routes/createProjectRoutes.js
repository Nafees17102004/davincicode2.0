const express = require('express');
const router = express.Router();

const createProjectController = require('../controller/createProjectController');
const controller = require("../controller/codeGenController");

router.get('/projects', createProjectController.viewProjectDetails);
router.post('/add-project', createProjectController.insertProject);
router.post("/insertModule/:project_id",controller.insertModule);
router.get("/getProjectDetails/:p_code",controller.getProjectDetails);
router.post('/add-lang', createProjectController.insertLanguage);
router.get("/getLanguage",createProjectController.getLanguage);
router.get("/getFieldTypes",createProjectController.getFieldTypes);
router.get("/getSnippetById/:s_id",createProjectController.getSnippetById);

module.exports = router;