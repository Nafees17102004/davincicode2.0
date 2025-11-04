const express = require("express");
const formGenRoute = require("../modules/codePageTool/formGen/formGenRoute");

const router = express.Router();

// Snippet Routes
// router.use("/snippet", require("./snippet/snippetRoute"));

// Form Generator Routes
router.use("/form-generation", formGenRoute);
router.use("/form-generation", formGenRoute);

module.exports = router;
