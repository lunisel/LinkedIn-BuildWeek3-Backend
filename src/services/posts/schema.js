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
      default:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Facebook_icon.svg/1200px-Facebook_icon.svg.png",
    },
  },
  {
    timestamps: true,
  }
);

export default model("post", postSchema);
