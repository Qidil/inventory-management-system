const productRepository = require('../repositories/productRepository')
const { Category, Supplier } = require('../models')

const productService = {
  async findAll(options) {
    return productRepository.findAll(options)
  },

  async findById(id) {
    return productRepository.findById(id)
  },

  async create(data) {
    // Validate category exists
    const category = await Category.findByPk(data.category_id)
    if (!category) {
      throw new Error('Kategori tidak ditemukan')
    }

    // Validate supplier exists
    const supplier = await Supplier.findByPk(data.supplier_id)
    if (!supplier) {
      throw new Error('Supplier tidak ditemukan')
    }

    // Check if code already exists
    const existingProduct = await productRepository.findByCode(data.code)
    if (existingProduct) {
      throw new Error('Kode barang sudah ada')
    }

    // Create product with stock = 0
    return productRepository.create({
      ...data,
      stock: 0,
    })
  },

  async update(id, data) {
    const product = await productRepository.findById(id)
    if (!product) {
      return null
    }

    // Prevent updating stock directly
    if (data.stock !== undefined) {
      throw new Error('Stok tidak bisa diubah langsung, gunakan transaksi stock in/out')
    }

    // Validate category exists if provided
    if (data.category_id) {
      const category = await Category.findByPk(data.category_id)
      if (!category) {
        throw new Error('Kategori tidak ditemukan')
      }
    }

    // Validate supplier exists if provided
    if (data.supplier_id) {
      const supplier = await Supplier.findByPk(data.supplier_id)
      if (!supplier) {
        throw new Error('Supplier tidak ditemukan')
      }
    }

    // Check if code already exists (excluding current product)
    if (data.code) {
      const existingProduct = await productRepository.findByCode(data.code)
      if (existingProduct && existingProduct.id !== id) {
        throw new Error('Kode barang sudah ada')
      }
    }

    return productRepository.update(id, data)
  },

  async softDelete(id) {
    const product = await productRepository.findById(id)
    if (!product) {
      return null
    }

    return productRepository.softDelete(id)
  },

  async countLowStock(threshold) {
    const products = await productRepository.findAll({ limit: 1000 })
    return products.products.filter(p => p.stock > 0 && p.stock <= (threshold || p.minimum_stock)).length
  },

  async countOutOfStock() {
    return productRepository.count({ outOfStock: true })
  },
}

module.exports = productService