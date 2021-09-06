import mongoose from "mongoose";
const { Schema, model } = mongoose;

const postSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, "Text its need it"],
    },
    username: {
      type: String,
    },

    user: { type: Schema.Types.ObjectId, ref: "User" },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default model("post", postSchema);
