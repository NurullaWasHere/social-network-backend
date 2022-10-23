const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostSchema = new Schema(
  {
    imageUrl: {
      type: String,
    },
    text: {
      type: String,
      required: true,
      unique: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required:true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", PostSchema);
