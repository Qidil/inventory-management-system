const transactionService = require('../services/transactionService')

const transactionController = {
  async stockIn(req, res, next) {
    try {
      const { product_id, quantity, note } = req.body
      const userId = req.user.id

      const transaction = await transactionService.stockIn(
        { product_id, quantity: parseInt(quantity), note },
        userId
      )

      res.status(201).json({
        success: true,
        data: {
          id: transaction.id,
          type: transaction.type,
          product_id: transaction.product_id,
          quantity: transaction.quantity,
          note: transaction.note,
          created_at: transaction.created_at,
        },
      })
    } catch (error) {
      if (error.message === 'Produk tidak ditemukan') {
        return res.status(404).json({
          success: false,
          message: error.message,
        })
      }
      if (error.message === 'Jumlah harus lebih dari 0') {
        return res.status(400).json({
          success: false,
          message: error.message,
        })
      }
      next(error)
    }
  },

  async stockOut(req, res, next) {
    try {
      const { product_id, quantity, note } = req.body
      const userId = req.user.id

      const transaction = await transactionService.stockOut(
        { product_id, quantity: parseInt(quantity), note },
        userId
      )

      res.status(201).json({
        success: true,
        data: {
          id: transaction.id,
          type: transaction.type,
          product_id: transaction.product_id,
          quantity: transaction.quantity,
          note: transaction.note,
          created_at: transaction.created_at,
        },
      })
    } catch (error) {
      if (error.message === 'Produk tidak ditemukan') {
        return res.status(404).json({
          success: false,
          message: error.message,
        })
      }
      if (error.message === 'Jumlah harus lebih dari 0') {
        return res.status(400).json({
          success: false,
          message: error.message,
        })
      }
      if (error.message === 'Stok tidak mencukupi') {
        return res.status(422).json({
          success: false,
          message: error.message,
        })
      }
      next(error)
    }
  },

  async findAll(req, res, next) {
    try {
      const { page, limit, type, start_date, end_date } = req.query

      const result = await transactionService.findAll({
        page,
        limit,
        type,
        start_date,
        end_date,
      })

      res.json({
        success: true,
        data: result.transactions,
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

  async findByProductId(req, res, next) {
    try {
      const { productId } = req.params
      const { page, limit } = req.query

      const result = await transactionService.findByProductId(productId, {
        page,
        limit,
      })

      res.json({
        success: true,
        data: result.transactions,
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

  async getDashboard(req, res, next) {
    try {
      const dashboard = await transactionService.getDashboard()

      res.json({
        success: true,
        data: dashboard,
      })
    } catch (error) {
      next(error)
    }
  },

  async getReports(req, res, next) {
    try {
      const { start_date, end_date, type } = req.query

      const reports = await transactionService.getReports({
        start_date,
        end_date,
        type,
      })

      res.json({
        success: true,
        data: reports,
      })
    } catch (error) {
      next(error)
    }
  },
}

module.exports = transactionController