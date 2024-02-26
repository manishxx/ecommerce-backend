const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { validateMongoDbId } = require("../utils/validateMongoDBid");
const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json({
      status: "success",
      newBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});
const getOneBlog = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const findBlog = await Blog.findById(id);
    const updateViews = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      {
        new: true,
      }
    );
    res.json(findBlog);
  } catch (error) {
    throw new Error(error);
  }
});
const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const getBlogs = await Blog.find({}).exec();
    console.log(getBlogs);
    res.json(getBlogs);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteOneBlog = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    await Blog.findByIdAndDelete({ _id: id });

    res.json({ message: "deleted" });
  } catch (error) {
    throw new Error(error);
  }
});
const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const updatedProduct = await Blog.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    console.log(updatedProduct);
    res.json(updatedProduct);
  } catch (error) {
    throw new Error("could not update", error);
  }
});
const likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoDbId(blogId);
  try {
    const blog = Blog.findById(blogId);
    const loginUserId = req.User?._id; //find if user logged in and get id
    const isLiked = blog?.isLiked; //find if post is liked
    const alreadyDisliked = blog?.dislikes?.find(
      (userId = userId?.toString() === loginUserId?.toString)
    );
    if (alreadyDisliked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        {
          new: true,
        }
      );
    }
    if (isLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isLiked: false,
        },
        {
          new: true,
        }
      );
      res.json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: loginUserId },
          isLiked: true,
        },
        {
          new: true,
        }
      );
      res.json(blog);
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBlog,
  getOneBlog,
  updateBlog,
  deleteOneBlog,
  getAllBlogs,
  likeBlog,
};
