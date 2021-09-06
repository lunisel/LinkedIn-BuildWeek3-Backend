import express from "express";
import UserModel from "./schema.js";

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

export default userRouter;
