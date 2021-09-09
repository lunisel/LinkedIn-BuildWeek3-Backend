import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import userRouter from "./services/user/index.js";
import logginRouter from "./services/Loggin/loggin.js";
import experiencesRouter from "./services/experience/experience.js";
import educationRouter from "./services/education/education.js";
import postRouter from "./services/Posts/index.js";
import SignInRouter from "./services/SignedIn/index.js";

import {
  notFoundErrorHandler,
  badRequestErrorHandler,
  catchAllErrorHandler,
} from "./errorMiddlewares.js";

const port = process.env.PORT || 3000;
const mongoConnection = process.env.MONGO_CONNECTION_STRING;

const server = express();

server.use(cors());
server.use(express.json());

// ****************** ROUTES ***********************
server.use("/profile", userRouter, experiencesRouter, educationRouter);
server.use("/posts", postRouter);
server.use("/loggin", logginRouter);
server.use("/signin", SignInRouter);
// ****************** ERROR HANDLERS ***********************
server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(catchAllErrorHandler);

mongoose.connect(mongoConnection);

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to mongo!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log("Server is running on port ", port);
  });
});

mongoose.connection.on("error", (err) => {
  console.log("MONGO ERROR: ", err);
});
