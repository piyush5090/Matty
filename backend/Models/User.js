const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" }, // admin role
    googleId: { type: String }, // for Google auth
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
