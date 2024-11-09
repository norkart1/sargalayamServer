
const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
  value: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  teams: [
    {
      teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team", // Reference to the Team model
        required: true,
      },
      rank: { type: Number, default: 0 },
      score: { type: Number, default: 0 },
      isSingle: { type: Boolean, default: false },
      isGroup: { type: Boolean, default: false },
    },
  ],
});

const Program = mongoose.model("Program", programSchema);
module.exports = Program;