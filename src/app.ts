import express, { Application, Request, Response } from "express";
const app: Application = express();
import fs from "fs";
import path from "path";
import todosRouter from "./app/todos/todos.routes";

app.use(express.json());

app.use("/todos", todosRouter);

app.get("/", (req: Request, res: Response) => {
  console.log(req, res);
  res.send("Welcome to the Todo API!");
});

export default app;
