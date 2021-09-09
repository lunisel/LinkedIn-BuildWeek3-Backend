import express from "express";
import userModal from "../user/schema.js";

const logginRouter = express.Router();

logginRouter.get("/:email", async (req, res, next) => {
  try {
    const findUserEmail = await userModal.find({ email: req.params.email });
    res.send(findUserEmail);
  } catch (error) {
    // console.error(error);
  }
});

export default logginRouter;
