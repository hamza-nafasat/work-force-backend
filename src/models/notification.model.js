import { Schema, Types, model } from "mongoose";

const notificationSchema = new Schema(
  {
    to: { type: Types.ObjectId, ref: "Auth", required: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    vehicle: { type: Types.ObjectId, ref: "Vehicle", required: true },
    labour: { type: Types.ObjectId, ref: "Labour", required: true },
    readAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

const Notification = model("Notification", notificationSchema);

export default Notification;
