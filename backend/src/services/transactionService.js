const { Op } = require('sequelize')
const { StockTransaction, Product, Category, User } = require('../models')
const { sequelize } = require('../models')

const transactionService = {
  async stockIn(data, userId) {
    const transaction = await sequelize.transaction()

    try {
      const { product_id, quantity, note } = data

      // Validate product exists
      const product = await Product.findByPk(product_id, { transaction })
      if (!product) {
        throw new Error('Produk tidak ditemukan')
      }

      // Validate quantity > 0
      if (quantity <= 0) {
        throw new Error('Jumlah harus lebih dari 0')
      }

      // Create transaction record
      const stockTransaction = await StockTransaction.create(
        {
          product_id,
          user_id: userId,
          type: 'IN',
          quantity,
          note,
        },
        { transaction }
      )

      // Update product stock
      await product.update(
        { stock: product.stock + quantity },
        { transaction }
      )

      await transaction.commit()

      return stockTransaction
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async stockOut(data, userId) {
    const transaction = await sequelize.transaction()

    try {
      const { product_id, quantity, note } = data

      // Validate product exists
      const product = await Product.findByPk(product_id, { transaction })
      if (!product) {
        throw new Error('Produk tidak ditemukan')
      }

      // Validate quantity > 0
      if (quantity <= 0) {
        throw new Error('Jumlah harus lebih dari 0')
      }

      // Validate stock sufficient
      if (product.stock < quantity) {
        throw new Error('Stok tidak mencukupi')
      }

      // Create transaction record
      const stockTransaction = await StockTransaction.create(
        {
          product_id,
          user_id: userId,
          type: 'OUT',
          quantity,
          note,
        },
        { transaction }
      )

      // Update product stock
      await product.update(
        { stock: product.stock - quantity },
        { transaction }
      )

      await transaction.commit()

      return stockTransaction
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async findAll({ page = 1, limit = 20, type, start_date, end_date }) {
    const offset = (page - 1) * limit
    const where = {}

    if (type) {
      where.type = type
    }

    if (start_date || end_date) {
      where.created_at = {}
      if (start_date) {
        where.created_at[Op.gte] = new Date(start_date)
      }
      if (end_date) {
        where.created_at[Op.lte] = new Date(end_date)
      }
    }

    const { count, rows } = await StockTransaction.findAndCountAll({
      where,
      include: [
        { model: Product, as: 'product', attributes: ['id', 'code', 'name'] },
        { model: User, as: 'user', attributes: ['id', 'name'] },
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    })

    return {
      transactions: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    }
  },

  async findByProductId(productId, { page = 1, limit = 20 }) {
    const offset = (page - 1) * limit

    const { count, rows } = await StockTransaction.findAndCountAll({
      where: { product_id: productId },
      include: [
        { model: Product, as: 'product', attributes: ['id', 'code', 'name'] },
        { model: User, as: 'user', attributes: ['id', 'name'] },
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    })

    return {
      transactions: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    }
  },

  async getDashboard() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const totalProducts = await Product.count({ where: { deleted_at: null } })
    const totalCategories = await Category.count()

    const stockInToday = await StockTransaction.sum('quantity', {
      where: {
        type: 'IN',
        created_at: { [Op.gte]: today },
      },
    }) || 0

    const stockOutToday = await StockTransaction.sum('quantity', {
      where: {
        type: 'OUT',
        created_at: { [Op.gte]: today },
      },
    }) || 0

    const lowStockProducts = await Product.count({
      where: {
        deleted_at: null,
        stock: { [Op.gt]: 0 },
        minimum_stock: { [Op.gte]: sequelize.col('stock') },
      },
    })

    const outOfStockProducts = await Product.count({
      where: {
        deleted_at: null,
        stock: 0,
      },
    })

    // Chart 7 days
    const chartData = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      const stockIn = await StockTransaction.sum('quantity', {
        where: {
          type: 'IN',
          created_at: { [Op.gte]: date, [Op.lt]: nextDate },
        },
      }) || 0

      const stockOut = await StockTransaction.sum('quantity', {
        where: {
          type: 'OUT',
          created_at: { [Op.gte]: date, [Op.lt]: nextDate },
        },
      }) || 0

      chartData.push({
        date: date.toISOString().split('T')[0],
        in: stockIn,
        out: stockOut,
      })
    }

    // Recent activities
    const recentActivities = await StockTransaction.findAll({
      include: [
        { model: Product, as: 'product', attributes: ['name'] },
        { model: User, as: 'user', attributes: ['name'] },
      ],
      order: [['created_at', 'DESC']],
      limit: 10,
    })

    const formattedActivities = recentActivities.map(t => ({
      type: t.type,
      product: t.product.name,
      quantity: t.quantity,
      user: t.user.name,
      created_at: t.created_at,
    }))

    return {
      total_products: totalProducts,
      total_categories: totalCategories,
      stock_in_today: stockInToday,
      stock_out_today: stockOutToday,
      low_stock_products: lowStockProducts,
      out_of_stock_products: outOfStockProducts,
      chart_7_days: chartData,
      recent_activities: formattedActivities,
    }
  },

  async getReports({ start_date, end_date, type = 'all' }) {
    const where = {}

    if (start_date || end_date) {
      where.created_at = {}
      if (start_date) {
        const startOfDay = new Date(start_date)
        startOfDay.setHours(0, 0, 0, 0)
        where.created_at[Op.gte] = startOfDay
      }
      if (end_date) {
        const endOfDay = new Date(end_date)
        endOfDay.setHours(23, 59, 59, 999)
        where.created_at[Op.lte] = endOfDay
      }
    }

    if (type === 'stock_in') {
      where.type = 'IN'
    } else if (type === 'stock_out') {
      where.type = 'OUT'
    }

    const transactions = await StockTransaction.findAll({
      where,
      include: [
        { model: Product, as: 'product', attributes: ['id', 'code', 'name'] },
        { model: User, as: 'user', attributes: ['id', 'name'] },
      ],
      order: [['created_at', 'DESC']],
    })

    // Calculate summary
    const totalIn = transactions
      .filter(t => t.type === 'IN')
      .reduce((sum, t) => sum + t.quantity, 0)

    const totalOut = transactions
      .filter(t => t.type === 'OUT')
      .reduce((sum, t) => sum + t.quantity, 0)

    return {
      summary: {
        total_in: totalIn,
        total_out: totalOut,
        net_change: totalIn - totalOut,
        transaction_count: transactions.length,
      },
      transactions,
    }
  },
}

module.exports = transactionService