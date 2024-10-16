import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  addNewAlert,
  deleteSingleAlert,
  getAllAlerts,
  getSingleAlert,
  updateSingleAlert,
} from "../controllers/alert.controller.js";

const app = express();

app.post("/create", isAuthenticated, addNewAlert);
app
  .route("/single/:alertId")
  .get(isAuthenticated, getSingleAlert)
  .put(isAuthenticated, updateSingleAlert)
  .delete(isAuthenticated, deleteSingleAlert);

app.get("/all", isAuthenticated, getAllAlerts);

export default app;
