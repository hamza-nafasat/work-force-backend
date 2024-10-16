import Notification from "../models/notification.model";
import { asyncHandler } from "../utils/asyncHandler";

// add new notification
// -------------------
const addNewNotification = asyncHandler(async (req, res, next) => {
  const { ownerId } = req?.user?._id;
  const { to, type, message, vehicle, labour } = req.body;
  if (!to || !type || !message) return next(new CustomError(400, "Please Provide all fields"));
  let notificationData = {
    ownerId,
    to,
    type,
    message,
  };
  if (vehicle) notificationData.vehicle = vehicle;
  if (labour) notificationData.labour = labour;

  const notification = await Notification.create(notificationData);
  if (!notification) return next(new CustomError(400, "Notification Not Added"));

  return res.status(200).json({ success: true, message: "Notification Added Successfully" });
});

// get all notification
// ---------------------
const getAllNotifications = asyncHandler(async (req, res, next) => {
  const { _id: ownerId } = req?.user?._id;
  const notifications = await Notification.find({ ownerId: ownerId });
  return res.status(200).json({ success: true, data: notifications });
});

// get single notification
// ------------------------
const getSingleNotification = asyncHandler(async (req, res, next) => {
  const { _id: ownerId } = req?.user?._id;
  const { notificationId } = req.params;
  if (!isValidObjectId(notificationId)) return next(new CustomError(400, "Invalid Notification Id"));
  const notification = await Notification.findOne({ _id: notificationId, ownerId: ownerId });
  if (!notification) return next(new CustomError(400, "Notification Not Found"));
  return res.status(200).json({ success: true, data: notification });
});

// delete single notification
// --------------------------
const deleteSingleNotification = asyncHandler(async (req, res, next) => {
  const { _id: ownerId } = req?.user?._id;
  const { notificationId } = req.params;
  if (!isValidObjectId(notificationId)) return next(new CustomError(400, "Invalid Notification Id"));
  const notification = await Notification.findOneAndDelete({ _id: notificationId, ownerId: ownerId });
  if (!notification) return next(new CustomError(400, "Notification Not Found"));
  return res.status(200).json({ success: true, message: "Notification Deleted Successfully" });
});

// read single notification
// ------------------------
const readSingleNotification = asyncHandler(async (req, res, next) => {
  const { _id: ownerId } = req?.user?._id;
  const { notificationId } = req.params;
  if (!isValidObjectId(notificationId)) return next(new CustomError(400, "Invalid Notification Id"));
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, ownerId: ownerId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
  if (!notification) return next(new CustomError(400, "Notification Not Found"));
  return res.status(200).json({ success: true, message: "Notification Read Successfully" });
});

// read all unread notifications
// ----------------------------
const readAllUnreadNotifications = asyncHandler(async (req, res, next) => {
  const { _id: ownerId } = req?.user?._id;
  const notifications = await Notification.updateMany(
    { ownerId: ownerId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
  if (!notifications) return next(new CustomError(400, "Notifications Not Found"));
  return res.status(200).json({ success: true, message: "Notifications Read Successfully" });
});

export {
  addNewNotification,
  getAllNotifications,
  getSingleNotification,
  deleteSingleNotification,
  readSingleNotification,
  readAllUnreadNotifications,
};
