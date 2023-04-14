const mongoose = require("mongoose");

const SecretsSchema = new mongoose.Schema({
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
  memo: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Secrets", SecretsSchema);
