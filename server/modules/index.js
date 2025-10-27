const express = require("express");
const router = express.Router();

router.use("/snippet", require("./snippet/snippetRoute"));

module.exports = router;
