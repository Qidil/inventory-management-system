const { Category, Product } = require('../models')
const { Op } = require('sequelize')

const categoryService = {
  async findAll({ page = 1, limit = 20, search = '' } = {}) {
    const where = {}
    if (search) {
      where.name = { [Op.like]: `%${search}%` }
    }

    const offset = (page - 1) * limit

    const { rows, count } = await Category.findAndCountAll({
      where,
      order: [['name', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    })

    const categoriesWithCount = await Promise.all(
      rows.map(async (category) => {
        const productCount = await Product.count({
          where: { category_id: category.id },
        })
        return {
          ...category.toJSON(),
          product_count: productCount,
        }
      })
    )

    return {
      data: categoriesWithCount,
      meta: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        hasNext: offset + parseInt(limit) < count,
      },
    }
  },

  async findById(id) {
    return Category.findByPk(id)
  },

  async create(data) {
    return Category.create(data)
  },

  async update(id, data) {
    const category = await Category.findByPk(id)
    if (!category) return null

    await category.update(data)
    return category
  },

  async delete(id) {
    const category = await Category.findByPk(id)
    if (!category) return null

    // Check if category has products
    const productCount = await Product.count({
      where: { category_id: id },
    })

    if (productCount > 0) {
      throw new Error('Kategori tidak bisa dihapus karena masih memiliki produk')
    }

    await category.destroy()
    return true
  },
}

module.exports = categoryService