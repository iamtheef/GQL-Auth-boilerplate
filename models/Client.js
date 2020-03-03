const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  id: String,
  fname: String,
  lname: String,
  email: String,
  tel: String
});

module.exports = mongoose.model("Client", clientSchema);
