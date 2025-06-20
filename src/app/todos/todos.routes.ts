import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { client } from "../../config/mongodb";
import { ObjectId } from "mongodb";

const todosRouter = express.Router();

todosRouter.get("/", async (req: Request, res: Response) => {
  const db = client.db("todoDb");
  const collection = db.collection("todos");

  const todos = await collection.find({}).toArray();

  console.log(todos);

  res.json({
    todos,
    message: "Todos fetched successfully",
  });
});

todosRouter.post("/create-todo", async (req: Request, res: Response) => {
  const { title, description, priority } = req.body;
  // console.log(title);
  const db = await client.db("todoDb");

  const collection = db.collection("todos");

  await collection.insertOne({
    title,
    description,
    priority,
    isCompleted: false,
    createdAt: new Date().toISOString(),
  });

  //   res.send("Hello, World!");
  res
    .status(201)
    .json({ message: "Todo created successfully", todo: { title, description, priority, isCompleted: false } });
});

todosRouter.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const db = await client.db("todoDb");
  const collection = await db.collection("todos");

  const todo = await collection.findOne({
    _id: new ObjectId(id),
  });

  if (!todo) {
    res.status(404).json({ message: "Todo not found" });
  }

  res.status(200).json({ todo, message: "Todo fetched successfully" });
});

// update todo

todosRouter.patch("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  // const { title, description, priority, isCompleted } = req.body;

  const updateFields = Object.keys(req.body);

  const db = await client.db("todoDb");
  const collection = await db.collection("todos");

  const updateData: any = {};
  updateFields.forEach((field) => {
    updateData[field] = req.body[field];
  });

  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData },
    {
      upsert: true,
    }
  );

  if (result.matchedCount === 0) {
    res.status(404).json({ message: "Todo not found" });
  }

  res.status(200).json({
    message: "Todo updated successfully",
    result,
  });
});

todosRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const db = await client.db("todoDb");
  const collection = await db.collection("todos");
  const result = await collection.deleteOne({
    _id: new ObjectId(id),
  });

  if (result.deletedCount === 0) {
    res.status(404).json({ message: "Todo not found" });
  }

  res.status(200).json({
    message: "Todo deleted successfully",
    result,
  });
});

export default todosRouter;
