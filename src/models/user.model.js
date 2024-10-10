import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { imageSchema } from "./global.model.js";

const userSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Auth" },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: imageSchema, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true, select: false },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
  return next();
});

export const User = mongoose.model("User", userSchema);
