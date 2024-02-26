const express = require("express");

const {
  createProduct,
  getOneProduct,
  getAllProducts,
  deleteOneProduct,
  updateProduct,
} = require("../controller/productController");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();
router.post("/create", authMiddleware, isAdmin, createProduct);

router.get("/products", authMiddleware, isAdmin, getAllProducts);
router.get("/:id", authMiddleware, isAdmin, getOneProduct);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteOneProduct);
router.put("/update/:id", authMiddleware, isAdmin, updateProduct);

module.exports = router;
