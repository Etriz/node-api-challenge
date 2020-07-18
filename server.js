const express = require("express");

const server = express();

server.use(express.json());

server.get("/", (req, res, next) => {
  try {
    res.status(200).json({ message: "server running", name: "node-api-sprint" });
  } catch (error) {
    console.log(error);
    next({ status: 500, errorMessage: "Unable to get resources" });
  }
});

module.exports = server;
