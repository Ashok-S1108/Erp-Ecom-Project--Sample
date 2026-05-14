// controllers/auth.controller.js
const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Refresh token
exports.refreshToken = (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: "Token required" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });

        const newToken = jwt.sign(
            { id: decoded.id, role: decoded.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ token: newToken });
    });
};
