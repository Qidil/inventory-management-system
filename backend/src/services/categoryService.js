const { Category, Product } = require('../models')

const categoryService = {
  async findAll() {
    return Category.findAll({
      order: [['name', 'ASC']],
    })
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