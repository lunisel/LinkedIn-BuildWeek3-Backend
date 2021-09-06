import express from "express";
import UserModel from "./schema.js";
import multer from "multer";
import { mediaStorage } from "../../utils/mediaStorage.js";
import { getPDFReadableStream } from "../../utils/pdf.js";
import { pipeline } from "stream";

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

userRouter.get("/:id", async (req, resp, next) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (user) {
      resp.send(user);
    } else {
      next(createError(404, `User with id ${req.params.id} not found!`));
    }
  } catch (err) {
    next(err);
  }
});

userRouter.put("/:id", async (req, resp, next) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (updatedUser) {
      resp.send(updatedUser);
    } else {
      next(createError(404, `User with id ${req.params.id} not found!`));
    }
  } catch (err) {
    next(err);
  }
});

userRouter.delete("/:id", async (req, resp, next) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (user) {
      resp.status(204).send();
    } else {
      next(createError(404, `User with id ${req.params.id} not found!`));
    }
  } catch (err) {
    next(err);
  }
});

userRouter.post(
  "/:userId/picture",
  multer({ storage: mediaStorage }).single("image"),
  async (req, res, next) => {
    try {
      console.log("TRYING TO POST PROFILE PICTURE");
      const modifiedUser = await UserModel.findByIdAndUpdate(
        req.params.userId,
        { image: req.file.path },
        {
          new: true,
        }
      );
      if (modifiedUser) {
        res.send(modifiedUser);
      } else {
        next(
          createError(404, `Profile with id ${req.params.userId} not found!`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

userRouter.get("/:id/CV", async (req, res, next) => {
    try {
      const user = await UserModel.findById(req.params.id);
      const filename = "CV.pdf"
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`) // tells browser to open SAVE-AS dialogue
      const source = getPDFReadableStream(user) 
      const destination = res
      pipeline(source, destination, err => {
        if (err) next(err)
      })
    } catch (error) {
        next(error)
    }
})

export default userRouter;
