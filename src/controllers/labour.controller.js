import { isValidObjectId } from "mongoose";
import { Labour } from "../models/labour.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { removeFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { CustomError } from "../utils/customError.js";

// Add Labour
// ----------
const addNewLabour = asyncHandler(async (req, res, next) => {
  const { _id: ownerId } = req?.user?._id;
  const {
    fullName,
    nationality,
    profession,
    status,
    gender,
    dateOfBirth,
    startTime,
    endTime,
    passportOrID,
    phoneNumber,
  } = req.body;
  const image = req.file;
  if (
    !fullName ||
    !nationality ||
    !profession ||
    !status ||
    !passportOrID ||
    !gender ||
    !phoneNumber ||
    !dateOfBirth ||
    !startTime ||
    !endTime ||
    !image
  ) {
    return next(new CustomError(400, "Please Provide all fields"));
  }

  const myCloud = await uploadOnCloudinary(image, "labour");
  if (!myCloud?.public_id || !myCloud?.secure_url) {
    return next(new CustomError(400, "Error While Uploading User Image on Cloudinary"));
  }
  // add new Labour in db
  let newLabour;
  try {
    newLabour = await Labour.create({
      ownerId,
      fullName,
      nationality,
      profession,
      status,
      phoneNumber,
      passportOrID,
      workingHour: {
        startTime,
        endTime,
      },
      gender,
      dateOfBirth,
      image: {
        public_id: myCloud?.public_id,
        url: myCloud?.secure_url,
      },
    });
  } catch (error) {
    await removeFromCloudinary(myCloud?.public_id);
    // console.log("Error while adding new Labour:", error);
    return next(new CustomError(400, "Error While Adding New Labour"));
  }
  return res.status(201).json({ success: true, message: "Labour Added Successfully" });
});

// update single labour
// --------------------
const updateSingleLabour = asyncHandler(async (req, res, next) => {
  const { _id: ownerId } = req?.user?._id;
  const { labourId } = req.params;
  if (!isValidObjectId(labourId)) return next(new CustomError(400, "Invalid Labour Id"));
  const {
    fullName,
    nationality,
    profession,
    status,
    gender,
    dateOfBirth,
    startTime,
    endTime,
    passportOrID,
    phoneNumber,
  } = req.body;
  const image = req.file;
  if (
    !fullName &&
    !nationality &&
    !profession &&
    !status &&
    !passportOrID &&
    !gender &&
    !phoneNumber &&
    !dateOfBirth &&
    !startTime &&
    !endTime &&
    !image
  ) {
    return next(new CustomError(400, "Please Provide At Least One Field"));
  }

  const labour = await Labour.findOne({ _id: labourId, ownerId: ownerId });
  if (!labour) return next(new CustomError(400, "Labour Not Found"));
  if (image) {
    const [removed, myCloud] = await Promise.all([
      removeFromCloudinary(labour?.image?.public_id),
      uploadOnCloudinary(image, "labour"),
    ]);
    if (!myCloud?.public_id || !myCloud?.secure_url) {
      return next(new CustomError(400, "Error While Uploading User Image on Cloudinary"));
    }
    labour.image = { public_id: myCloud?.public_id, url: myCloud?.secure_url };
  }
  if (fullName) labour.fullName = fullName;
  if (nationality) labour.nationality = nationality;
  if (profession) labour.profession = profession;
  if (status) labour.status = status;
  if (gender) labour.gender = gender;
  if (dateOfBirth) labour.dateOfBirth = dateOfBirth;
  if (startTime) labour.workingHour.startTime = startTime;
  if (endTime) labour.workingHour.endTime = endTime;
  if (passportOrID) labour.passportOrID = passportOrID;
  if (phoneNumber) labour.phoneNumber = phoneNumber;
  await labour.save();
  return res.status(200).json({ success: true, message: "Labour Updated Successfully" });
});

// get single Labour
// -----------------
const getSingleLabour = asyncHandler(async (req, res, next) => {
  const { _id: ownerId } = req?.user?._id;
  const { labourId } = req.params;
  if (!isValidObjectId(labourId)) return next(new CustomError(400, "Invalid Labour Id"));
  const labour = await Labour.findOne({ _id: labourId, ownerId: ownerId });
  if (!labour) return next(new CustomError(400, "Labour Not Found"));
  return res.status(200).json({ success: true, data: labour });
});

// delete single Labour
// --------------------
const deleteSingleLabour = asyncHandler(async (req, res, next) => {
  const { _id: ownerId } = req?.user?._id;
  const { labourId } = req.params;
  if (!isValidObjectId(labourId)) return next(new CustomError(400, "Invalid Labour Id"));
  const labour = await Labour.findOneAndDelete({ _id: labourId, ownerId: ownerId });
  if (!labour) return next(new CustomError(400, "Labour Not Found"));
  await removeFromCloudinary(labour?.image?.public_id);
  return res.status(200).json({ success: true, message: "Labour Deleted Successfully" });
});

// get all labours
// ----------------
const getAllLabours = asyncHandler(async (req, res, next) => {
  const { _id: ownerId } = req?.user?._id;
  const labours = await Labour.find({ ownerId: ownerId });
  return res.status(200).json({ success: true, data: labours });
});

export { addNewLabour, updateSingleLabour, getSingleLabour, deleteSingleLabour, getAllLabours };
