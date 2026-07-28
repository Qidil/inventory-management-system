const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')
const { authenticate, authorize } = require('../middleware/auth')

// GET /products - Ambil semua produk
router.get('/', authenticate, productController.getAll)

// GET /products/:id - Ambil produk berdasarkan ID
router.get('/:id', authenticate, productController.getById)

// POST /products - Buat produk baru (Admin only)
router.post('/', authenticate, authorize('admin'), productController.create)

// PUT /products/:id - Update produk (Admin only)
router.put('/:id', authenticate, authorize('admin'), productController.update)

// DELETE /products/:id - Hapus produk (Admin only, soft delete)
router.delete('/:id', authenticate, authorize('admin'), productController.delete)

module.exports = router