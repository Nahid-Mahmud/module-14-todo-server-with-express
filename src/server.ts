import { MongoClient, ServerApiVersion } from "mongodb";
import app from "./app";
require("dotenv").config();

let server;

const port = 5000;

const uri = process.env.MONGODB_URI as string;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const bootstrapServer = async () => {
  await client.connect().then(() => {
    console.log("Connected to MongoDB");
  });
  const db = await client.db("todosDB");
  const collection = db.collection("todos");
  // const collection = db.collection("todos").insertOne({
  //   title: "Sample Todo",

  //   body: "This is a sample todo item",
  // });
  // console.log(collection);
  // console.log(db);
  server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

bootstrapServer();
