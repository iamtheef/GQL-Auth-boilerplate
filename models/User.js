const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  google: {
    isGoogle: Boolean,
    googleID: String
  },
  role: String,
  date: {
    type: Date,
    default: Date.now()
  },
  avatar: {
    type: String,
    default: ""
  },

  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile"
  }
});

module.exports = mongoose.model("User", userSchema);
