const supplierService = require('../services/supplierService')

const supplierController = {
  async getAll(req, res) {
    try {
      const { page, limit, search } = req.query
      const result = await supplierService.findAll({ page, limit, search })
      res.json({
        success: true,
        data: result.data,
        meta: result.meta,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil data supplier',
        code: 'SERVER_ERROR',
      })
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params
      const supplier = await supplierService.findById(id)

      if (!supplier) {
        return res.status(404).json({
          success: false,
          message: 'Supplier tidak ditemukan',
          code: 'NOT_FOUND',
        })
      }

      res.json({
        success: true,
        data: supplier,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil data supplier',
        code: 'SERVER_ERROR',
      })
    }
  },

  async create(req, res) {
    try {
      const { name, phone, email, address } = req.body

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Nama supplier harus diisi',
          code: 'VALIDATION_ERROR',
        })
      }

      const supplier = await supplierService.create({ name, phone, email, address })

      res.status(201).json({
        success: true,
        data: supplier,
      })
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: error.errors[0].message,
          code: 'VALIDATION_ERROR',
        })
      }

      res.status(500).json({
        success: false,
        message: 'Gagal membuat supplier',
        code: 'SERVER_ERROR',
      })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params
      const { name, phone, email, address } = req.body

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Nama supplier harus diisi',
          code: 'VALIDATION_ERROR',
        })
      }

      const supplier = await supplierService.update(id, { name, phone, email, address })

      if (!supplier) {
        return res.status(404).json({
          success: false,
          message: 'Supplier tidak ditemukan',
          code: 'NOT_FOUND',
        })
      }

      res.json({
        success: true,
        data: supplier,
      })
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: error.errors[0].message,
          code: 'VALIDATION_ERROR',
        })
      }

      res.status(500).json({
        success: false,
        message: 'Gagal mengupdate supplier',
        code: 'SERVER_ERROR',
      })
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params
      await supplierService.delete(id)

      res.json({
        success: true,
        message: 'Supplier berhasil dihapus',
      })
    } catch (error) {
      if (error.message === 'Supplier tidak bisa dihapus karena masih memiliki produk') {
        return res.status(400).json({
          success: false,
          message: error.message,
          code: 'VALIDATION_ERROR',
        })
      }

      res.status(500).json({
        success: false,
        message: 'Gagal menghapus supplier',
        code: 'SERVER_ERROR',
      })
    }
  },
}

module.exports = supplierController