const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "UserId for profile is required"],
  },
  userName: {
    type: String,
    required: [true, "Username is required"],
  },
  headline: {
    type: String,
  },
  email: {
    type: String,
  },
  zipcode: {
    type: String,
  },
  dob: {
    type: Date,
  },
  avatar: {
    type: String,
  },
  following: {
    type: [String],
  },
  created: {
    type: Date,
    default: Date.now,
  },
  isLinked: {
    type: Boolean,
    default: false,
  },
  provider: {
    type: String,
  },
});

module.exports = mongoose.model("Profile", profileSchema);
