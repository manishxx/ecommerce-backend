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
const morgan = require("morgan");
const { default: slugify } = require("slugify");

dbConnect();
app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
