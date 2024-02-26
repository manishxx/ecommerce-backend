const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,

      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      ref: "category",
    },
    brand: {
      type: String,
      required: true,
    },
    quantity: { type: Number, required: true },
    sold: {
      type: Number,
      default: 0,
      select: false,
    },
    images: [
      {
        type: Array,
      },
    ],
    color: {
      type: String,
      enum: ["Black", "Brown", "Red"],
    },
    ratings: [
      {
        star: Number,
        postedBy: { type: String, ref: "User" },
      },
    ],
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Products", productSchema);
