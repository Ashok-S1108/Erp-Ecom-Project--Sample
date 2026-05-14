// routes/user.routes.js


const express = require('express');
const router = express.Router();
const {
    registerUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,getUserProfile,updateUserProfile
} = require('../controllers/user.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');


// Public
router.post('/register', registerUser);

// Protected
router.get('/', protect, adminOnly, getAllUsers); // Only admin can see all users
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, adminOnly, deleteUser);
// GET /api/users/profile -> get logged-in user's data
router.get('/profile', protect, getUserProfile);

// PUT /api/users/profile -> update logged-in user's data
router.put('/profile', protect, updateUserProfile);

module.exports = router;
