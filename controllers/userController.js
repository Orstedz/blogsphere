import User from "../models/User.js";

export async function getUsers(req, res) {
  try {
    const users = await User.find()
      .populate("role", "name description")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: err.message,
    });
  }
}

export async function createUser(req, res) {
  try {
    const { username, email, password, role } = req.validated;

    const newUser = new User({
      username,
      email,
      password,
      role,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Username or email already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: err.message,
    });
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { username, email, password, role } = req.validated;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, email, password, role },
      { new: true, runValidators: true, omitUndefined: true }
    ).populate("role", "name description");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: err.message,
    });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: err.message,
    });
  }
}
