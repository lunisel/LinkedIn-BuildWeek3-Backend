import express from "express";
import postModel from "./schema.js";
import multer from "multer"
import { mediaStorage } from "../../utils/mediaStorage.js"

const PostRouter = express.Router();

// Replace post image
PostRouter.post("/:postId", multer({ storage: mediaStorage }).single("image"), async(req,res,next) => { 
    try {
      console.log("TRYING TO POST POST PICTURE")
      const modifiedPost = await postModel.findByIdAndUpdate(req.params.postId, {image: req.file.path}, {
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

export default PostRouter