import mongoose from "mongoose";
import pkg from "validator";
import { ExperienceSchema } from "../experience/schema.js"
const { isEmail } = pkg;

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: {
      type: String,
      required: true,
      validate: [isEmail, `invalid email`],
      unique: true,
      lowercase: true,
    },
    bio: { type: String, required: true },
    title: { type: String, required: true },
    area: { type: String, required: true },
    image: {
      type: String,
      default: `https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png`,
    },
    username: { type: String, required: true },
    experiences: [ExperienceSchema]
  },
  {
    timestamps: true,
  }
);

export default model("User", userSchema);
