import mongoose from "mongoose";
import { imageSchema } from "./global.model.js";

const vehicleSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Auth" },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    plateNumber: { type: String, required: true, unique: true },
    idNumber: { type: String, required: true, unique: true },
    color: { type: String, required: true },
    image: { type: imageSchema, required: true },
    sensor: { type: mongoose.Schema.Types.ObjectId, ref: "Sensor" },
  },
  { timestamps: true }
);

export const Vehicle = mongoose.model("Vehicle", vehicleSchema);
