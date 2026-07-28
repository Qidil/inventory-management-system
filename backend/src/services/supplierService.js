const { Supplier, Product } = require('../models')

const supplierService = {
  async findAll() {
    return Supplier.findAll({
      order: [['name', 'ASC']],
    })
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