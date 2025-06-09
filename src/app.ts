import express, { Application, NextFunction, Request, Response } from "express";
const app: Application = express();
import fs from "fs";
import path from "path";
import todosRouter from "./app/todos/todos.routes";
import morgan from "morgan";

app.use(express.json());
app.use(morgan("combined"));

const customLogger = (req: Request, res: Response, next: NextFunction) => {
  const logMessage = `${new Date().toISOString()} - ${req.method} ${req.originalUrl}`;
  console.log(logMessage);

  next();
};
app.use(customLogger);

app.use("/todos", todosRouter);

app.get("/", (req: Request, res: Response) => {
  // console.log(req, res);
  res.send("Welcome to the Todo API!");
});

app.get("/error", async (req: Request, res: Response, next: NextFunction) => {
  // Simulating an error
  // console.log(first);

  try {
    // console.log(first);
  } catch (error) {
    // console.error("An error occurred:", error);
    next(error);
  }

  res.status(500).json({ message: "This is a simulated error." });
});

// not found handler

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred , Message form global error handler", error: error.message });
  }
});

export default app;
