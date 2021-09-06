import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import userRouter from "./user/index.js";

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

server.use("/profile", userRouter);

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