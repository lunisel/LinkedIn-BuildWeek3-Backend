import express from "express";
import createError from "http-errors";
import multer from "multer";
import json2csv from "json2csv";
import { mediaStorage } from "../../utils/mediaStorage.js"
import ExperienceModel from "./schema.js";
import UserModel from "../user/schema.js";


const Json2csvParser = json2csv.Parser;
const experiencesRouter = express.Router();

experiencesRouter.get("/:userId/experiences", async (req, res, next) => {
    try {
        const profile = await UserModel.findById(req.params.userId)
        if (profile) {
            res.send(profile);
        } else {
            next(
                createError(404, `Profile with id: ${req.params.userId} not found`)
            );
        }
    } catch (error) {
        next(createError(500, "Error in getting experiences"));
    }
})
experiencesRouter.post("/:userId/experiences", async (req, res, next) => {
    try {
        const newExperience = new ExperienceModel({ ...req.body, updatedAt: new Date(), createdAt: new Date() })
        const updatedExperience = await UserModel.findByIdAndUpdate(req.params.userId, {
            $push: {
                experiences: newExperience
            }
        },
            {
                new: true,
                runValidators: true
            })
        if (updatedExperience) {
            console.log(updatedExperience);
            res.status(201).send(newExperience)
        }
        else {
            res.status(404).send(`profile with userid: ${req.params.userId} not found`)
        }
    } catch (error) {
        next(createError(500, "Error in posting experience details"))
    }
})
experiencesRouter.get("/:userId/experiences/CSV", async (req, res, next) => {
    // res.send('ok')
    try {
        const source = await UserModel.findById(req.params.userId)
        console.log(source);
        if (source) {
            const jsonData = JSON.parse(JSON.stringify(source.experiences))
            const fields = ["_id", "role", "company", "description", "area", "username", "startDate", "endDate"]
            const options = { fields }
            const json2csvParser = new Json2csvParser(options)
            const csvData = json2csvParser.parse(jsonData)
            res.setHeader("Content-Disposition", "attachment; filename = experiences.csv")
            res.set("Content-Type", "text/csv")
            res.status(200).end(csvData)
        } else {
            res.status(404).send("source not found")
        }

    } catch (error) {
        next(createError(500, "Error in downloading CSV file"))
        console.log(error);
    }
})

experiencesRouter.get("/:userId/experiences/:expId", async (req, res, next) => {
    try {
        const experience = await UserModel.findById(req.params.userId, {
            experiences: {
                $elemMatch: { _id: req.params.expId }
            },
            _id: 0
        })

        if (experience) {
            res.send(experience.experiences[0])
        } else {
            res.status(404).send(`experience with id: ${req.params.expId} not found`)
        }
    } catch (error) {
        console.log(error);
        next(createError(500, "Error in getting single experience"))
    }
})
const uploadOnCloudinary = multer({ storage: mediaStorage }).single("experience")
experiencesRouter.post("/:userId/experiences/:expId/picture", uploadOnCloudinary, async (req, res, next) => {
    try {

        const userId = req.params.userId
        const experienceId = req.params.expId
        const updateExperience = await UserModel.findOneAndUpdate({
            _id: userId,
            "experiences._id": experienceId
        }, {
            $set: {
                "experiences.$.image": req.file.path
            }
        },
            {
                new: true
            })

        const updatedexperience = await UserModel.findById(req.params.userId, {
            experiences: {
                $elemMatch: { _id: req.params.expId }
            },
            _id: 0
        })

        if (updateExperience) {
            res.send(updatedexperience.experiences[0])
        }
        else {
            res.status(404).send(`experience with id: ${req.params.expId} not found`)
        }
    } catch (error) {
        next(createError(500, "Error in uploading experience image"))
    }
})

// experiencesRouter.post(
//     "/:userId/experiences/:expId/picture",
//     multer({ storage: mediaStorage }).single("image"),
//     async (req, res, next) => {
//         try {
//             console.log("TRYING TO POST PROFILE PICTURE");
//             const modifiedExperience = await ExperienceModel.findByIdAndUpdate(
//                 req.params.expId,
//                 { image: req.file.path },
//                 {
//                     new: true,
//                 }
//             );

//             if (modifiedExperience) {
//                 res.send(modifiedExperience);
//             } else {
//                 next(
//                     createError(404, `Profile with id ${req.params.userId} not found!`)
//                 );
//             }
//         } catch (error) {
//             next(error);
//         }
//     }
// );

experiencesRouter.put("/:userId/experiences/:expId", async (req, res, next) => {
    try {
        const userId = req.params.userId
        const experienceId = req.params.expId
        const updateProfileExperience = await UserModel.findById(userId, {
            experiences: {
                $elemMatch: {
                    _id: experienceId
                }
            },
            _id: 0
        })
        const toUpdateExp = updateProfileExperience.experiences[0].toObject()
        console.log(toUpdateExp);
        const updateExperience = await UserModel.findOneAndUpdate({
            _id: userId,
            "experiences._id": experienceId
        }, {
            $set: {
                "experiences.$": {
                    ...toUpdateExp, ...req.body, updatedAt: new Date()
                }
            }
        },
            {
                new: true,
                runValidators: true
            }
        )
        const updatedexperience = await UserModel.findById(req.params.userId, {
            experiences: {
                $elemMatch: { _id: req.params.expId }
            },
            _id: 0
        })

        if (updateProfileExperience) {
            res.status(200).send(updatedexperience.experiences[0])
        }
        else {
            next(createError(404, "Post not found"))
        }
    } catch (error) {
        next(createError(500, "Error in updating experience details"))
    }
})

experiencesRouter.delete("/:userId/experiences/:expId", async (req, res, next) => {
    try {
        const experienceToDelete = await UserModel.findById(req.params.userId, {
            experiences: {
                $elemMatch: { _id: req.params.expId }
            }
        })
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
        next(createError(500, "Error in deleting experience details"))
    }
})





export default experiencesRouter;
