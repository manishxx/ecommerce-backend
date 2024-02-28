const express = require("express");
const {
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  fetchBlogCategory,
  getAllBlogCategories,
} = require("../controller/blogCatController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();
router.post("/create", authMiddleware, isAdmin, createBlogCategory);
router.put("/update/:id", authMiddleware, isAdmin, updateBlogCategory);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteBlogCategory);
router.get("/get-all", authMiddleware, isAdmin, getAllBlogCategories);
router.get("/get/:id", authMiddleware, isAdmin, fetchBlogCategory);
module.exports = router;
