const categoryService = require('../services/categoryService')

const categoryController = {
  async getAll(req, res) {
    try {
      const categories = await categoryService.findAll()
      res.json({
        success: true,
        data: categories,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil data kategori',
        code: 'SERVER_ERROR',
      })
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params
      const category = await categoryService.findById(id)

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Kategori tidak ditemukan',
          code: 'NOT_FOUND',
        })
      }

      res.json({
        success: true,
        data: category,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil data kategori',
        code: 'SERVER_ERROR',
      })
    }
  },

  async create(req, res) {
    try {
      const { name, description } = req.body

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Nama kategori harus diisi',
          code: 'VALIDATION_ERROR',
        })
      }

      const category = await categoryService.create({ name, description })

      res.status(201).json({
        success: true,
        data: category,
      })
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          success: false,
          message: 'Nama kategori sudah ada',
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

      res.status(500).json({
        success: false,
        message: 'Gagal membuat kategori',
        code: 'SERVER_ERROR',
      })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params
      const { name, description } = req.body

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Nama kategori harus diisi',
          code: 'VALIDATION_ERROR',
        })
      }

      const category = await categoryService.update(id, { name, description })

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Kategori tidak ditemukan',
          code: 'NOT_FOUND',
        })
      }

      res.json({
        success: true,
        data: category,
      })
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          success: false,
          message: 'Nama kategori sudah ada',
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

      res.status(500).json({
        success: false,
        message: 'Gagal mengupdate kategori',
        code: 'SERVER_ERROR',
      })
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params
      await categoryService.delete(id)

      res.json({
        success: true,
        message: 'Kategori berhasil dihapus',
      })
    } catch (error) {
      if (error.message === 'Kategori tidak bisa dihapus karena masih memiliki produk') {
        return res.status(400).json({
          success: false,
          message: error.message,
          code: 'VALIDATION_ERROR',
        })
      }

      res.status(500).json({
        success: false,
        message: 'Gagal menghapus kategori',
        code: 'SERVER_ERROR',
      })
    }
  },
}

module.exports = categoryController