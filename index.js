const express = require("express");
const cookieParser = require("cookie-parser");
const mongoDB = require("./config/db");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/course");
const courseReview = require("./routes/review");
const app = express();
const port = process.env.PORT || 5000;

mongoDB();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api", courseRoutes);
app.use("/api/review", courseReview);

app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
