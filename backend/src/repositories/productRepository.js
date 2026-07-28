const { Product, Category, Supplier } = require('../models')
const { Op } = require('sequelize')

const productRepository = {
  async findAll({ page = 1, limit = 20, search, category_id, supplier_id, status, sort = 'name', order = 'asc' }) {
    const offset = (page - 1) * limit
    const where = { deleted_at: null }

    // Search by name or code
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { code: { [Op.like]: `%${search}%` } },
      ]
    }

    // Filter by category
    if (category_id) {
      where.category_id = category_id
    }

    // Filter by supplier
    if (supplier_id) {
      where.supplier_id = supplier_id
    }

    // Filter by status
    if (status === 'in_stock') {
      where.stock = { [Op.gt]: 0 }
      // Additional condition: stock > minimum_stock
      // We'll handle this in the service layer
    } else if (status === 'out_of_stock') {
      where.stock = 0
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: Supplier, as: 'supplier', attributes: ['id', 'name'] },
      ],
      order: [[sort, order]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    })

    return {
      products: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    }
  },

  async findById(id) {
    return Product.findByPk(id, {
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: Supplier, as: 'supplier', attributes: ['id', 'name'] },
      ],
    })
  },

  async findByCode(code) {
    return Product.findOne({
      where: { code, deleted_at: null },
    })
  },

  async create(data) {
    return Product.create(data)
  },

  async update(id, data) {
    const product = await Product.findByPk(id)
    if (!product) return null

    await product.update(data)
    return product
  },

  async softDelete(id) {
    const product = await Product.findByPk(id)
    if (!product) return null

    await product.update({ deleted_at: new Date() })
    return true
  },

  async count(filters = {}) {
    const where = { deleted_at: null }

    if (filters.lowStock) {
      where.stock = { [Op.lte]: filters.lowStock }
    }

    if (filters.outOfStock) {
      where.stock = 0
    }

    return Product.count({ where })
  },
}

module.exports = productRepository