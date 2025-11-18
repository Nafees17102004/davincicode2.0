const express = require("express");
const cors = require("cors");
// Session config
const session = require("express-session");

const app = express();
const routes = require("./src/routes/createProjectRoutes");
// Seperating different modules for better organization
const modules = require("./modules/index");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Session config
app.use(
  session({
    secret: "hiddenSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true only if https
      httpOnly: true,
      sameSite: "lax", // <--- CRITICAL FOR SESSION TO PERSIST
    },
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

app.get("/check-session", (req, res) => {
  res.json({
    session: req.session,
    formId: req.session.formId || null,
  });
});

// Add this temporary test route in your server.js
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    res.json({
      success: true,
      message: "Database connected successfully",
      result: rows,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});
// In server.js - temporary route
app.get("/check-config", (req, res) => {
  res.json({
    dbUser: process.env.DB_USER,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    dbPort: process.env.DB_PORT,
  });
});
// Add this test route
app.get("/test-projects", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM projects LIMIT 5");
    res.json({
      success: true,
      count: rows.length,
      projects: rows,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
      sqlMessage: error.sqlMessage,
    });
  }
});
