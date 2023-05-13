const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  commentId: {
    type: String,
    required: [true],
  },
  userId: {
    type: String,
    required: [true],
  },
  created: {
    type: Date,
    required: [true],
  },
  userName: {
    type: String,
  },
  text: {
    type: String,
  },
});

const articleSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: [true],
  },
  userId: {
    type: String,
    required: [true],
  },
  userName: {
    type: String,
    required: [true],
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  comments: {
    type: [commentSchema],
  },
});

module.exports = mongoose.model("Article", articleSchema);
