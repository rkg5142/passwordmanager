const mongoose = require("mongoose");

const SecretsSchema = new mongoose.Schema({
      name: {
        type: String,
        required: [true, "Please provide a name for your password."],
        unique: [true, "Email Exist"],
      },

      url: {
        type: String,
        required: [true, "Please provide a URL."],
        unique: [true, "Email Exist"],
      },
    
      password: {
        type: String,
        required: [true, "Please provide the password."],
        unique: false,
      },
  })

  module.exports = mongoose.model.Secrets || mongoose.model("Secrets", SecretsSchema);
  