// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./Config/db");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

const authRoutes = require("./Routes/auth");
const designRoutes = require("./Routes/designs");
const adminRoutes = require("./Routes/admin");
const templateRoutes = require("./Routes/templates"); // 👈 NEW

app.use("/api/auth", authRoutes);
app.use("/api/designs", designRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/templates", templateRoutes); // 👈 NEW (public list)

app.get("/", (_req, res) => {
  res.send("✅ Matty API is running...");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
