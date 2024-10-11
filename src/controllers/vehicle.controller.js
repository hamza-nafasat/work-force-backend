import { isValidObjectId } from "mongoose";
import { Sensor } from "../models/sensor.model.js";
import { Vehicle } from "../models/vehicle.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { removeFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { CustomError } from "../utils/customError.js";
import { Labour } from "../models/labour.model.js";

// Add new vehicle
// ---------------
const addNewVehicle = asyncHandler(async (req, res, next) => {
  let { _id: ownerId } = req?.user?._id;
  let image = req.file;
  const { name, brand, plateNumber, idNumber, color, sensor, driver } = req.body;
  let dataForUpload = {};
  //   validation
  if (!name || !brand || !plateNumber || !idNumber || !color || !image)
    return next(new CustomError(400, "Please Provide All Required Fields"));
  if (sensor) {
    const isExist = await Sensor.findById(sensor);
    if (!isExist || isExist?.isConnected) return next(new CustomError(400, "Sensor is not available"));
    dataForUpload.sensor = sensor;
  }
  if (driver) {
    const isExist = await Labour.findById(driver);
    if (!isExist || isExist?.assignedVehicle) return next(new CustomError(400, "Driver is not available"));
    dataForUpload.driver = driver;
  }
  if (plateNumber) {
    const isExist = await Vehicle.findOne({ plateNumber });
    if (isExist) return next(new CustomError(400, "Plate Number already exists"));
    dataForUpload.plateNumber = plateNumber;
  }
  if (idNumber) {
    const isExist = await Vehicle.findOne({ idNumber });
    if (isExist) return next(new CustomError(400, "ID Number already exists"));
    dataForUpload.idNumber = idNumber;
  }
  //   upload image on cloudinary
  if (image) {
    const imageUploaded = await uploadOnCloudinary(image, "vehicle");
    if (!imageUploaded) return next(new CustomError(400, "Image Upload Failed"));
    image = { url: imageUploaded.secure_url, public_id: imageUploaded.public_id };
  }

  dataForUpload.ownerId = ownerId;
  dataForUpload.name = name;
  dataForUpload.idNumber = idNumber;
  dataForUpload.color = color;
  dataForUpload.image = image;
  dataForUpload.brand = brand;
  const vehicle = await Vehicle.create(dataForUpload);
  const promises = [];
  if (!vehicle) return next(new CustomError(400, "Vehicle Not Added"));
  if (sensor) promises.push(Sensor.findByIdAndUpdate(sensor, { isConnected: true }));
  if (driver) promises.push(Labour.findByIdAndUpdate(driver, { assignedVehicle: vehicle._id }));
  await Promise.all(promises);
  return res.status(200).json({ success: true, message: "Vehicle Added Successfully", data: vehicle });
});

// get all vehicles
// ---------------
const getAllVehicles = asyncHandler(async (req, res, next) => {
  let { _id: ownerId } = req?.user?._id;
  const vehicles = await Vehicle.find({ ownerId: ownerId }).populate("sensor").populate("driver");
  return res.status(200).json({ success: true, data: vehicles });
});

// get single vehicle
// ------------------
const getSingleVehicle = asyncHandler(async (req, res, next) => {
  let { _id: ownerId } = req?.user?._id;
  const { vehicleId } = req.params;
  if (!isValidObjectId(vehicleId)) return next(new CustomError(400, "Invalid Vehicle Id"));
  const vehicle = await Vehicle.findOne({ _id: vehicleId, ownerId: ownerId })
    .populate("driver")
    .populate("sensor");
  if (!vehicle) return next(new CustomError(400, "Vehicle Not Found"));
  return res.status(200).json({ success: true, data: vehicle });
});

// delete single vehicle
// ---------------------
const deleteSingleVehicle = asyncHandler(async (req, res, next) => {
  let { _id: ownerId } = req?.user?._id;
  const { vehicleId } = req.params;
  if (!isValidObjectId(vehicleId)) return next(new CustomError(400, "Invalid Vehicle Id"));
  const vehicle = await Vehicle.findOneAndDelete({ _id: vehicleId, ownerId: ownerId });
  if (!vehicle) return next(new CustomError(400, "Vehicle Not Found"));
  await removeFromCloudinary(vehicle?.image?.public_id);
  if (vehicle?.sensor) await Sensor.findByIdAndUpdate(vehicle?.sensor, { isConnected: false });
  if (vehicle?.driver) await Vehicle.findByIdAndUpdate(vehicle?.driver, { assignedVehicle: null });
  return res.status(200).json({ success: true, message: "Vehicle Deleted Successfully" });
});

// update single vehicle
// ---------------------
const updateSingleVehicle = asyncHandler(async (req, res, next) => {
  let { _id: ownerId } = req?.user?._id;
  const { vehicleId } = req.params;
  if (!isValidObjectId(vehicleId)) return next(new CustomError(400, "Invalid Vehicle Id"));
  const { name, brand, plateNumber, idNumber, color, sensor, driver } = req.body;
  let image = req.file;
  if (!name && !brand && !plateNumber && !idNumber && !color && !image && !sensor && !driver)
    return next(new CustomError(400, "Please Provide at least one field to update"));

  let vehicle = await Vehicle.findOne({ _id: vehicleId, ownerId: ownerId });
  if (!vehicle) return next(new CustomError(400, "Vehicle Not Found"));
  if (name) vehicle.name = name;
  if (brand) vehicle.brand = brand;
  if (plateNumber) {
    const isExist = await Vehicle.findOne({ plateNumber });
    if (isExist) return next(new CustomError(400, "Plate Number already exists"));
    vehicle.plateNumber = plateNumber;
  }
  if (idNumber) {
    const isExist = await Vehicle.findOne({ idNumber });
    if (isExist) return next(new CustomError(400, "ID Number already exists"));
    vehicle.idNumber = idNumber;
  }
  if (color) vehicle.color = color;
  if (image) {
    const [imageUploaded, _] = await Promise.all([
      uploadOnCloudinary(image, "vehicle"),
      removeFromCloudinary(vehicle?.image?.public_id),
    ]);
    if (!imageUploaded) return next(new CustomError(400, "Image Upload Failed"));
    vehicle.image = { url: imageUploaded.secure_url, public_id: imageUploaded.public_id };
  }

  if (sensor && vehicle?.sensor !== sensor) {
    const isExist = await Sensor.findById(sensor);
    if (!isExist || isExist?.isConnected) return next(new CustomError(400, "Sensor is not available"));
    vehicle.sensor = sensor;
  }
  if (driver && vehicle?.driver !== driver) {
    const isExist = await Labour.findById(driver);
    if (!isExist || isExist?.assignedVehicle) return next(new CustomError(400, "Driver is not available"));
    vehicle.driver = driver;
  }

  vehicle = await vehicle.save();
  if (!vehicle) return next(new CustomError(400, "Vehicle Not Updated"));

  const promises = [];
  if (!vehicle) return next(new CustomError(400, "Vehicle Not Added"));
  if (sensor) promises.push(Sensor.findByIdAndUpdate(sensor, { isConnected: true }));
  if (driver) promises.push(Labour.findByIdAndUpdate(driver, { assignedVehicle: vehicle._id }));
  await Promise.all(promises);

  return res.status(200).json({ success: true, message: "Vehicle Updated Successfully", data: vehicle });
});

export { addNewVehicle, deleteSingleVehicle, getAllVehicles, getSingleVehicle, updateSingleVehicle };
