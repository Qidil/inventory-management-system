const userService = require('../services/userService')

const userController = {
  async getAll(req, res, next) {
    try {
      const { page, limit } = req.query

      const result = await userService.findAll({ page, limit })

      res.json({
        success: true,
        data: result.users,
        meta: {
          page: result.pagination.page,
          limit: result.pagination.limit,
          total: result.pagination.total,
          hasNext: result.pagination.page * result.pagination.limit < result.pagination.total,
        },
      })
    } catch (error) {
      next(error)
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params

      const user = await userService.findById(id)

      res.json({
        success: true,
        data: user,
      })
    } catch (error) {
      if (error.message === 'User tidak ditemukan') {
        return res.status(404).json({
          success: false,
          message: error.message,
        })
      }
      next(error)
    }
  },

  async create(req, res, next) {
    try {
      const { name, email, password, role } = req.body

      const user = await userService.create({ name, email, password, role })

      res.status(201).json({
        success: true,
        data: user,
      })
    } catch (error) {
      if (error.message === 'Email sudah terdaftar') {
        return res.status(409).json({
          success: false,
          message: error.message,
        })
      }
      next(error)
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params
      const { name, email, password, role } = req.body

      const user = await userService.update(id, { name, email, password, role })

      res.json({
        success: true,
        data: user,
      })
    } catch (error) {
      if (error.message === 'User tidak ditemukan') {
        return res.status(404).json({
          success: false,
          message: error.message,
        })
      }
      if (error.message === 'Email sudah terdaftar') {
        return res.status(409).json({
          success: false,
          message: error.message,
        })
      }
      next(error)
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params
      const currentUserId = req.user.id

      await userService.delete(id, currentUserId)

      res.json({
        success: true,
        message: 'User berhasil dihapus',
      })
    } catch (error) {
      if (error.message === 'User tidak ditemukan') {
        return res.status(404).json({
          success: false,
          message: error.message,
        })
      }
      if (error.message === 'Tidak bisa menghapus akun sendiri') {
        return res.status(400).json({
          success: false,
          message: error.message,
        })
      }
      next(error)
    }
  },
}

module.exports = userController