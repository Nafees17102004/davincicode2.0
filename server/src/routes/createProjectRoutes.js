const express = require('express');
const router = express.Router();

const createProjectController = require('../controller/createProjectController');

router.post('/add-project', createProjectController.insertProject);

module.exports = router;