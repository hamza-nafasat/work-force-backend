import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";
import {
  addNewSensor,
  deleteSingleSensor,
  getAllSensors,
  getSingleSensor,
  updateSingleSensor,
} from "../controllers/sensor.controller.js";

const app = express();

app.post("/create", isAuthenticated, singleUpload, addNewSensor);
app
  .route("/single/:sensorId")
  .get(isAuthenticated, getSingleSensor)
  .put(isAuthenticated, singleUpload, updateSingleSensor)
  .delete(isAuthenticated, deleteSingleSensor);

app.get("/all", isAuthenticated, getAllSensors);

export default app;
