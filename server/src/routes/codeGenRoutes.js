const controller = require("../controller/codeGenController");

const express=require("express");

const router=express.Router();

router.post("/insertModule/:project_id",controller.insertModule);
router.post("/getProjectDetails",controller.getProjectDetails);

module.exports=router;