import mongoose from "mongoose";

const { Schema, model } = mongoose;

export const EducationSchema = new Schema({
  institute: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  years: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    default:
      "https://coursereport-production.imgix.net/uploads/school/logo/1045/original/Strive_-_logosquareblack.png?w=200&h=200&dpr=1&q=75"
  },
});

export default model("Education", EducationSchema);
