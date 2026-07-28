const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { authenticate, authorize } = require('../middleware/auth')

// GET /users - Ambil semua user (Admin only)
router.get('/', authenticate, authorize('admin'), userController.getAll)

// GET /users/:id - Ambil user berdasarkan ID (Admin only)
router.get('/:id', authenticate, authorize('admin'), userController.getById)

// POST /users - Buat user baru (Admin only)
router.post('/', authenticate, authorize('admin'), userController.create)

// PUT /users/:id - Update user (Admin only)
router.put('/:id', authenticate, authorize('admin'), userController.update)

// DELETE /users/:id - Hapus user (Admin only, cannot delete self)
router.delete('/:id', authenticate, authorize('admin'), userController.delete)

module.exports = router