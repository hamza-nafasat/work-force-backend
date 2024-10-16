import cookieParser from "cookie-parser";
import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import AuthRoutes from "./routes/auth.routes.js";
import LabourRoutes from "./routes/labour.routes.js";
import ProjectRoutes from "./routes/project.routes.js";
import SensorRoutes from "./routes/sensor.routes.js";
import VehicleRoutes from "./routes/vehicle.routes.js";
import UserRoutes from "./routes/user.routes.js";
import AlertRoutes from "./routes/alert.routes.js";
import GeofenceRoutes from "./routes/geofence.routes.js";
import NotificationRoutes from "./routes/notification.routes.js";
import cors from "cors";

const app = express();

// middlewares
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "https://work-force-frontend.vercel.app"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.get("/", (req, res) => res.send("Hello World!"));
app.use("/api/auth", AuthRoutes);
app.use("/api/labour", LabourRoutes);
app.use("/api/project", ProjectRoutes);
app.use("/api/sensor", SensorRoutes);
app.use("/api/vehicle", VehicleRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/alert", AlertRoutes);
app.use("/api/geofence", GeofenceRoutes);
app.use("/api/notification", NotificationRoutes);

// error handler
app.use(errorHandler);

export default app;
