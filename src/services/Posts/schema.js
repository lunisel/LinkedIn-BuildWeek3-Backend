import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      // required: [true, "Name is requered"],
    },
    surname: {
      type: String,
      // required: [true, "Surname is requered"],
    },
    email: {
      type: String,
      // required: [true, "Email is requered"],
    },
    bio: {
      type: String,
    },
    title: {
      type: String,
    },
    area: {
      type: String,
    },
    image: {
      type: String,
    },
    username: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const postSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, "Text its need it"],
    },
    username: {
      type: String,
    },

    user: [userSchema],
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default model("post", postSchema);
