const express = require("express");
const app = express();
const route=require("../server/src/routes/codeGenRoutes");

app.use(express.json());
app.use('/',route);
const port = 5000;
app.listen(port, ( ) => {
    console.log("Server is running on port ", port);
});