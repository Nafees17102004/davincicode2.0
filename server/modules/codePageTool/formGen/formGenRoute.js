// routes/formGenRoutes.js
const express = require("express");
const router = express.Router();
const formGenController = require("../formGen/formGenController");

router.post("/", formGenController.saveFormGen);
router.get("/", formGenController.getFormGenById);

module.exports = router;
