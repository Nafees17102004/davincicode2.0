const express = require('express');
const router = express.Router();

// Example data
let exampleData = {
    name: "Sample Project",
    value: 42
};

// GET API - fetch example data
router.get('/example', (req, res) => {
    res.json(exampleData);
});

// PUT API - update example data
router.put('/example', (req, res) => {
    const { name, value } = req.body;
    if (name !== undefined) exampleData.name = name;
    if (value !== undefined) exampleData.value = value;
    res.json(exampleData);
});

module.exports = router;