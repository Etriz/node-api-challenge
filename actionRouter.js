const express = require("express");
const actionDb = require("./data/helpers/actionModel.js");
const projectDb = require("./data/helpers/projectModel.js");

const router = express.Router();

router.use("/:id", validateActionId);

router.get("/", async (req, res, next) => {
  try {
    const data = await actionDb.get();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    next({ status: 500, errorMessage: "Unable to get actions" });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.actionId;
    const data = await actionDb.get(id);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    next({ status: 500, errorMessage: "Unable to get actions" });
  }
});

router.post("/", validateActionBody, validateProjectId, async (req, res, next) => {
  try {
    const data = await actionDb.insert(req.body);
    res.status(201).json(data);
  } catch (error) {
    console.log(error);
    next({ status: 500, errorMessage: "Unable to create new action" });
  }
});

router.put("/:id", validateActionBody, validateProjectId, async (req, res, next) => {
  try {
    const id = req.actionId;
    // const { project_id } = req.body;
    const data = await actionDb.update(id, req.body);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    next({ status: 500, errorMessage: "Unable to change this action" });
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.actionId;
    const data = await actionDb.remove(id);
    data ? res.status(200).json({ message: `Action ${id} deleted` }) : null;
  } catch (error) {
    console.log(error);
    next({ status: 500, errorMessage: "Unable to delete this action" });
  }
});

async function validateProjectId(req, res, next) {
  const { project_id } = req.body;
  const projId = await projectDb.get(project_id);
  if (projId) {
    // req.body.project_id = projId.id;
    next();
  } else next({ status: 404, errorMessage: "Invalid Project ID" });
}

async function validateActionId(req, res, next) {
  const { id } = req.params;
  const actionId = await actionDb.get(id);
  if (actionId) {
    req.actionId = actionId.id;
    next();
  } else next({ status: 404, errorMessage: "Invalid ID" });
}

async function validateActionBody(req, res, next) {
  const { project_id, description, notes } = req.body;
  if (project_id && description && notes) {
    next();
  } else {
    next({ status: 400, errorMessage: "Please include a project id, description and notes" });
  }
}

module.exports = router;
