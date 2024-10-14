import { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { removeFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { CustomError } from "../utils/customError.js";

// Add new user
// ------------
const addNewUser = asyncHandler(async (req, res, next) => {
  let { _id: ownerId } = req?.user?._id;
  const image = req?.file;
  const { firstName, lastName, email, phoneNumber, address, password } = req.body;
  if (!firstName || !lastName || !email || !phoneNumber || !address || !password || !image) {
    return next(new CustomError(400, "Please Provide all required fields"));
  }
  const myCloud = await uploadOnCloudinary(image, "users");
  if (!myCloud?.public_id || !myCloud?.secure_url) {
    return next(new CustomError(400, "Error While Uploading User Image on Cloudinary"));
  }
  const newUser = await User.create({
    ownerId,
    firstName,
    lastName,
    email,
    phoneNumber,
    address,
    image: {
      public_id: myCloud?.public_id,
      url: myCloud?.secure_url,
    },
    password,
  });
  if (!newUser) return next(new CustomError(400, "Error While Registering User"));
  res.status(201).json({ success: true, message: "User Registered Successfully" });
});

// get all users
// -------------
const getAllUsers = asyncHandler(async (req, res, next) => {
  let { _id: ownerId } = req?.user?._id;
  if (req?.user?.ownerId) ownerId = req?.user?.ownerId;
  const users = await User.find({ ownerId: ownerId });
  if (!users) return next(new CustomError(400, "No Users Found"));
  res.status(200).json({ success: true, data: users });
});

// get single user
// ----------------
const getSingleUser = asyncHandler(async (req, res, next) => {
  let { _id: ownerId } = req?.user?._id;
  if (req?.user?.ownerId) ownerId = req?.user?.ownerId;
  const { userId } = req.params;
  if (!isValidObjectId(userId)) return next(new CustomError(400, "Invalid User Id"));
  const user = await User.findOne({ _id: userId, ownerId: ownerId });
  if (!user) return next(new CustomError(400, "User Not Found"));
  res.status(200).json({ success: true, user });
});

// update single user
// ------------------
const updateSingleUser = asyncHandler(async (req, res, next) => {
  let { _id: ownerId } = req?.user?._id;
  const { userId } = req.params;
  if (!isValidObjectId(userId)) return next(new CustomError(400, "Invalid User Id"));
  const image = req?.file;
  const { firstName, lastName, email, phoneNumber, address, password, role } = req.body;
  if (!firstName && !lastName && !email && !phoneNumber && !address && !password && !image && !role)
    return next(new CustomError(400, "Please Provide at least one field to update"));
  const user = await User.findById(userId);
  if (!user) return next(new CustomError(400, "User Not Found"));

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (email) user.email = email;
  if (phoneNumber) user.phoneNumber = phoneNumber;
  if (address) user.address = address;
  if (password) user.password = password;
  if (role) user.role = role;
  if (image) {
    const myCloud = await uploadOnCloudinary(image, "users");
    if (!myCloud?.public_id || !myCloud?.secure_url)
      return next(new CustomError(400, "Error While Uploading User Image on Cloudinary"));
    await removeFromCloudinary(user?.image?.public_id);
    user.image = {
      public_id: myCloud?.public_id,
      url: myCloud?.secure_url,
    };
  }
  await user.save();
  res.status(200).json({ success: true, message: "User Updated Successfully" });
});

// delete single user
// -------------------
const deleteSingleUser = asyncHandler(async (req, res, next) => {
  let { _id: ownerId } = req?.user?._id;
  const { userId } = req.params;
  if (!isValidObjectId(userId)) return next(new CustomError(400, "Invalid User Id"));
  const user = await User.findById(userId);
  if (!user) return next(new CustomError(400, "User Not Found"));
  await removeFromCloudinary(user?.image?.public_id);
  await user.deleteOne();
  res.status(200).json({ success: true, message: "User Deleted Successfully" });
});

export { addNewUser, deleteSingleUser, getAllUsers, getSingleUser, updateSingleUser };
