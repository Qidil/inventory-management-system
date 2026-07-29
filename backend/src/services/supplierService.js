const { Supplier, Product } = require('../models')
const { Op } = require('sequelize')

const supplierService = {
  async findAll({ page = 1, limit = 20, search = '' } = {}) {
    const where = {}
    if (search) {
      where.name = { [Op.like]: `%${search}%` }
    }

    const offset = (page - 1) * limit

    const { rows, count } = await Supplier.findAndCountAll({
      where,
      order: [['name', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    })

    return {
      data: rows,
      meta: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        hasNext: offset + parseInt(limit) < count,
      },
    }
  },

  async findById(id) {
    return Supplier.findByPk(id)
  },

  async create(data) {
    return Supplier.create(data)
  },

  async update(id, data) {
    const supplier = await Supplier.findByPk(id)
    if (!supplier) return null

    await supplier.update(data)
    return supplier
  },

  async delete(id) {
    const supplier = await Supplier.findByPk(id)
    if (!supplier) return null

    // Check if supplier has products
    const productCount = await Product.count({
      where: { supplier_id: id },
    })

    if (productCount > 0) {
      throw new Error('Supplier tidak bisa dihapus karena masih memiliki produk')
    }

    await supplier.destroy()
    return true
  },
}

module.exports = supplierService