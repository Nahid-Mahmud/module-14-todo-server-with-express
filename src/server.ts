import app from "./app";

let server;

const port = 5000;

const bootstrapServer = async () => {
  server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

bootstrapServer();
