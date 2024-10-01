import cookieParser from "cookie-parser";
import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import AuthRoutes from "./routes/auth.routes.js";
import LabourRoutes from "./routes/labour.routes.js";
import ProjectRoutes from "./routes/project.routes.js";

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.get("/", (req, res) => res.send("Hello World!"));
app.use("/api/auth", AuthRoutes);
app.use("/api/labour", LabourRoutes);
app.use("/api/project", ProjectRoutes);

// (async () => {
//   const user = await Auth.create({
//     firstName: "Hamza",
//     lastName: "Nafasat",
//     email: "gyromaster55@gmail.com",
//     password: "hamza.55",
//   });
//   console.log(user, "hlsdkfj;alsjkd;fl");
// })();

// error handler
app.use(errorHandler);

export default app;
