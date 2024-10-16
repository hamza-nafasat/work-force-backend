import app from "./src/app.js";
import { getEnv } from "./src/configs/config.js";
import { connectDB } from "./src/configs/connectDb.js";
import Notification from "./src/models/notification.model.js";
import { configureCloudinary } from "./src/utils/cloudinary.js";

const port = getEnv("PORT");

// (async () => {
//   const newNotification = await Notification.create({
//     to: "66fc01f245059d039bba596f",
//     type: "damage",
//     message: "the sensor is damage",
//     isRead: false,
//   });
// })();
(async () => {
  await configureCloudinary();
  await connectDB(getEnv("MONGODB_URL"));
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})();
