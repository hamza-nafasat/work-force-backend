import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";
import {
  addNewUser,
  deleteSingleUser,
  getAllUsers,
  getSingleUser,
  updateSingleUser,
} from "../controllers/user.controller.js";

const app = express();

app.post("/create", isAuthenticated, singleUpload, addNewUser);
app
  .route("/single/:userId")
  .get(isAuthenticated, getSingleUser)
  .put(isAuthenticated, singleUpload, updateSingleUser)
  .delete(isAuthenticated, deleteSingleUser);

app.get("/all", isAuthenticated, getAllUsers);

export default app;
