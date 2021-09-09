import express from "express";
import SignInModal from "./schema.js";

const SignInRouter = express.Router();

// if not logged in, we will get the first and only saved id
SignInRouter.get("/", async (req, res, next) => {
    try {
      const login = await SignInModal.find()
      res.send(login[0].identifier);
    } catch (error) {
      next(error);
    }
});

SignInRouter.post("/", async (req, res, next) => {
    try {
      const oldLogin = await SignInModal.find()
      if (oldLogin) {
          const oldLoginId = oldLogin[0]._id 
          console.log(oldLoginId)
          const deletedOldLogin = await SignInModal.findByIdAndDelete(oldLoginId)
          if (deletedOldLogin) {
              const newLogin = new SignInModal(req.body);
              const { _id } = await newLogin.save();  
              res.status(201).send({ _id });
          } else {
            res.status(404).send(`PROBLEMS DELETING OLD SIGN IN INFO, CHECK DATABASE`);
          }
      } else {
        res.status(404).send(`NO DATA FOUND FOR SIGNINMODAL, CHECK DATABASE`);
      }
    } catch (err) {
      next(err);
    }
  });

// SignInRouter.post("/", async (req, res, next) => {
//     try {
//       console.log("posting new identifier")
//       const newLogin = await newLogin.create(req.body)
//       console.log(newLogin)
//       const {_id} = await newLogin.save()
//       res.send({_id})
//     } catch (error) {
//       next(error); 
//     }
// });

export default SignInRouter