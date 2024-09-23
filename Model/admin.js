const mongoose = require("mongoose");

const adminSessionSchema = new mongoose.Schema({
  emailID: { type: String, required: true }, // Reference to Franchise model
  accessToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const AdminSession = mongoose.model("AdminSession", adminSessionSchema);

module.exports = AdminSession;