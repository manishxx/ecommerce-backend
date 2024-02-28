const express = require("express");
const {
  createCoupon,
  getAllCoupon,
  deleteCoupon,
  updateCoupon,
  getCoupon,
} = require("../controller/couponController");
const router = express.Router();
router.post("/create", createCoupon);
router.get("/get-all", getAllCoupon);
router.delete("/delete/:id", deleteCoupon);
router.put("/update/:id", updateCoupon);
router.get("/get/:id", getCoupon);
module.exports = router;
