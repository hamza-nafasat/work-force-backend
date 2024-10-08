import express from "express";
import {
  addNewSensor,
  deleteSingleSensor,
  getAllSensors,
  getSingleSensor,
  updateSingleSensor,
} from "../controllers/sensor.controller.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const app = express();

app.post("/create", isAuthenticated, addNewSensor);
app
  .route("/single/:sensorId")
  .get(isAuthenticated, getSingleSensor)
  .put(isAuthenticated, updateSingleSensor)
  .delete(isAuthenticated, deleteSingleSensor);

app.get("/all", isAuthenticated, getAllSensors);

export default app;
