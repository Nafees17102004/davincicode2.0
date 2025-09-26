const express = require('express');
const router = express.Router();

const createProjectController = require('../controller/createProjectController');
const controller = require("../controller/codeGenController");

router.get('/projects', createProjectController.viewProjectDetails);
router.post('/add-project', createProjectController.insertProject);
router.post("/insertModule",controller.insertModule);
router.get("/getProjectDetails/:p_code",controller.getProjectDetails);
router.post('/lang', createProjectController.insertLanguage);

module.exports = router;