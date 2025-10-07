const controller = require("../controller/codeGenController");

const express=require("express");

const router=express.Router();

router.post("/insertModule/:project_id",controller.insertModule);
router.post("/getProjectDetails",controller.getProjectDetails);

// Add after existing router.post() calls:
router.post("/insertFormGen", controller.insertFormGen);

module.exports=router;