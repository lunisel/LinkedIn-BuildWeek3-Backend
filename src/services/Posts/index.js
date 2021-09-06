import express from "express";
import postModal from "./schema.js";
import createHttpError from "http-errors";
const postRouter = express.Router();

postRouter.get("/", async (req, res, next) => {
  try {
    const getPosts = await postModal.find();
    res.send(getPosts);
  } catch (error) {
    next(error);
  }
});

postRouter.post("/:userId", async (req, res, next) => {
  try {
    const post = await postModal.create({ ...req.body });

    res.send(post.text);
  } catch (error) {
    next(error);
  }
});

postRouter.get("/:postId", async (req, res, next) => {
  try {
    const getSinglePost = await postModal.findById(req.params.postId);

    if (getSinglePost) {
      res.status(201).send(getSinglePost);
    } else {
      res.status(401).send(`Post with the id ${req.params.postId} not found!`);
    }
  } catch (error) {
    next(error);
  }
});

export default postRouter;
