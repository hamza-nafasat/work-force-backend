import { Schema, model } from "mongoose";

const geoFenceSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "Auth", required: true },
    name: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    alertType: { type: String, enum: ["infence", "outfence"], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    labours: { type: [Schema.Types.ObjectId], ref: "Labour", default: [] },
    area: { type: Schema.Types.Array, default: null },
  },
  { timestamps: true }
);

const GeoFence = model("GeoFence", geoFenceSchema);

export default GeoFence;
