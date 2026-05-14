// controllers/user.controller.js
const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");

// Register new user
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, address, role } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            role
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get user profile
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update user
exports.updateUser = async (req, res) => {
    try {
        const { name, email, phone, address, role } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, phone, address, role },
            { new: true }
        ).select("-password");

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Update user role (Admin only)
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User role updated", user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update user status (Admin only)
exports.updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body; // e.g., "active" or "blocked"
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User status updated", user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password'); // exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update logged-in user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { firstName, lastName, email, phone, address } = req.body;

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    const updatedUser = await user.save();
    res.json({ user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};