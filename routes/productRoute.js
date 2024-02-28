const express = require("express");

const {
  createProduct,
  getOneProduct,
  getAllProducts,
  deleteOneProduct,
  updateProduct,
  addToWishList,
  rating,
  uploadImages,
} = require("../controller/productController");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  uploadPhoto,
  productImgResize,
} = require("../middlewares/uploadImagesMiddleware");
const router = express.Router();
router.post("/create", authMiddleware, isAdmin, createProduct);

router.get("/products", authMiddleware, isAdmin, getAllProducts);
router.get("/:id", authMiddleware, isAdmin, getOneProduct);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteOneProduct);
router.put("/update/:id", authMiddleware, isAdmin, updateProduct);
router.put("/wishlist", authMiddleware, addToWishList);
router.put("/rating", authMiddleware, rating);
router.put(
  "/upload/:id",
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadImages
);

module.exports = router;
