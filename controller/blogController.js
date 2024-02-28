const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { validateMongoDbId } = require("../utils/validateMongoDBid");
const cloudinaryUpload = require("../utils/cloudinary");
const fs = require("fs");
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
    const findBlog = await Blog.findById(id)
      .populate("likes")
      .populate("disLikes");
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
    const updatedBlog = await Blog.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    res.json(updatedBlog);
  } catch (error) {
    throw new Error("could not update", error);
  }
});
const likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoDbId(blogId);
  try {
    const blog = await Blog.findById(blogId);

    const loginUserId = req.user?._id; //find if user logged in and get id

    const isLiked = blog?.isLiked; //find if post is liked
    console.log(isLiked);

    const alreadyDisliked = blog?.dislikes?.find(
      (userId) => userId?.toString() === loginUserId?.toString
    );
    console.log(alreadyDisliked);
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
      res.json(blog);
    }
    if (isLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
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
const dislikeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoDbId(blogId);
  try {
    const blog = await Blog.findById(blogId);

    const loginUserId = req.user?._id; //find if user logged in and get id

    const isDisliked = blog?.isDisliked; //find if post is liked

    const alreadyLiked = blog?.likes?.find(
      (userId) => userId?.toString() === loginUserId?.toString
    );
    console.log(alreadyLiked);
    console.log(alreadyLiked);
    if (alreadyLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        {
          new: true,
        }
      );
      res.json(blog);
    }
    if (isDisliked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { disLikes: loginUserId },
          isDisliked: false,
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
          $push: { disLikes: loginUserId },
          isDisliked: true,
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
const uploadImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const uploader = (path) => cloudinaryUpload(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      console.log(newPath);
      urls.push(newPath);
      fs.unlinkSync(path);
    }
    const findBlog = await Blog.findByIdAndUpdate(
      { _id: id },
      {
        images: urls.map((file) => {
          return file;
        }),
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

module.exports = {
  createBlog,
  getOneBlog,
  updateBlog,
  deleteOneBlog,
  getAllBlogs,
  likeBlog,
  dislikeBlog,
  uploadImages,
};
