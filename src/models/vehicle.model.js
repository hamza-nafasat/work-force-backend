import mongoose from "mongoose";
import { imageSchema } from "./global.model.js";

const vehicleSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Auth" },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    plateNumber: { type: String, required: true },
    idNumber: { type: String, required: true },
    color: { type: String, required: true },
    image: { type: imageSchema, required: true },
    sensors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sensor" }],
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "Labour" }],
  },
  { timestamps: true }
);

export const Vehicle = mongoose.model("Vehicle", vehicleSchema);
