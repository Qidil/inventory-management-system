const productService = require('../services/productService')
const { StockTransaction } = require('../models')

const productController = {
  async getAll(req, res) {
    try {
      const { page, limit, search, category_id, supplier_id, status, sort, order } = req.query

      const result = await productService.findAll({
        page,
        limit,
        search,
        category_id,
        supplier_id,
        status,
        sort,
        order,
      })

      res.json({
        success: true,
        data: result.products,
        meta: {
          page: result.pagination.page,
          limit: result.pagination.limit,
          total: result.pagination.total,
          totalPages: result.pagination.totalPages,
        },
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil data produk',
        code: 'SERVER_ERROR',
      })
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params
      const product = await productService.findById(id)

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Produk tidak ditemukan',
          code: 'NOT_FOUND',
        })
      }

      // Get transaction history
      const transactions = await StockTransaction.findAll({
        where: { product_id: id },
        include: ['user'],
        order: [['created_at', 'DESC']],
        limit: 10,
      })

      res.json({
        success: true,
        data: {
          ...product.toJSON(),
          transactions,
        },
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil data produk',
        code: 'SERVER_ERROR',
      })
    }
  },

  async create(req, res) {
    try {
      const { code, name, category_id, supplier_id, description, price, minimum_stock } = req.body

      if (!code || !name || !category_id || !supplier_id || !price) {
        return res.status(400).json({
          success: false,
          message: 'Data tidak lengkap',
          code: 'VALIDATION_ERROR',
        })
      }

      const product = await productService.create({
        code,
        name,
        category_id,
        supplier_id,
        description,
        price,
        minimum_stock,
      })

      res.status(201).json({
        success: true,
        data: product,
      })
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          success: false,
          message: 'Kode barang sudah ada',
          code: 'CONFLICT',
        })
      }

      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: error.errors[0].message,
          code: 'VALIDATION_ERROR',
        })
      }

      if (error.message === 'Kategori tidak ditemukan' || error.message === 'Supplier tidak ditemukan') {
        return res.status(400).json({
          success: false,
          message: error.message,
          code: 'VALIDATION_ERROR',
        })
      }

      res.status(500).json({
        success: false,
        message: 'Gagal membuat produk',
        code: 'SERVER_ERROR',
      })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params
      const { code, name, category_id, supplier_id, description, price, minimum_stock } = req.body

      if (!code || !name || !category_id || !supplier_id || !price) {
        return res.status(400).json({
          success: false,
          message: 'Data tidak lengkap',
          code: 'VALIDATION_ERROR',
        })
      }

      const product = await productService.update(id, {
        code,
        name,
        category_id,
        supplier_id,
        description,
        price,
        minimum_stock,
      })

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Produk tidak ditemukan',
          code: 'NOT_FOUND',
        })
      }

      res.json({
        success: true,
        data: product,
      })
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          success: false,
          message: 'Kode barang sudah ada',
          code: 'CONFLICT',
        })
      }

      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: error.errors[0].message,
          code: 'VALIDATION_ERROR',
        })
      }

      if (error.message.includes('tidak ditemukan') || error.message.includes('tidak bisa diubah')) {
        return res.status(400).json({
          success: false,
          message: error.message,
          code: 'VALIDATION_ERROR',
        })
      }

      res.status(500).json({
        success: false,
        message: 'Gagal mengupdate produk',
        code: 'SERVER_ERROR',
      })
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params
      const result = await productService.softDelete(id)

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Produk tidak ditemukan',
          code: 'NOT_FOUND',
        })
      }

      res.json({
        success: true,
        message: 'Produk berhasil dihapus',
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal menghapus produk',
        code: 'SERVER_ERROR',
      })
    }
  },
}

module.exports = productController