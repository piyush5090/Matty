const mongoose = require("mongoose");

const TemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },
    cloudinaryPublicId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Template", TemplateSchema);
