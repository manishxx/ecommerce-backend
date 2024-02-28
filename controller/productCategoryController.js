const ProductCategory = require("../models/productCategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDBid");
const createProductCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await ProductCategory.create(req.body);
    res.json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
});
const updateProductCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const updatedCategory = await ProductCategory.findOneAndUpdate(
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
const deleteProductCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCategory = await ProductCategory.findByIdAndDelete(id);

    res.json(deletedCategory);
  } catch (error) {
    throw new Error(error);
  }
});
const fetchProductCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const fetchedCategory = await ProductCategory.findById(id);
    res.json(fetchedCategory);
  } catch (error) {
    throw new Error(error);
  }
});
const getAllProductCategories = asyncHandler(async (req, res) => {
  try {
    allCategories = await ProductCategory.find();
    res.json(allCategories);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
  fetchProductCategory,
  getAllProductCategories,
};
