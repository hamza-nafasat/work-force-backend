import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Auth" },
    name: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    area: [{ type: [Number, Number], required: true }],
    location: { type: String, required: true },
    position: { type: [Number, Number], required: true },
    labours: [{ type: mongoose.Schema.Types.ObjectId, ref: "Labour" }],
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);
