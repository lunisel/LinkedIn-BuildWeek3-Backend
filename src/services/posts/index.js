import express from "express";
import PostModel from "./schema.js";
import multer from "multer"
import { mediaStorage } from "../../utils/mediaStorage.js"

const postRouter = express.Router();

// Replace post image
postRouter.post("/:postId", multer({ storage: mediaStorage }).single("image"), async(req,res,next) => { 
    try {
      console.log("TRYING TO POST POST PICTURE")
      const modifiedPost = await PostModel.findByIdAndUpdate(req.params.postId, {image: req.file.path}, {
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

export default postRouter