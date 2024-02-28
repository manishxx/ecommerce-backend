const BrandCategory = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDBid");
const createBrandCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await BrandCategory.create(req.body);
    res.json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
});
const updateBrandCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const updatedCategory = await BrandCategory.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );

    res.json(updatedCategory);
  } catch (error) {
    throw new Error("Errrr while updating" + error);
  }
});
const deleteBrandCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCategory = await BrandCategory.findByIdAndDelete({ _id: id });

    res.json(deletedCategory);
  } catch (error) {
    throw new Error(error);
  }
});
const fetchBrandCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const fetchedCategory = await BrandCategory.findById(id);
    res.json(fetchedCategory);
  } catch (error) {
    throw new Error(error);
  }
});
const getAllBrandCategories = asyncHandler(async (req, res) => {
  try {
    allCategories = await BrandCategory.find();
    res.json(allCategories);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBrandCategory,
  updateBrandCategory,
  deleteBrandCategory,
  fetchBrandCategory,
  getAllBrandCategories,
};
