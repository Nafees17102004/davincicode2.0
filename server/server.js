const express = require("express");
const cors = require("cors");
const app = express();
const routes = require("./src/routes/createProjectRoutes");

app.use(cors());
app.use(express.json());

// Register API routes
app.use("/code", routes);

// Example: Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
