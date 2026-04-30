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

// Serve static files for demo
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/images", imageRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});
