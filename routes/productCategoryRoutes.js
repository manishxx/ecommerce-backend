const express = require("express");
const {
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
  fetchProductCategory,
  getAllProductCategories,
} = require("../controller/productCategoryController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();
router.post("/create", authMiddleware, isAdmin, createProductCategory);
router.put("/update/:id", authMiddleware, isAdmin, updateProductCategory);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteProductCategory);
router.get("/get-all", authMiddleware, isAdmin, getAllProductCategories);
router.get("/get/:id", authMiddleware, isAdmin, fetchProductCategory);
module.exports = router;
