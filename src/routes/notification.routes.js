import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";
import {
  addNewNotification,
  deleteSingleNotification,
  getAllNotifications,
  getSingleNotification,
  readAllUnreadNotifications,
  readSingleNotification,
} from "../controllers/notification.controller.js";

const app = express();

app.post("/create", isAuthenticated, addNewNotification);
app
  .route("/single/:notificationId")
  .get(isAuthenticated, getSingleNotification)
  .put(isAuthenticated, readSingleNotification)
  .delete(isAuthenticated, deleteSingleNotification);

app
  .route("/all")
  .get(isAuthenticated, getAllNotifications)
  .put(isAuthenticated, readAllUnreadNotifications);

export default app;
