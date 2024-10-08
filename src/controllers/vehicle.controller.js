import { isValidObjectId } from "mongoose";
import { Project } from "../models/project.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CustomError } from "../utils/customError.js";
import { Vehicle } from "../models/vehicle.model.js";
import { Sensor } from "../models/sensor.model.js";
import { Labour } from "../models/labour.model.js";

// Add new vehicle
// ---------------
const addNewVehicle = asyncHandler(async (req, res, next) => {
  const { _id: ownerId } = req?.user?._id;
  let { sensors } = req.body;
  const { name, brand, plateNumber, idNumber, color } = req.body;
  let image = req.file;
  let sensorsPromises;
  //   validation
  if (!name || !brand || !plateNumber || !idNumber || !color || !image)
    return next(new CustomError(400, "Please Provide All Required Fields"));
  if (sensors) {
    sensorsPromises = [];
    sensors = sensors.split(",");
    sensors.forEach((sensor) => {
      if (!isValidObjectId(sensor)) return next(new CustomError(400, "Invalid Sensor Id"));
      sensorsPromises.push(Sensor.findByIdAndUpdate(sensor, { isConnected: true }));
    });
    const result = await Promise.all(sensorsPromises);
    if (result.includes(null)) return next(new CustomError(400, "Some Sensors Are Not Available"));
  }

  //   upload image on cloudinary
  if (image) {
    const imageUploaded = await uploadOnCloudinary(image, "vehicle");
    if (!imageUploaded) return next(new CustomError(400, "Image Upload Failed"));
    image = { url: imageUploaded.secure_url, public_id: imageUploaded.public_id };
  }

  const vehicle = await Vehicle.create({
    ownerId,
    name,
    brand,
    plateNumber,
    idNumber,
    color,
    image,
    sensors,
  });

  if (!vehicle) return next(new CustomError(400, "Vehicle Not Added"));
  await Promise.all(sensorsPromises);
  return res.status(200).json({ success: true, message: "Vehicle Added Successfully", data: vehicle });
});

// get all vehicles
// ---------------
const getAllVehicles = asyncHandler(async (req, res, next) => {
  const { _id: ownerId } = req?.user?._id;
  const vehicles = await Vehicle.find({ ownerId: ownerId }).populate("sensors");
  return res.status(200).json({ success: true, data: vehicles });
});

// get single vehicle
// ------------------
const getSingleVehicle = asyncHandler(async (req, res, next) => {
  const { _id: ownerId } = req?.user?._id;
  const { vehicleId } = req.params;
  if (!isValidObjectId(vehicleId)) return next(new CustomError(400, "Invalid Vehicle Id"));
  const vehicle = await Vehicle.findOne({ _id: vehicleId, ownerId: ownerId }).populate("sensors");
  if (!vehicle) return next(new CustomError(400, "Vehicle Not Found"));
  return res.status(200).json({ success: true, data: vehicle });
});

// delete single vehicle
// ---------------------
const deleteSingleVehicle = asyncHandler(async (req, res, next) => {
  const { _id: ownerId } = req?.user?._id;
  const { vehicleId } = req.params;
  if (!isValidObjectId(vehicleId)) return next(new CustomError(400, "Invalid Vehicle Id"));
  const vehicle = await Vehicle.findOneAndDelete({ _id: vehicleId, ownerId: ownerId });
  if (!vehicle) return next(new CustomError(400, "Vehicle Not Found"));
  await removeFromCloudinary(vehicle?.image?.public_id);
  return res.status(200).json({ success: true, message: "Vehicle Deleted Successfully" });
});

// update single vehicle
// ---------------------
const updateSingleVehicle = asyncHandler(async (req, res, next) => {
  const { _id: ownerId } = req?.user?._id;
  const { vehicleId } = req.params;
  if (!isValidObjectId(vehicleId)) return next(new CustomError(400, "Invalid Vehicle Id"));
  const { name, brand, plateNumber, idNumber, color } = req.body;
  let image = req.file;
  if (!name && !brand && !plateNumber && !idNumber && !color && !image)
    return next(new CustomError(400, "Please Provide at least one field to update"));

  let vehicle = await Vehicle.findOne({ _id: vehicleId, ownerId: ownerId });
  if (!vehicle) return next(new CustomError(400, "Vehicle Not Found"));

  if (name) vehicle.name = name;
  if (brand) vehicle.brand = brand;
  if (plateNumber) vehicle.plateNumber = plateNumber;
  if (idNumber) vehicle.idNumber = idNumber;
  if (color) vehicle.color = color;
  if (image) {
    const [imageUploaded, _] = await Promise.all([
      uploadOnCloudinary(image, "vehicle"),
      removeFromCloudinary(vehicle?.image?.public_id),
    ]);
    if (!imageUploaded) return next(new CustomError(400, "Image Upload Failed"));
    vehicle.image = { url: imageUploaded.secure_url, public_id: imageUploaded.public_id };
  }
  vehicle = await vehicle.save();
  return res.status(200).json({ success: true, message: "Vehicle Updated Successfully", data: vehicle });
});

export { addNewVehicle, getAllVehicles, getSingleVehicle, deleteSingleVehicle, updateSingleVehicle };
