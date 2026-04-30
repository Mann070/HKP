require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const categoryRoutes = require("./routes/categoryRoutes");
const imageRoutes = require("./routes/imageRoutes");

const app = express();

// Connect to Database at startup
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files for demo (Note: will not work on Vercel serverless)
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/images", imageRoutes);

// Export for Vercel
module.exports = app;

// Listen only if running directly (not via Vercel serverless)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
