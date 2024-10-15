import { isValidObjectId } from "mongoose";
import { Labour } from "../models/labour.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { removeFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { CustomError } from "../utils/customError.js";
import GeoFence from "../models/geofence.model.js";

// Add Geofence
// ------------
const addNewGeofence = asyncHandler(async (req, res, next) => {
  let { _id: ownerId } = req?.user?._id;
  const { name, alertType, status, startDate, endDate, labours, area } = req.body;
  if (!name || !alertType || !status || !startDate || !endDate || !labours || !area) {
    return next(new CustomError(400, "Please Provide all fields"));
  }
  if (!Array.isArray(labours)) return next(new CustomError(400, "Labours Must Be An Array"));

  let laboursSet = new Set();
  labours.forEach((labour) => {
    if (!isValidObjectId(labour)) return next(new CustomError(400, "Invalid Labour Id"));
    laboursSet.add(String(labour));
  });
  const geofence = await GeoFence.create({
    name,
    ownerId,
    alertType,
    status,
    startDate,
    endDate,
    labours: [...laboursSet],
    area,
  });

  return res.status(200).json({ success: true, message: "Geofence Added Successfully" });
});

// get all geofences
// ----------------
const getAllGeofences = asyncHandler(async (req, res, next) => {
  let { _id: ownerId } = req?.user?._id;
  if (req?.user?.ownerId) ownerId = req?.user?.ownerId;
  const geofences = await GeoFence.find({ ownerId: ownerId });
  return res.status(200).json({ success: true, data: geofences });
});

// get single geofence
// -------------------
const getSingleGeofence = asyncHandler(async (req, res, next) => {
  let { _id: ownerId } = req?.user?._id;
  if (req?.user?.ownerId) ownerId = req?.user?.ownerId;
  const { geofenceId } = req.params;
  if (!isValidObjectId(geofenceId)) return next(new CustomError(400, "Invalid Geofence Id"));
  const geofence = await GeoFence.findOne({ _id: geofenceId, ownerId: ownerId });
  if (!geofence) return next(new CustomError(400, "Geofence Not Found"));
  return res.status(200).json({ success: true, data: geofence });
});

// delete single geofence
// --------------------
const deleteSingleGeofence = asyncHandler(async (req, res, next) => {
  let { _id: ownerId } = req?.user?._id;
  const { geofenceId } = req.params;
  if (!isValidObjectId(geofenceId)) return next(new CustomError(400, "Invalid Geofence Id"));
  const geofence = await GeoFence.findOneAndDelete({ _id: geofenceId, ownerId: ownerId });
  if (!geofence) return next(new CustomError(400, "Geofence Not Found"));
  await removeFromCloudinary(geofence?.image?.public_id);
  return res.status(200).json({ success: true, message: "Geofence Deleted Successfully" });
});

// update single geofence
// ----------------------
const updateSingleGeofence = asyncHandler(async (req, res, next) => {
  let { _id: ownerId } = req?.user?._id;
  const { geofenceId } = req.params;
  const { name, alertType, status, startDate, endDate, labours, area } = req.body;
  if (!name || !alertType || !status || !startDate || !endDate || !labours || !area) {
    return next(new CustomError(400, "Please Provide all fields"));
  }
  if (!isValidObjectId(geofenceId)) return next(new CustomError(400, "Invalid Geofence Id"));
  const geofence = await GeoFence.findOne({ _id: geofenceId, ownerId: ownerId });
  if (!geofence) return next(new CustomError(400, "Geofence Not Found"));

  let laboursSet = new Set();
  labours.forEach((labour) => {
    if (!isValidObjectId(labour)) return next(new CustomError(400, "Invalid Labour Id"));
    laboursSet.add(String(labour));
  });
  geofence.name = name;
  geofence.alertType = alertType;
  geofence.status = status;
  geofence.startDate = startDate;
  geofence.endDate = endDate;
  geofence.labours = [...laboursSet];
  geofence.area = area;
  await geofence.save();
  return res.status(200).json({ success: true, message: "Geofence Updated Successfully" });
});

export { addNewGeofence, getAllGeofences, getSingleGeofence, deleteSingleGeofence, updateSingleGeofence };
