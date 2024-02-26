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
} = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.put("/change-password", authMiddleware, updatePassword);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.post("/login", loginUserCtrl);
router.get("/users", getAllUsers);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logOut);

router.get("/:id", authMiddleware, isAdmin, getOneUser);
router.delete("/delete/:id", deleteOneUser);
router.put("/update/:id", authMiddleware, updateOneUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unBlockUser);

module.exports = router;
