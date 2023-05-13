const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User Id is required"],
  },
  userName: {
    type: String,
    required: [true, "Username is required"],
  },
  auth: {
    type: Map,
    of: String,
  },
  hash: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  provider: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
