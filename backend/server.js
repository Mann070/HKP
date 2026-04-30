require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const categoryRoutes = require("./routes/categoryRoutes");
const imageRoutes = require("./routes/imageRoutes");

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (Note: local uploads won't persist on Render/Vercel)
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/images", imageRoutes);

// Root route for health check
app.get("/", (req, res) => {
  res.send("HKP API is running...");
});

// For Render/Local: Listen on port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// For Vercel: Export the app
module.exports = app;
