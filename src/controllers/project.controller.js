import { isValidObjectId } from "mongoose";
import { Project } from "../models/project.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CustomError } from "../utils/customError.js";

// Add Labour
// ----------
const addNewProject = asyncHandler(async (req, res, next) => {
  const { _id: ownerId } = req?.user?._id;
  let { name, description, startDate, endDate, location, labours, area, position } = req.body;
  if (!name || !description || !startDate || !endDate || !location || !area || !labours || !position) {
    return next(new CustomError(400, "Please Provide all fields"));
  }
  if (!Array.isArray(area)) return next(new CustomError(400, "Area Must Be An Array"));
  if (!Array.isArray(labours)) return next(new CustomError(400, "Labours Must Be An Array"));
  area = area.map((item) => {
    if (!Array.isArray(item)) return next(new CustomError(400, "Area Must Be An Array of Arrays"));
    if (item.length !== 2) return next(new CustomError(400, "Area Must Be An Array of Arrays of length 2"));
    return [Number(item[0]), Number(item[1])];
  });
  let laboursSet = new Set();
  labours.forEach((labour) => {
    if (!isValidObjectId(labour)) return next(new CustomError(400, "Invalid Labour Id"));
    laboursSet.add(String(labour));
  });
  let project;
  try {
    project = await Project.create({
      name,
      area,
      ownerId,
      description,
      startDate,
      position,
      endDate,
      location,
      labours: [...laboursSet],
    });
  } catch (error) {
    // console.log("Error while adding new project", error);
    return next(new CustomError(400, "Error while adding new project"));
  }
  return res.status(201).json({ success: true, message: "Project Added Successfully" });
});

// get single project
// ------------------
const getSingleProject = asyncHandler(async (req, res, next) => {
  const { _id: ownerId } = req?.user?._id;
  const { projectId } = req.params;
  if (!isValidObjectId(projectId)) return next(new CustomError(400, "Invalid Project Id"));
  const project = await Project.findOne({ _id: projectId, ownerId: ownerId });
  if (!project) return next(new CustomError(400, "Project Not Found"));
  return res.status(200).json({ success: true, data: project });
});

// update single project
// --------------------
const updateSingleProject = asyncHandler(async (req, res, next) => {
  const { _id: ownerId } = req?.user?._id;
  const { projectId } = req.params;
  if (!isValidObjectId(projectId)) return next(new CustomError(400, "Invalid Project Id"));
  const { name, description, startDate, endDate, location, labours } = req.body;
  console.log(req.body);
  if (!name && !description && !startDate && !endDate && !location && !labours) {
    return next(new CustomError(400, "Please Provide at least one field to update"));
  }
  if (!Array.isArray(labours)) return next(new CustomError(400, "Labours Must Be An Array"));

  let project = await Project.findOne({ _id: projectId, ownerId: ownerId });
  if (!project) return next(new CustomError(400, "Project Not Found"));
  if (name) project.name = name;
  if (description) project.description = description;
  if (startDate) project.startDate = startDate;
  if (endDate) project.endDate = endDate;
  if (location) project.location = location;
  if (labours) {
    let laboursSet = new Set();
    labours.forEach((labour) => {
      if (!isValidObjectId(labour)) return next(new CustomError(400, "Invalid Labour Id"));
      laboursSet.add(String(labour));
    });
    project.labours = [...laboursSet];
  }

  await project.save();
  return res.status(200).json({ success: true, message: "Project Updated Successfully" });
});

// delete single project
// --------------------
const deleteSingleProject = asyncHandler(async (req, res, next) => {
  const { _id: ownerId } = req?.user?._id;
  const { projectId } = req.params;
  if (!isValidObjectId(projectId)) return next(new CustomError(400, "Invalid Project Id"));
  const project = await Project.findOneAndDelete({ _id: projectId, ownerId: ownerId });
  if (!project) return next(new CustomError(400, "Project Not Found"));
  return res.status(200).json({ success: true, message: "Project Deleted Successfully" });
});

// get all projects
// ----------------
const getAllProjects = asyncHandler(async (req, res, next) => {
  const { _id: ownerId } = req?.user?._id;
  const projects = await Project.find({ ownerId: ownerId }).populate("labours");
  return res.status(200).json({ success: true, data: projects });
});

export { addNewProject, getSingleProject, updateSingleProject, deleteSingleProject, getAllProjects };
