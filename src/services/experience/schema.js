import mongoose from "mongoose";

const { Schema, model } = mongoose;

export const ExperienceSchema = new Schema({
  role: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Facebook_icon.svg/1200px-Facebook_icon.svg.png",
  },
});

export default model("Experience", ExperienceSchema);
