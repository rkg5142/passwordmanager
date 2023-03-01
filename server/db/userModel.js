const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an Email!"],
    unique: [true, "Email Exist"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password!"],
    unique: false,
  },
  secrets: [
    new mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
    })
  ]
});

module.exports = mongoose.model("Users", UserSchema);
