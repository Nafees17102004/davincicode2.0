const express = require('express');

const router = express.Router();

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

// Example data

module.exports = router;