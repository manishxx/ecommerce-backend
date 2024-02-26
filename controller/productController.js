const Products = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const bunyan = require("bunyan");
const log = bunyan.createLogger({ name: "product" });

const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Products.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
  res.json({
    message: "Hey, it's product post route",
  });
});
const getOneProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const findProduct = await Products.findById(id);
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    //filtering products
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Products.find(JSON.parse(queryStr));

    //sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }
    //limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // pagination

    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Products.countDocuments();
      if (skip >= productCount) {
        throw new Error("This page does not exist :)");
      }
    }
    console.log(page, limit, skip);

    const product = await query;

    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteOneProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    await Products.findByIdAndDelete({ _id: id });

    res.json({ message: "deleted" });
  } catch (error) {
    throw new Error(error);
  }
});
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await Products.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    console.log(updatedProduct);
    res.json(updatedProduct);
  } catch (error) {
    throw new Error("could not update", error);
  }
});
module.exports = {
  createProduct,
  getOneProduct,
  getAllProducts,
  deleteOneProduct,
  updateProduct,
};
