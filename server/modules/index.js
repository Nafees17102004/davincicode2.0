const express = require("express");
const formGenRoute = require("./formGen/formGenRoute");

const router = express.Router();

// Snippet Routes
// router.use("/snippet", require("./snippet/snippetRoute"));

// Form Generator Routes
router.use("/form-generation/save", formGenRoute);

module.exports = router;
