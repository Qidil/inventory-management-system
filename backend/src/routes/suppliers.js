const express = require('express')
const router = express.Router()
const supplierController = require('../controllers/supplierController')
const { authenticate, authorize } = require('../middleware/auth')

// GET /suppliers - Ambil semua supplier
router.get('/', authenticate, supplierController.getAll)

// GET /suppliers/:id - Ambil supplier berdasarkan ID
router.get('/:id', authenticate, supplierController.getById)

// POST /suppliers - Buat supplier baru (Admin only)
router.post('/', authenticate, authorize('admin'), supplierController.create)

// PUT /suppliers/:id - Update supplier (Admin only)
router.put('/:id', authenticate, authorize('admin'), supplierController.update)

// DELETE /suppliers/:id - Hapus supplier (Admin only)
router.delete('/:id', authenticate, authorize('admin'), supplierController.delete)

module.exports = router