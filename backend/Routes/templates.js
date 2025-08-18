// Routes/templates.js
const express = require("express");
const router = express.Router();
const Template = require("../Models/Template");

// Public: all templates (optionally filter by category ?category=XYZ)
router.get("/", async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category } : {};
  try {
    const list = await Template.find(filter).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Error fetching templates" });
  }
});

module.exports = router;
