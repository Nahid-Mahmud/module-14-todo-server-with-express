import express, { Application, Request, Response } from "express";
const app: Application = express();
import fs from "fs";
import path from "path";

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const filePath = path.join(__dirname, "../src/db/todo.json");

app.get("/", (req: Request, res: Response) => {
  console.log(req, res);
  res.send("Welcome to the Todo API!");
});

app.get("/todos", (req: Request, res: Response) => {
  const data = fs.readFileSync(filePath, "utf-8");
  const todos = JSON.parse(data);

  res.json(todos);
});

app.post("/todos/create-todo", (req: Request, res: Response) => {
  const { title } = req.body;
  console.log(title);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const newTodo = { id, title, createdAt };
  const data = fs.readFileSync(filePath, "utf-8");
  const todos = JSON.parse(data);

  todos.push(newTodo);
  console.log(todos);
  fs.writeFileSync(filePath, JSON.stringify(todos, null, 4), "utf-8");

  //   res.send("Hello, World!");
  res.status(201).json({ message: "Todo created successfully", todo: newTodo });
});

app.get("/todos/:id", (req: Request, res: Response) => {
  const allTodos = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const requestedTodoId = req.params.id;

  const todo = allTodos.find((t: { id: string }) => t.id === requestedTodoId);

  if (!todo) {
    res.status(404).json({ message: "Todo not found" });
  }

  res.status(200).json(todo);
});

app.patch("/todos/:id", (req: Request, res: Response) => {
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

app.delete("/todos/:id", (req: Request, res: Response) => {
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

export default app;
