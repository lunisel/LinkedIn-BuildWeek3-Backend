import express from "express";
import postModal from "./schema.js";
import "../user/schema.js";
import multer from "multer";
import { mediaStorage } from "../../utils/mediaStorage.js";
import userModal from "../user/schema.js";
const postRouter = express.Router();

postRouter.get("/", async (req, res, next) => {
  try {
    const getPosts = await postModal.find().populate("user");
    res.send(getPosts);
  } catch (error) {
    next(error);
  }
});
postRouter.get("/:postId", async (req, res, next) => {
  try {
    const getPosts = await postModal.findById(req.params.postId);

    if (getPosts) {
      res.status(201).send(getPosts);
    } else {
      res.status(404).send(`Post with the id ${req.params.postId} not found!`);
    }
  } catch (error) {
    next(error);
  }
});

postRouter.post("/", async (req, res, next) => {
  try {
    const searchUser = await userModal.findById(req.body.user);

    if (searchUser) {
      const post = await postModal.create({
        ...req.body,
        username: searchUser.username,
      });
      const { _id } = await post.save();

      res.send({ _id });
    }

    // res.send(post.text);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

postRouter.put("/:postId", async (req, res, next) => {
  try {
    const postModified = await postModal.findByIdAndUpdate(
      req.params.postId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (postModified) {
      res.status(201).send(postModified);
    } else {
      res.status(404).send(`Post with the id ${req.params.postId} not found!`);
    }
  } catch (error) {
    next(error);
  }
});

postRouter.delete("/:postId", async (req, res, next) => {
  try {
    const deletePost = await postModal.findByIdAndDelete(req.params.postId);
    if (deletePost) {
      res.status(201).send("Deleted!");
    } else {
      res.status(404).send(`Post with the id ${req.params.postId} not found!`);
    }
  } catch (error) {
    next(error);
  }
});

// Replace post image
postRouter.post(
  "/:postId",
  multer({ storage: mediaStorage }).single("image"),
  async (req, res, next) => {
    try {
      console.log("TRYING TO POST POST PICTURE");
      const modifiedPost = await postModal.findByIdAndUpdate(
        req.params.postId,
        { image: req.file.path },
        {
          new: true,
        }
      );
      if (modifiedPost) {
        res.send(modifiedPost);
      } else {
        next(createError(404, `Post with id ${req.params.postId} not found!`));
      }
    } catch (error) {
      next(error);
    }
  }
);

export default postRouter;
