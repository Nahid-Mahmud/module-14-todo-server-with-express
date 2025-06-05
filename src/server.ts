import { MongoClient, ServerApiVersion } from "mongodb";
import app from "./app";
import { client } from "./config/mongodb";
require("dotenv").config();

let server;

const port = 5000;

const bootstrapServer = async () => {
  await client.connect().then(() => {
    console.log("Connected to MongoDB");
  });
  server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

bootstrapServer();
