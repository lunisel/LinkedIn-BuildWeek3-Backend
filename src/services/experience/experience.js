import express from "express";
import createError from "http-errors";
import multer from "multer";
import json2csv from "json2csv";
import UserModel from "../user/schema.js";
import { mediaStorage } from "../../utils/mediaStorage.js";

const Json2csvParser = json2csv.Parser;
const experiencesRouter = express.Router();

experiencesRouter.get("/:userId/experiences", async (req, res, next) => {
  try {
    const profile = await UserModel.findById(req.params.userId);
    if (profile) {
      res.send(profile.experiences);
    } else {
      next(createError(404, `Profile with id: ${req.params.userId} not found`));
    }
  } catch (error) {
    next(createError(500, "Error in getting experiences"));
  }
});
experiencesRouter.post("/:userId/experiences", async (req, res, next) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.userId,
      { $push: { experiences: req.body } },
      { new: true, runValidators: true }
    ).populate("experiences");
    if (updatedUser) {
      res.status(201).send(updatedUser);
    } else {
      res.status(404).send(`User with id ${req.params.userId} not found`);
    }
  } catch (error) {
    next(error);
  }
});
experiencesRouter.get("/:userId/experiences/CSV", async (req, res, next) => {
  // res.send('ok')
  try {
    const source = await UserModel.findById(req.params.userId);
    console.log(source);
    if (source) {
      const jsonData = JSON.parse(JSON.stringify(source.experiences));
      const fields = [
        "_id",
        "role",
        "company",
        "description",
        "area",
        "username",
        "startDate",
        "endDate",
      ];
      const options = { fields };
      const json2csvParser = new Json2csvParser(options);
      const csvData = json2csvParser.parse(jsonData);
      res.setHeader(
        "Content-Disposition",
        "attachment; filename = experiences.csv"
      );
      res.set("Content-Type", "text/csv");
      res.status(200).end(csvData);
    } else {
      res.status(404).send("source not found");
    }
  } catch (error) {
    next(createError(500, "Error in downloading CSV file"));
    console.log(error);
  }
});

experiencesRouter.get("/:userId/experiences/:expId", async (req, res, next) => {
  try {
    const experience = await UserModel.findById(req.params.userId, {
      experiences: {
        $elemMatch: { _id: req.params.expId },
      },
      _id: 0,
    });

    if (experience.length > 0) {
      res.send(experience.experiences[0]);
    } else {
      res.status(404).send(`experience with id: ${req.params.expId} not found`);
    }
  } catch (error) {
    console.log(error);
    next(createError(500, "Error in getting single experience"));
  }
});
experiencesRouter.put("/:userId/experiences/:expId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const experienceId = req.params.expId;
    const updateProfileExperience = await UserModel.findById(userId, {
      experiences: {
        $elemMatch: {
          _id: experienceId,
        },
      },
      _id: 0,
    });
    const toUpdateExp = updateProfileExperience.experiences[0].toObject();
    console.log(toUpdateExp);
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

    if (updateProfileExperience) {
      res.status(200).send(updatedexperience.experiences[0]);
    } else {
      next(createError(404, "Post not found"));
    }
  } catch (error) {
    next(createError(500, "Error in updating experience details"));
  }
});

experiencesRouter.delete(
  "/:userId/experiences/:expId",
  async (req, res, next) => {
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
        res.status(204).send();
      } else {
        next(createError(404, `experience not found`));
      }
    } catch (error) {
      next(createError(500, "Error in deleting experience details"));
    }
  }
);

experiencesRouter.post(
  "/:userId/experiences/:expId/picture",
  multer({ storage: mediaStorage }).single("image"),
  async (req, res, next) => {
    try {
      // FIND USER
      const User = await UserModel.findById(req.params.userId);
      // IF USER FIND EXPERIENCE
      if (User) {
        const experience = await UserModel.findById(req.params.userId, {
          experiences: {
            $elemMatch: { _id: req.params.expId },
          },
        });
        // IF EXPERIENCE UPDATE IMAGE PATH
        if (experience) {
          await UserModel.findOneAndUpdate(
            { _id: req.params.userId, "experiences._id": req.params.expId },
            {
              $set: { "experiences.$.image": req.file.path },
            },
            { new: true, runValidators: true }
          );
          res.status(204).send();
        } else {
          res
            .status(404)
            .send(`Experience with id ${req.params.expId} not found`);
        }
      } else {
        res.status(404).send(`User with id ${req.params.userId} not found`);
      }
    } catch (error) {
      next(error);
    }
  }
);

export default experiencesRouter;
