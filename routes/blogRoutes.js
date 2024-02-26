const express = require("express");
const {
  createBlog,
  updateBlog,
  deleteOneBlog,
  getOneBlog,
  getAllBlogs,
} = require("../controller/blogController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();
router.post("/create", authMiddleware, isAdmin, createBlog);
router.put("/update/:id", authMiddleware, isAdmin, updateBlog);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteOneBlog);
router.get("/blogs", authMiddleware, isAdmin, getAllBlogs);
router.get("/:id", authMiddleware, isAdmin, getOneBlog);

module.exports = router;
