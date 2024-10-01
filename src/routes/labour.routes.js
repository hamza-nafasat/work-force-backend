import express from "express";
import {
  addNewLabour,
  deleteSingleLabour,
  getAllLabours,
  getSingleLabour,
  updateSingleLabour,
} from "../controllers/labour.controller.js";
import { singleUpload } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const app = express();

app.post("/create", isAuthenticated, singleUpload, addNewLabour);
app
  .route("/single/:labourId")
  .get(isAuthenticated, getSingleLabour)
  .put(isAuthenticated, singleUpload, updateSingleLabour)
  .delete(isAuthenticated, deleteSingleLabour);

app.get("/all", isAuthenticated, getAllLabours);

export default app;
