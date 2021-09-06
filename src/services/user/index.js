import express from "express";
import UserModel from "./schema.js";
import multer from "multer"
import { mediaStorage } from "../../utils/mediaStorage.js"

const userRouter = express.Router();

userRouter.get("/", async (req, resp, next) => {
  try {
    const users = await UserModel.find({});
    resp.send(users);
  } catch (err) {
    next(err);
  }
});

userRouter.post("/", async (req, resp, next) => {
  try {
    const newUser = new UserModel(req.body);
    const { _id } = await newUser.save();

    resp.status(201).send({ _id });
  } catch (err) {
    next(err);
  }
});

// Replace user profile picture (name = profile)
userRouter.post("/:userId/picture", multer({ storage: mediaStorage }).single("image"), async(req,res,next) => { 
    try {
      console.log("TRYING TO POST PROFILE PICTURE")
      const modifiedUser = await UserModel.findByIdAndUpdate(req.params.userId, {image: req.file.path}, {
        new: true
      })
      if (modifiedUser) {
        res.send(modifiedUser)
      } else {
        next(createError(404, `Profile with id ${req.params.userId} not found!`))
      }  
    } catch (error) {
      next(error)
    }
})

export default userRouter

