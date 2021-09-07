import express from "express";
import createError from "http-errors";
import multer from "multer";
import json2csv from "json2csv";

import ExperienceModel from "./schema.js";
import UserModel from "../user/schema.js";

const Json2csvParser = json2csv.Parser;
const experiencesRouter = express.Router();

experiencesRouter
  .route("/:userName/experiences")
  .get(async (req, res, next) => {
    try {
      const findUser = await ExperienceModel.find();
      res.send(findUser);

      console.log("===================HI============================");
      // console.log(findUser);
      // const profile = await UserModel.findById(req.params.userId);
      // if (profile) {
      //   res.send(profile.experiences);
      // } else {
      //   next(
      //     createError(404, `Profile with id: ${req.params.userId} not found`)
      //   );
      // }
    } catch (error) {
      next(createError(500, "Error in getting experiences"));
    }
  })
  .post(async (req, res, next) => {
    try {
      const findUser = await UserModel.findOne({
        username: req.params.userName,
      });

      if (findUser) {
        const newPostExperience = await ExperienceModel.create({
          ...req.body,
          username: findUser.username,
        });

        res.status(201).send(newPostExperience);
      } else {
        res
          .status(404)
          .send(`profile with userid: ${req.params.userName} not found`);
      }

      // const newExperience = new ExperienceModel({
      //   ...req.body,
      //   updatedAt: new Date(),
      //   createdAt: new Date(),
      // });
      // const updatedExperience = await UserModel.findByIdAndUpdate(
      //   req.params.userId,
      //   {
      //     $push: {
      //       experiences: newExperience,
      //     },
      //   },
      //   {
      //     new: true,
      //     runValidators: true,
      //   }
      // );
      // if (updatedExperience) {
      //   console.log(updatedExperience);
      //   res.status(201).send(newExperience);
      // } else {
      //   res
      //     .status(404)
      //     .send(`profile with userid: ${req.params.userId} not found`);
      // }
    } catch (error) {
      next(createError(500, "Error in posting experience details"));
    }
  });

experiencesRouter
  .route("/:userName/experiences/:expId")
  .get(async (req, res, next) => {
    try {
      const experience = await ExperienceModel.findById(req.params.expId);
      if (experience) {
        res.status(201).send(experience);
      } else {
        res.send(`profile with userid: ${req.params.expId} not found`);
      }

      // const experience = await UserModel.findById(req.params.userId, {
      //   experiences: {
      //     $elemMatch: { _id: req.params.expId },
      //   },
      //   _id: 0,
      // });

      // if (experience) {
      //   res.send(experience.experiences[0]);
      // } else {
      //   res
      //     .status(404)
      //     .send(`experience with id: ${req.params.expId} not found`);
      // }
    } catch (error) {
      console.log(error);
      next(createError(500, "Error in getting single experience"));
    }
  })

  .put(async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const experienceId = req.params.expId;
      const updateUserExperience = await UserModel.findById(userId, {
        experiences: {
          $elemMatch: {
            _id: experienceId,
          },
        },
        _id: 0,
      });
      const toUpdateExp = updateUserExperience.experiences[0].toObject();
      const updateExperience = await UserModel.findOneAndUpdate(
        {
          _id: userId,
          "experiences._id": experienceId,
        },
        {
          $set: {
            "experiences.$": {
              ...toUpdateExp,
              ...req.body,
              updatedAt: new Date(),
            },
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );
      const updatedexperience = await UserModel.findById(req.params.userId, {
        experiences: {
          $elemMatch: { _id: req.params.expId },
        },
        _id: 0,
      });
      if (updateUserExperience) {
        res.status(200).send(updatedexperience.experiences[0]);
      } else {
        next(createError(404, "Post not found"));
      }
    } catch (error) {
      next(createError(500, "Error in updating experience details"));
    }
  })

  .delete(async (req, res, next) => {
    try {
      const experienceToDelete = await UserModel.findById(req.params.userId, {
        experiences: {
          $elemMatch: { _id: req.params.expId },
        },
      });
      const profile = await UserModel.findByIdAndUpdate(
        req.params.userId,
        {
          $pull: {
            experiences: {
              _id: req.params.expId,
            },
          },
        },
        {
          new: true,
        }
      );
      if (profile) {
        res.send(experienceToDelete.experiences[0]);
      } else {
        next(createError(404, `experience not found`));
      }
    } catch (error) {
      next(createError(500, "Error in deleting experience details"));
    }
  });

export default experiencesRouter;