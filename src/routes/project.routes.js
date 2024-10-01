import express from "express";

import { singleUpload } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  addNewProject,
  deleteSingleProject,
  getAllProjects,
  getSingleProject,
  updateSingleProject,
} from "../controllers/project.controller.js";

const app = express();

app.post("/create", isAuthenticated, singleUpload, addNewProject);
app
  .route("/single/:projectId")
  .get(isAuthenticated, getSingleProject)
  .put(isAuthenticated, singleUpload, updateSingleProject)
  .delete(isAuthenticated, deleteSingleProject);

app.get("/all", isAuthenticated, getAllProjects);

export default app;
