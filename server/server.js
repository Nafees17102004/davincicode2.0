const express = require("express");
const cors = require("cors");
const session = require("express-session");
const app = express();
const routes = require("./src/routes/createProjectRoutes");
// Seperating different modules for better organization
const modules = require("./modules/index");

app.use(cors());
app.use(express.json());

// ✅ Add session middleware BEFORE routes
app.use(
  session({
    secret: "hiddenSecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // set secure:true only if your site runs on HTTPS
  })
);

// Register API routes
app.use("/code", routes);
app.use("/code", modules);

// Example: Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
