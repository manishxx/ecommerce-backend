const express = require("express");
const {
  createBlog,
  updateBlog,
  deleteOneBlog,
  getOneBlog,
  getAllBlogs,
  likeBlog,
  dislikeBlog,
} = require("../controller/blogController");
const {
  uploadPhoto,
  blogImgResize,
} = require("../middlewares/uploadImagesMiddleware");
const { uploadImages } = require("../controller/blogController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();
router.post("/create", authMiddleware, isAdmin, createBlog);
router.put("/update/:id", authMiddleware, isAdmin, updateBlog);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteOneBlog);
router.get("/blogs", authMiddleware, isAdmin, getAllBlogs);
router.get("/:id", authMiddleware, isAdmin, getOneBlog);
router.put("/like", authMiddleware, likeBlog);
router.put("/dislike", authMiddleware, dislikeBlog);
router.put(
  "/upload/:id",
  uploadPhoto.array("images", 10),
  blogImgResize,
  uploadImages
);

module.exports = router;
