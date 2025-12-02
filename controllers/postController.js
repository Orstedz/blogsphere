import Post from "../models/Post.js";
import User from "../models/User.js";

export async function getPosts(req, res) {
  try {
    const posts = await Post.find()
      .populate("category", "name")
      .populate("series", "name")
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: posts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching posts",
      error: err.message,
    });
  }
}

export async function createPost(req, res) {
  try {
    const { title, content, category, series, status } = req.validated;

    // Get the latest user ID from the database (most recently created user)
    const defaultUser = await User.findOne().sort({ createdAt: -1 });

    if (!defaultUser) {
      return res.status(400).json({
        success: false,
        message: "No users found. Please create a user first.",
      });
    }

    const newPost = new Post({
      title,
      content,
      category,
      series,
      author: defaultUser._id,
      status: status || "Draft",
    });

    await newPost.save();

    // Populate the references before returning
    await newPost.populate([
      { path: "category", select: "name" },
      { path: "series", select: "name" },
      { path: "author", select: "username email" },
    ]);

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: newPost,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error creating post",
      error: err.message,
    });
  }
}

export async function updatePost(req, res) {
  try {
    const { id } = req.params;
    const { title, content, category, series, status } = req.validated;

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, content, category, series, status },
      { new: true, runValidators: true, omitUndefined: true }
    )
      .populate("category", "name")
      .populate("series", "name")
      .populate("author", "username email");

    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.json({
      success: true,
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating post",
      error: err.message,
    });
  }
}

export async function deletePost(req, res) {
  try {
    const { id } = req.params;

    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting post",
      error: err.message,
    });
  }
}
