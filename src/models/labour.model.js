import mongoose from "mongoose";
import { imageSchema } from "./global.model.js";

const workingHourSchema = new mongoose.Schema(
  {
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { _id: false }
);

const labourSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Auth" },
    fullName: { type: String, required: true },
    nationality: { type: String, required: true },
    passportOrID: { type: String, required: true },
    profession: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    status: { type: String, required: true },
    workingHour: { type: workingHourSchema, required: true },
    gender: { type: String, required: true },
    image: { type: imageSchema, required: true },
    assignedVehicle: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" }],
    sensors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sensor" }],
  },
  { timestamps: true }
);

export const Labour = mongoose.model("Labour", labourSchema);
