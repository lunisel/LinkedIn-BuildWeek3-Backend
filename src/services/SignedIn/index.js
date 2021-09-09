import express from "express";
import SignInModal from "./schema.js";

const SignInRouter = express.Router();

// if not logged in, we will get the first and only saved id
SignInRouter.get("/", async (req, res, next) => {
    try {
      const login = await SignInModal.find()
      console.log(login[0].identifier.toString())
      res.send(login[0].identifier.toString());
    } catch (error) {
      next(error);
    }
});

SignInRouter.post("/", async (req, res, next) => { 
    try {
      const oldLogin = await SignInModal.find()
      console.log(oldLogin)
      if (oldLogin.length>0) {
          const oldLoginId = oldLogin[0]._id 
          console.log(oldLoginId)
          const deletedOldLogin = await SignInModal.findByIdAndDelete(oldLoginId)
          if (deletedOldLogin) {
              const newLogin = new SignInModal(req.body);
              const { _id } = await newLogin.save();  
              res.status(201).send({"UPDATED ==> NEW ID": _id});
          } else {
              res.status(404).send(`PROBLEMS DELETING OLD SIGN IN INFO, CHECK DATABASE`);
          }
      } else {
        const newLogin = new SignInModal(req.body);
        const { _id } = await newLogin.save();  
        res.status(201).send({"CREATED ==> ID": _id});
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