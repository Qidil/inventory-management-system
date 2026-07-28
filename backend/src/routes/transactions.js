const express = require('express')
const router = express.Router()
const transactionController = require('../controllers/transactionController')
const { authenticate, authorize } = require('../middleware/auth')

// POST /transactions/stock-in - Tambah stok
router.post('/stock-in', authenticate, transactionController.stockIn)

// POST /transactions/stock-out - Kurangi stok
router.post('/stock-out', authenticate, transactionController.stockOut)

// GET /transactions - Riwayat transaksi (filter: type, start_date, end_date)
router.get('/', authenticate, transactionController.findAll)

// GET /transactions/product/:productId - Riwayat transaksi per produk
router.get('/product/:productId', authenticate, transactionController.findByProductId)

// GET /transactions/dashboard - Dashboard statistik
router.get('/dashboard', authenticate, transactionController.getDashboard)

// GET /transactions/reports - Laporan (Admin only)
router.get('/reports', authenticate, authorize('admin'), transactionController.getReports)

module.exports = router