import express from "express"
import createError from "http-errors"
import multer from "multer"
import json2csv from "json2csv";
import { mediaStorage } from "../../utils/mediaStorage.js"
import UserModel from "../user/schema.js";

const Json2csvParser = json2csv.Parser;
 
const experiencesRouter = express.Router();

experiencesRouter.get("/:userId/experiences", async(req,res,next) => {
  try {
    const User = await UserModel.findById(req.params.userId).populate("experiences")        
    if (User) {
      res.send(User.experiences)
    } else {
      res.status(404).send(`User with id ${req.params.userId} not found`)
    }
  } catch (error) {
    next(error);
  }
})
experiencesRouter.post("/:userId/experiences", async(req,res,next) => {
  try {  
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.userId, 
      { $push: { experiences: req.body } },
      { new : true,
        runValidators: true 
      }
    ).populate("experiences")
    if (updatedUser) {
      res.send(updatedUser)
    } else {
      res.status(404).send(`User with id ${req.params.userId} not found`)
    }   
  } catch (error) {
    next(error);
  }
})
experiencesRouter.get("/:userId/experiences/CSV", async (req, res, next) => {
  try {
      const source = await UserModel.findById(req.params.userId)
      if (source) {
          const jsonData = JSON.parse(JSON.stringify(source.experiences))
          const fields = ["_id", "role", "company", "description", "area", "username", "startDate", "endDate"]
          const options = { fields }
          const json2csvParser = new Json2csvParser(options)
          const csvData = json2csvParser.parse(jsonData)
          res.setHeader("Content-Disposition", "attachment; filename = experiences.csv")
          res.set("Content-Type", "text/csv")
          res.status(200).send(csvData)
      } else {
          res.status(404).send("source not found")
      }
  } catch (error) {
    next(error);
  }
}) 
experiencesRouter.get("/:userId/experiences/:expId", async(req,res,next) => {
  try {
    const User = await UserModel.findById(req.params.userId)  
    if (User) {
      const experience = await UserModel.findById(req.params.userId, {
        experiences: {
            $elemMatch: { _id: req.params.expId }
        },
        _id: 0
      })
      if (experience) {
          res.send(experience.experiences[0])
      } else {
        next(createError(404, `Experience with id ${req.params.expId} not found`))
      }  
    } else {
      next(createError(404, `User with id ${req.params.userId} not found`))
    }
  } catch (error) {
    next(createError(500, "Error in getting single experience"))
  }
})
experiencesRouter.put("/:userId/experiences/:expId", async(req,res,next) => {
  try { 
    // FIND USER 
    const User = await UserModel.findById(req.params.userId)  
    // IF USER FIND EXPERIENCE
    if (User) {
      const foundExperience = User.experiences.find(e => e._id.toString() === req.params.expId)
      if (foundExperience) { 
        const updatedExperience = { ...foundExperience.toObject(), ...req.body }
        console.log("UPDATING ==> ", updatedExperience)
        const updatedUser = await UserModel.findOneAndUpdate(
          { _id: req.params.userId, "experiences._id": req.params.expId },
          {
            $set: { "experiences.$": updatedExperience } 
          },
          { 
            new : true,
            runValidators: true 
          }
        )
        console.log("UPDATED ==> ", updatedUser) // <== not receing this.
        res.send(updatedUser)
      } else {
        res.status(404).send(`Experience with id ${req.params.expId} not found`)
      }
      // const userExperiences = await UserModel.findById(req.params.userId, {
      //   experiences: {
      //       $elemMatch: { _id: req.params.expId }
      //   },
      // })
      // // IF EXPERIENCE UPDATE
      // if (userExperiences) {
      //   const experiences = userExperiences.experiences
      //   const updatedExperience = { ...experiences[0].toObject(), ...req.body}
      //   console.log("updated experience to", updatedExperience)
      //   await UserModel.findOneAndUpdate(
      //     { _id: req.params.userId, "experiences._id": req.params.expId },
      //     {
      //       $set: { "experiences.$": updatedExperience } 
      //     },
      //     { new : true,
      //       runValidators: true 
      //     }
      //   )
      //   console.log("updated user experience") 
      //   res.send(updatedExperience)
      // } else {
      //   res.status(404).send(`Experience with id ${req.params.expId} not found`)
      // }
    } else {
      res.status(404).send(`User with id ${req.params.userId} not found`)
    }
  } catch (error) {
    next(error)
  }
})
experiencesRouter.delete("/:userId/experiences/:expId", async(req,res,next) => {
  try {  
    const User = await UserModel.findById(req.params.userId)
    console.log("user found")
    if (User) {
      const experience = await UserModel.findById(req.params.userId, {
        experiences: {
            $elemMatch: { _id: req.params.expId }
        },
      })
      if (experience) {
        console.log("experience found")
        await UserModel.findByIdAndUpdate(
          req.params.userId,
          { 
            $pull: { experiences: { _id: req.params.expId } } 
          },
          { new : true }
        )
        res.status(204).send()
      } else {
        res.status(404).send(`Experience with id ${req.params.expId} not found`)
      }
    } else {
      res.status(404).send(`User with id ${req.params.userId} not found`)
    }
  } catch (error) {
    next(error)
  }
})
experiencesRouter.post("/:userId/experiences/:expId/picture", multer({ storage: mediaStorage }).single("image"), async(req,res,next) => { 
  try {
    // FIND USER
    const User = await UserModel.findById(req.params.userId)
    // IF USER FIND EXPERIENCE
    if (User) {
      const experience = await UserModel.findById(req.params.userId, {
        experiences: {
            $elemMatch: { _id: req.params.expId }
        },
    })
    // IF EXPERIENCE UPDATE IMAGE PATH
      if (experience) {
        await UserModel.findOneAndUpdate(
          { _id: req.params.userId, "experiences._id": req.params.expId },
          {
            $set: { "experiences.$.image": req.file.path } 
          },
          { new : true,
            runValidators: true 
          }
        )
        res.status(204).send()
      } else {
        res.status(404).send(`Experience with id ${req.params.expId} not found`)
      }
    } else {
      res.status(404).send(`User with id ${req.params.userId} not found`)
    }
  } catch (error) {
    next(error)
  }
})

export default experiencesRouter

