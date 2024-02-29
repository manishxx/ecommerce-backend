const user = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const { validateMongoDbId } = require("../utils/validateMongoDBid");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const sendEmail = require("../controller/emailController");
const crypto = require("crypto");

const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await user.findOne({ email: email });
  if (!findUser) {
    //create a new user
    const newUser = await user.create(req.body);
    res.json(newUser);
    console.log("->");
  } else {
    throw new Error("User already Exists.");
  }
});
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check user exists or not
  const findUser = await user.findOne({ email });

  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = generateRefreshToken(findUser?._id);
    const updateUser = await user.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      firstName: findUser?.firstName,
      lastName: findUser?.lastName,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// admin login
const loginAdminCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check user exists or not
  const findAdmin = await user.findOne({ email });
  if (findAdmin.role != "admin")
    throw new Error("You are not an admin!!! Get out");

  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = generateRefreshToken(findAdmin?._id);
    const updateUser = await user.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findAdmin?._id,
      firstName: findAdmin?.firstName,
      lastName: findAdmin?.lastName,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});
// Handle refresh token

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  console.log(cookie);
  if (!cookie.refreshToken) throw new Error("no refresh token in cookies");
  const refreshToken = cookie.refreshToken;
  console.log(refreshToken);
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("no refresh token");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("there is something wrong with refreshtoken");
    }
    const accessToken = generateRefreshToken(user?._id);
    res.json({ accessToken: accessToken });
  });
});

// LOGOUT

const logOut = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) throw new Error("no refresh token in cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });

  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); //forbidden
  }
  await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(204);
});
//Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await user.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});
const getOneUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const getOneUser = await user.findById(id);
    res.json({
      getOneUser,
    });
  } catch (error) {
    throw new Error("user not found", error);
  }
});
const deleteOneUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteOneUser = await user.findByIdAndDelete({ _id: id });
    res.json({
      deleteOneUser,
    });
  } catch (error) {
    throw new Error("user not found", error);
  }
});
const updateOneUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const updatedUser = await user.findByIdAndUpdate(
      _id,
      {
        firstName: req.body?.firstName,
        lastName: req.body?.lastName,
        email: req.body?.email,
        mobile: req.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json({
      updatedUser,
    });
  } catch (error) {
    throw new Error("user not found", error);
  }
});

// Save User Address

const saveAdress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const userAddress = await User.findByIdAndUpdate(
      _id,
      {
        address: req.body.address,
      },
      {
        new: true,
      }
    );
    res.json(userAddress);
  } catch (error) {
    throw new Error(error);
  }
});
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const block = await user.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      { new: true }
    );
    res.json({
      message: `user with id: ${id} blocked`,
    });
  } catch (error) {
    throw new Error(error);
  }
});
const unBlockUser = asyncHandler(async (req, res) => {
  const { id, firstName } = req.params;
  validateMongoDbId(id);
  try {
    const unblock = await user.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      { new: true }
    );
    res.json({
      message: `user with id: ${id} Unblocked`,
    });
  } catch (error) {
    throw new Error(error);
  }
});
const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);
  const fetchUser = await User.findById(_id);
  if (password) {
    fetchUser.password = password;
    const updatedPassword = await fetchUser.save();
    res.json(updatedPassword);
  } else {
    res.json(fetchUser);
  }
});
const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found with this email");
  }
  try {
    const token = await user.createPasswordResetToken();
    console.log("token!!!::::", token);
    await user.save();
    const resetURL = `Hi, please follow this link to reset your password. This link is valid for 10 minutes from now. <a href = 'http://localhost:5000/api/user/reset-password/${token}'>
    Click Here</a>`;
    const data = {
      to: email,
      text: "hey user",
      subject: "Reset Password Link",
      htm: resetURL,
    };

    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    throw new Error("Token Expired");
  }
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

const getWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate("wishlist");

    res.json(findUser.wishlist);
  } catch (error) {
    throw new Error(error);
  }
});
const addToCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  let { cart } = req.body;
  validateMongoDbId(_id);
  try {
    let products = [];
    const user = await User.findById(_id);

    // Check if the product is already in cart
    const alreadyInCart = await Cart.findOne({ orderBy: user._id });
    console.log(alreadyInCart);
    if (alreadyInCart) {
      cart = cart.filter((item) => item !== alreadyInCart);
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      object.price = getPrice.price;
      products.push(object);
    }
    let cartTotal = 0;
    for (i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }
    let newCart = await new Cart({
      products,
      cartTotal,
      orderBy: user?._id,
    }).save();
    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createUser,
  loginUserCtrl,
  getAllUsers,
  getOneUser,
  deleteOneUser,
  updateOneUser,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  logOut,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdminCtrl,
  getWishlist,
  saveAdress,
  addToCart,
};
