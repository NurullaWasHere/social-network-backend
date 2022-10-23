const mongoose = require("mongoose");
const { Schema } = mongoose;

const InstSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  }
);

module.exports = mongoose.model('Inst', InstSchema);