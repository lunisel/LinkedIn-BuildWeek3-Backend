import express from "express";
import createError from "http-errors";
import multer from "multer";
import json2csv from "json2csv";
import { mediaStorage } from "../../utils/mediaStorage.js"
import EducationModal from "./schema.js";
import UserModel from "../user/schema.js";

const educationRouter = express.Router();

educationRouter.get("/:userId/education", async (req, res, next) => {
    try {
        const profile = await UserModel.findById(req.params.userId)
        if (profile) {
            res.send(profile.education);
        } else {
            next(
                createError(404, `Profile with id: ${req.params.userId} not found`)
            );
        }
    } catch (error) {
        next(createError(500, "Error in getting education"));
    }
})
educationRouter.post("/:userId/education", async (req, res, next) => {
    try {
        console.log("attempting to post")
        const newEducation = new EducationModal({ ...req.body, updatedAt: new Date(), createdAt: new Date() })
        console.log(newEducation)
        const updatedEducation = await UserModel.findByIdAndUpdate(req.params.userId, {
            $push: {
                education: newEducation
            }
        },
            {
                new: true,
                runValidators: true
            })
        if (updatedEducation) {
            console.log(updatedEducation);
            res.status(201).send(newEducation)
        }
        else {
            res.status(404).send(`profile with userid: ${req.params.userId} not found`)
        }
    } catch (error) {
        next(createError(500, "Error in posting education details"))
    }
})

educationRouter.get("/:userId/education/:eduId", async (req, res, next) => {
    try {
        const education = await UserModel.findById(req.params.userId, {
            education: {
                $elemMatch: { _id: req.params.eduId }
            },
            _id: 0
        })

        if (education) {
            res.send(education.education[0])
        } else {
            res.status(404).send(`education with id: ${req.params.eduId} not found`)
        }
    } catch (error) {
        console.log(error);
        next(createError(500, "Error in getting single education"))
    }
})
const uploadOnCloudinary = multer({ storage: mediaStorage }).single("image")
educationRouter.post("/:userId/education/:eduId/picture", uploadOnCloudinary, async (req, res, next) => {
    try {

        const userId = req.params.userId
        const educationId = req.params.eduId
        const updateEducation = await UserModel.findOneAndUpdate({
            _id: userId,
            "education._id": educationId
        }, {
            $set: {
                "education.$.image": req.file.path
            }
        },
            {
                new: true
            })

        const updatededucation = await UserModel.findById(req.params.userId, {
            education: {
                $elemMatch: { _id: req.params.eduId }
            },
            _id: 0
        })

        if (updateEducation) {
            res.send(updatededucation.education[0])
        }
        else {
            res.status(404).send(`education with id: ${req.params.eduId} not found`)
        }
    } catch (error) {
        next(createError(500, "Error in uploading education image"))
    }
})

educationRouter.post(
    "/:userId/education/:eduId/picture",
    multer({ storage: mediaStorage }).single("image"),
    async (req, res, next) => {
        try {
            console.log("TRYING TO POST EDUCATION PICTURE");
            const modifiedEducation = await EducationModal.findByIdAndUpdate(
                req.params.eduId,
                { image: req.file.path },
                {
                    new: true,
                }
            );

            if (modifiedEducation) {
                res.send(modifiedEducation);
            } else {
                next(
                    createError(404, `Profile with id ${req.params.userId} not found!`)
                );
            }
        } catch (error) {
            next(error);
        }
    }
);

educationRouter.put("/:userId/education/:eduId", async (req, res, next) => {
    try {
        const userId = req.params.userId
        const educationId = req.params.eduId
        const updateProfileEducation = await UserModel.findById(userId, {
            education: {
                $elemMatch: {
                    _id: educationId
                }
            },
            _id: 0
        })
        const toUpdateEdu = updateProfileEducation.education[0].toObject()
        console.log(toUpdateEdu);
        const updateExperience = await UserModel.findOneAndUpdate({
            _id: userId,
            "education._id": educationId
        }, {
            $set: {
                "education.$": {
                    ...toUpdateEdu, ...req.body, updatedAt: new Date()
                }
            }
        },
            {
                new: true,
                runValidators: true
            }
        )
        const updatededucation = await UserModel.findById(req.params.userId, {
            education: {
                $elemMatch: { _id: req.params.eduId }
            },
            _id: 0
        })

        if (updateProfileEducation) {
            res.status(200).send(updatededucation.education[0])
        }
        else {
            next(createError(404, "Education not found"))
        }
    } catch (error) {
        next(createError(500, "Error in updating education details"))
    }
})

educationRouter.delete("/:userId/education/:eduId", async (req, res, next) => {
    try {
        const educationToDelete = await UserModel.findById(req.params.userId, {
            education: {
                $elemMatch: { _id: req.params.eduId }
            }
        })
        const profile = await UserModel.findByIdAndUpdate(
            req.params.userId,
            {
                $pull: {
                    education: {
                        _id: req.params.eduId,
                    },
                },
            },
            {
                new: true,
            }
        );
        if (profile) {
            res.send(educationToDelete.education[0]);
        } else {
            next(createError(404, `education not found`));
        }
    } catch (error) {
        next(createError(500, "Error in deleting education details"))
    }
})





export default educationRouter;
