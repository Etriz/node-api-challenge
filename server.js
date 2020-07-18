const express = require("express");
const projectRouter = require("./projectRouter");
const actionRouter = require("./actionRouter");

const server = express();

server.use(express.json());
server.use("/api/projects", projectRouter);
server.use("/api/actions", actionRouter);

server.get("/", (req, res, next) => {
  try {
    res.status(200).json({ message: "server running", name: "node-api-sprint" });
  } catch (error) {
    console.log(error);
    next({ status: 500, errorMessage: "Unable to get resources" });
  }
});

function errorHandling(error, req, res, next) {
  res.status(error.status).json({ error: error.errorMessage });
}

server.use(errorHandling);

module.exports = server;
