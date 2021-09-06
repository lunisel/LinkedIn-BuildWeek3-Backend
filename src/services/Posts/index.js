import express from "express";
import postModal from "./schema.js";
import multer from "multer"
import { mediaStorage } from "../../utils/mediaStorage.js"

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

// Replace post image
postRouter.post("/:postId", multer({ storage: mediaStorage }).single("image"), async(req,res,next) => { 
    try {
        console.log("TRYING TO POST POST PICTURE")
        const modifiedPost = await postModal.findByIdAndUpdate(req.params.postId, {image: req.file.path}, {
            new: true
        })
        if (modifiedPost) {
            res.send(modifiedPost)
        } else {
            next(createError(404, `Post with id ${req.params.postId} not found!`))
        }  
    } catch (error) {
        next(error)
    }
})

export default postRouter;