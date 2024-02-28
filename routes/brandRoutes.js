const express = require("express");
const {
  createBrandCategory,
  updateBrandCategory,
  deleteBrandCategory,
  fetchBrandCategory,
  getAllBrandCategories,
} = require("../controller/brandController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();
router.post("/create", authMiddleware, isAdmin, createBrandCategory);
router.put("/update/:id", authMiddleware, isAdmin, updateBrandCategory);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteBrandCategory);
router.get("/get-all", authMiddleware, isAdmin, getAllBrandCategories);
router.get("/get/:id", authMiddleware, isAdmin, fetchBrandCategory);
module.exports = router;
