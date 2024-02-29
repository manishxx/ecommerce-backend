const express = require("express");
const {
  unBlockUser,
  createUser,
  loginUserCtrl,
  getAllUsers,
  getOneUser,
  deleteOneUser,
  updateOneUser,
  blockUser,
  handleRefreshToken,
  logOut,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdminCtrl,
  getWishlist,
  saveAdress,
  addToCart,
} = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.put("/change-password", authMiddleware, updatePassword);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdminCtrl);
router.get("/users", getAllUsers);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logOut);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/:id", authMiddleware, isAdmin, getOneUser);
router.delete("/delete/:id", deleteOneUser);
router.put("/update/:id", authMiddleware, updateOneUser);
router.put("/save-address", authMiddleware, saveAdress);
router.put("/add-to-cart", authMiddleware, addToCart);

router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unBlockUser);

module.exports = router;
