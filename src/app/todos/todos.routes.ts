import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { client } from "../../config/mongodb";

const todosRouter = express.Router();

const filePath = path.join(__dirname, "../../../src/db/todo.json");

todosRouter.get("/", (req: Request, res: Response) => {
  const data = fs.readFileSync(filePath, "utf-8");
  const todos = JSON.parse(data);

  res.json({
    todos,
    message: "Todos fetched successfully",
  });
});

todosRouter.post("/create-todo", async (req: Request, res: Response) => {
  // const { title, body } = req.body;
  // console.log(title);
  const db = await client.db("todoDb");

  const collection = db.collection("todos");

  await collection.insertOne({
    title: "Mongodb",
    description: "Learning Mongodb",
    priority: "High",
    isCompleted: false,
  });

  const todos = collection.find({}).toArray();

  //   res.send("Hello, World!");
  res.status(201).json(todos);
});

todosRouter.get("/:id", (req: Request, res: Response) => {
  const allTodos = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const requestedTodoId = req.params.id;

  const todo = allTodos.find((t: { id: string }) => t.id === requestedTodoId);

  if (!todo) {
    res.status(404).json({ message: "Todo not found" });
  }

  res.status(200).json(todo);
});

todosRouter.patch("/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const { title } = req.body;
  const allTodos = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const todo = allTodos.find((t: { id: string }) => t.id === id);
  if (!todo) {
    res.status(404).json({ message: "Todo not found" });
  }
  todo.title = title;
  fs.writeFileSync(filePath, JSON.stringify(allTodos, null, 4), "utf-8");
  res.status(200).json({ message: "Todo updated successfully", todo });
});

todosRouter.delete("/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const allTodos = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const findTodo = allTodos.find((t: { id: string }) => t.id === id);
  if (!findTodo) {
    res.status(404).json({ message: "Todo not found" });
  }
  const todoWithoutId = allTodos.filter((t: { id: string }) => t.id !== id);

  fs.writeFileSync(filePath, JSON.stringify(todoWithoutId, null, 4), "utf-8");

  res.status(200).json({ message: "Todo deleted successfully" });
});

export default todosRouter;
