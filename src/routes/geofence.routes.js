import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  addNewGeofence,
  deleteSingleGeofence,
  getAllGeofences,
  getSingleGeofence,
  updateSingleGeofence,
} from "../controllers/geofence.controller.js";

const app = express();

app.post("/create", isAuthenticated, addNewGeofence);
app
  .route("/single/:geofenceId")
  .get(isAuthenticated, getSingleGeofence)
  .put(isAuthenticated, updateSingleGeofence)
  .delete(isAuthenticated, deleteSingleGeofence);

app.get("/all", isAuthenticated, getAllGeofences);

export default app;
