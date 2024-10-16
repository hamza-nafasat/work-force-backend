import { Schema, model } from "mongoose";

const alertSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "Auth", required: true },
    type: { type: String, required: true },
    severity: { type: String, required: true },
    status: { type: String, default: "enable", enum: ["enable", "disable"] },
    platform: { type: String, enum: ["web", "email"], required: true },
  },
  { timestamps: true }
);

export const Alert = model("Alert", alertSchema);
