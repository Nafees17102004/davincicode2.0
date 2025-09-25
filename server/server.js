const express = require('express');
const app = express();
const apiRoutes = require('./src/config/routes/api');

// Middleware to parse JSON
app.use(express.json());

// Register API routes
app.use('/api', apiRoutes);

// Example: Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});