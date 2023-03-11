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
      userName: {
        type: String,
        required: false,
      },
      url: {
        type: String,
        required: false,
      },
      password: {
        type: String,
        required: true,
      },
    })
  ]
});

module.exports = mongoose.model("Users", UserSchema);
