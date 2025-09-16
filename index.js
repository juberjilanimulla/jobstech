import express from "express";
import cors from "cors";
import dbConnect from "./db.js";
import config from "./config.js";
import morgan from "morgan";

const app = express();
const port = config.PORT;

dbConnect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.log("Unable to connected server", error);
  });
