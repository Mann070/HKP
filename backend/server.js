require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const categoryRoutes = require("./routes/categoryRoutes");
const imageRoutes = require("./routes/imageRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/images", imageRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("HKP API is running...");
});

// For Render/Local: Connect DB then Listen
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

if (process.env.NODE_ENV !== 'production' || process.env.RENDER) {
  startServer();
}

// For Vercel
module.exports = app;
