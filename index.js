const bodyParser = require("body-parser");
const express = require("express");
const dbConnect = require("./config/dbConnect");
const { errorHandler, notFound } = require("./middlewares/errorHandler");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const cookieParser = require("cookie-parser");
const blogRouter = require("./routes/blogRoutes");
const couponRouter = require("./routes/couponRoutes");

const blogCategoryRouter = require("./routes/blogCatRoutes");
const brandCategoryRouter = require("./routes/brandRoutes");
const productCategoryRouter = require("./routes/productCategoryRoutes");

const morgan = require("morgan");
const { default: slugify } = require("slugify");

dbConnect();
app.use(morgan("dev"));
// save order, save adress, cart, coupon applied pending

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/blog", blogRouter);
app.use("/api/product-category", productCategoryRouter);
app.use("/api/blog-category", blogCategoryRouter);
app.use("/api/brand-category", brandCategoryRouter);
app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
