import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Auth" },
    description: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    location: { type: String, required: true },
    labours: [{ type: mongoose.Schema.Types.ObjectId, ref: "Labour" }],
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);
