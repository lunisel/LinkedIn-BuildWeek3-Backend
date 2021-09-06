import express from "express";
import postModal from "./schema.js";
const postRouter = express.Router();

postRouter.get("/", async (req, res, next) => {
  try {
    const getPosts = await postModal.find();
    res.send(getPosts);
  } catch (error) {
    next(error);
  }
});

postRouter.post("/", async (req, res, next) => {
  try {
    const post = await postModal.create(req.body);

    res.send(post.text);
  } catch (error) {
    next(error);
  }
});

export default postRouter;
