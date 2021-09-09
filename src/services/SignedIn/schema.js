import mongoose from "mongoose";
const { Schema, model } = mongoose;

const SignInSchema = new Schema(
  {
    identifier: { type: String, required: true, }
  }
);

export default model("signin", SignInSchema);