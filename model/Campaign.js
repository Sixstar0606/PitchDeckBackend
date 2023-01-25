const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  intro: {
    type: String,
  },
  pic: {
    type: String,
    required: [true, "Can't be blank"],
  },
  Description: {
    type: String,
  },
  video: {
    type: String,
  },
  detail: {
    type: String,
  },
  milestones: {
    type: String,
  },
  investorRewards: [
    {
      amount: {
        type: String,
        required: false,
      },
      description: {
        type: String,
        required: false,
      },
    },
  ],
});

const Campaign = mongoose.model("Campaign", CampaignSchema);

module.exports = Campaign;
