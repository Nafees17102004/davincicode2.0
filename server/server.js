const express = require("express");
const app = express();
const createProjectRoutes = require('./src/routes/createProjectRoutes')

app.use(express.json());
app.use("/code", createProjectRoutes);

const port = 5000;
app.listen(port, ( ) => {
    console.log("Server is running on port ", port);
});