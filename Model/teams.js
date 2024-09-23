const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ranking: { type: Number, required: true },
  score: {type: Number, required:true },
  image: { type: String }, // This will store the image URL or a reference to the image location
  createdAt: { type: Date, default: Date.now },
});

const Teams = mongoose.model("Team", TeamSchema);

module.exports = Teams;
