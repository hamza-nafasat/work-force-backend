import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";
import {
  addNewVehicle,
  deleteSingleVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateSingleVehicle,
} from "../controllers/vehicle.controller.js";

const app = express();

app.post("/create", isAuthenticated, singleUpload, addNewVehicle);
app
  .route("/single/:vehicleId")
  .get(isAuthenticated, getSingleVehicle)
  .put(isAuthenticated, singleUpload, updateSingleVehicle)
  .delete(isAuthenticated, deleteSingleVehicle);

app.get("/all", isAuthenticated, getAllVehicles);

export default app;
