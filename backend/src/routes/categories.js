const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/categoryController')
const { authenticate, authorize } = require('../middleware/auth')

// GET /categories - Ambil semua kategori
router.get('/', authenticate, categoryController.getAll)

// GET /categories/:id - Ambil kategori berdasarkan ID
router.get('/:id', authenticate, categoryController.getById)

// POST /categories - Buat kategori baru (Admin only)
router.post('/', authenticate, authorize('admin'), categoryController.create)

// PUT /categories/:id - Update kategori (Admin only)
router.put('/:id', authenticate, authorize('admin'), categoryController.update)

// DELETE /categories/:id - Hapus kategori (Admin only)
router.delete('/:id', authenticate, authorize('admin'), categoryController.delete)

module.exports = router