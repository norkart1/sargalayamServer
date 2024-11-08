

const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  //image: { type: String, required: true },
  
  createdAt: { type: Date, default: Date.now },
  programs: [
    {
      programId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program", // Reference to the Program model
        required: true,
      },
      score: { type: Number, default: 0 },
      rank: { type: Number, default: 0 },
      isSingle: { type: Boolean, default: false },
      isGroup: { type: Boolean, default: false },
    },
  ],
  totalScore: { type: Number, default: 0 },
});

const Teams = mongoose.model("Team", teamSchema);
module.exports = Teams;