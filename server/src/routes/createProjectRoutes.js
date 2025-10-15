const express = require("express");
const router = express.Router();

const createProjectController = require("../controller/createProjectController");
const controller = require("../controller/codeGenController");
const listOfValuesController = require("../controller/listOfValuesController");
const addFormController = require("../controller/addFormController");
const tabController = require("../controller/tabController");

// Get request
router.get("/projects", createProjectController.viewProjectDetails);
router.get("/getLanguage", createProjectController.getLanguage);
router.get("/getFieldTypes", createProjectController.getFieldTypes);
router.get("/getSnippetById/:s_id", createProjectController.getSnippetById);
router.get("/getProjectDetails/:p_code", controller.getProjectDetails);
router.get("/getLovs", listOfValuesController.getLov);
router.get("/getLov/:l_id", listOfValuesController.getLov);
router.get("/getListOfValuesDetails", controller.getListOfValuesDetails);
router.get("/getListOfValuesDetail/:lovId", controller.getListOfValuesDetails);
router.get("/get-lov-with-det/:lovId", listOfValuesController.getLovWithDet);
router.get(
  "/lov-det-drop-down/:listName/:lovName",
  addFormController.getLovDropdown
);

router.get("/get-lov-with-det/:lovId", listOfValuesController.getLovWithDet);
router.get("/getTabImgs", tabController.getTabImg);
router.get("/getTabImg/:tabId", tabController.getTabImg);
// Post request
router.post("/add-project", createProjectController.insertProject);
router.post("/insertModule/:project_id", controller.insertModule);
router.post("/add-lang", createProjectController.insertLanguage);
router.post("/add-field-type", createProjectController.insertFieldTypes);
router.post("/insertSnippet", controller.insertSnippet);
router.post("/insert-lov", listOfValuesController.insertLov);
router.post("/insert-tab", tabController.insertTab);

// Put Request
router.put("/update-lov/:l_id", listOfValuesController.updateLov);
router.post("/insertListOfValuesDetails", controller.insertListOfValuesDetails);

router.put(
  "/updateListOfValuesDetail/:lovId/:lovDetId",
  controller.updateListOfValuesDetail
);

// Add Form API's

//Get

// Post
router.post("/add-form-det", addFormController.insertFormDetails);

module.exports = router;
