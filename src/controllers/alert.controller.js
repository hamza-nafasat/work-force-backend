import { isValidObjectId } from "mongoose";
import { Alert } from "../models/alert.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CustomError } from "../utils/customError.js";

// add new alert
// -------------
const addNewAlert = asyncHandler(async (req, res, next) => {
  const { _id: ownerId } = req?.user;
  const { type, severity, status, platform } = req.body;
  console.log(req.body);
  if (!type || !severity || !platform || !status) {
    console.log(type, severity, status, platform);
    return next(new CustomError(400, "Please Provide all fields"));
  }
  const isExist = await Alert.findOne({ type, platform });
  if (isExist) return next(new CustomError(400, "Alert Already Exist"));
  const alertData = {
    ownerId,
    type,
    severity,
    status,
    platform,
  };
  const alert = await Alert.create(alertData);
  if (!alert) return next(new CustomError(400, "Alert Not Added"));
  return res.status(200).json({ success: true, message: "Alert Added Successfully" });
});

// get all alerts
// ---------------
const getAllAlerts = asyncHandler(async (req, res, next) => {
  const { _id: ownerId } = req?.user;
  const alerts = await Alert.find({ ownerId: ownerId });
  return res.status(200).json({ success: true, data: alerts });
});

// get single alert
// ----------------
const getSingleAlert = asyncHandler(async (req, res, next) => {
  const { _id: ownerId } = req?.user;
  const { alertId } = req.params;
  if (!isValidObjectId(alertId)) return next(new CustomError(400, "Invalid Alert Id"));
  const alert = await Alert.findOne({ _id: alertId, ownerId: ownerId });
  if (!alert) return next(new CustomError(400, "Alert Not Found"));
  return res.status(200).json({ success: true, data: alert });
});

// delete single alert
// ------------------
const deleteSingleAlert = asyncHandler(async (req, res, next) => {
  const { _id: ownerId } = req?.user;
  const { alertId } = req.params;
  if (!isValidObjectId(alertId)) return next(new CustomError(400, "Invalid Alert Id"));
  const alert = await Alert.findOneAndDelete({ _id: alertId, ownerId: ownerId });
  if (!alert) return next(new CustomError(400, "Alert Not Found"));
  return res.status(200).json({ success: true, message: "Alert Deleted Successfully" });
});

// update single alert
// ------------------
const updateSingleAlert = asyncHandler(async (req, res, next) => {
  const { _id: ownerId } = req?.user;
  const { alertId } = req.params;
  if (!isValidObjectId(alertId)) return next(new CustomError(400, "Invalid Alert Id"));
  const { type, severity, status, platform } = req.body;
  if (!type && !severity && !status && !platform)
    return next(new CustomError(400, "Please Provide at least one field to update"));
  const isExist = await Alert.findOne({ _id: { $ne: alertId }, type, platform });
  if (isExist) return next(new CustomError(400, "Alert Already Exist"));

  const alert = await Alert.findOne({ _id: alertId, ownerId: ownerId });
  if (!alert) return next(new CustomError(400, "Alert Not Found"));

  if (type) alert.type = type;
  if (severity) alert.severity = severity;
  if (status) alert.status = status;
  if (platform) alert.platform = platform;
  await alert.save();
  return res.status(200).json({ success: true, message: "Alert Updated Successfully" });
});

export { addNewAlert, deleteSingleAlert, getAllAlerts, getSingleAlert, updateSingleAlert };
