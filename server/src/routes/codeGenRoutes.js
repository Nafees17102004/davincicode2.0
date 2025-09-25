const controller = require("../controller/codeGenController");

const express=require("express");

const router=express.Router();

router.post("/insertModule",controller.insertModule);
router.post("/getProjectDetails",controller.getProjectDetails);

module.exports=router;