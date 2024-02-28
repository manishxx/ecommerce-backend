const BlogCategory = require("../models/blogCatModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDBid");
const createBlogCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await BlogCategory.create(req.body);
    res.json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
});
const updateBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const updatedCategory = await BlogCategory.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );

    res.json({ success: true, updatedCategory });
  } catch (error) {
    throw new Error("Errrr while updating" + error);
  }
});
const deleteBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCategory = await BlogCategory.findByIdAndDelete(id);

    res.json(deletedCategory);
  } catch (error) {
    throw new Error(error);
  }
});
const fetchBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const fetchedCategory = await BlogCategory.findById(id);
    res.json(fetchedCategory);
  } catch (error) {
    throw new Error(error);
  }
});
const getAllBlogCategories = asyncHandler(async (req, res) => {
  try {
    allCategories = await BlogCategory.find();
    res.json(allCategories);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  fetchBlogCategory,
  getAllBlogCategories,
};
