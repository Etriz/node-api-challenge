const express = require("express");
const projectDb = require("./data/helpers/projectModel.js");

const router = express.Router();

router.use("/:id", validateProjectId);

router.get("/", async (req, res, next) => {
  try {
    const data = await projectDb.get();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    next({ status: 500, errorMessage: "Unable to get projects" });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.projId;
    const data = await projectDb.get(id);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    next({ status: 500, errorMessage: "Unable to get projects" });
  }
});

router.post("/", validateProjectBody, async (req, res, next) => {
  try {
    const data = await projectDb.insert(req.body);
    res.status(201).json(data);
  } catch (error) {
    console.log(error);
    next({ status: 500, errorMessage: "Unable to create project" });
  }
});

router.put("/:id", validateProjectBody, async (req, res, next) => {
  try {
    const id = req.projId;
    const data = await projectDb.update(id, req.body);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    next({ status: 500, errorMessage: "Unable to make changes to that project" });
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.projId;
    const data = await projectDb.remove(id);
    data ? res.status(200).json({ message: `Project ${id} deleted` }) : null;
  } catch (error) {
    console.log(error);
    next({ status: 500, errorMessage: "Unable to delete project" });
  }
});

async function validateProjectId(req, res, next) {
  const { id } = req.params;
  const projId = await projectDb.get(id);
  if (projId) {
    req.projId = projId.id;
    next();
  } else next({ status: 404, errorMessage: "Invalid ID" });
}

function validateProjectBody(req, res, next) {
  const { name, description } = req.body;
  if (name && description) {
    next();
  } else next({ status: 400, errorMessage: "Please include a name and description" });
}

module.exports = router;
