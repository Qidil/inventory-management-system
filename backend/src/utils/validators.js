const validators = {
  validateLogin(data) {
    const errors = []

    if (!data.email) {
      errors.push({ field: 'email', message: 'Email harus diisi' })
    } else if (!this.isValidEmail(data.email)) {
      errors.push({ field: 'email', message: 'Format email tidak valid' })
    }

    if (!data.password) {
      errors.push({ field: 'password', message: 'Password harus diisi' })
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  },

  validateCategory(data) {
    const errors = []

    if (!data.name) {
      errors.push({ field: 'name', message: 'Nama kategori harus diisi' })
    } else if (data.name.length > 100) {
      errors.push({ field: 'name', message: 'Nama kategori maksimal 100 karakter' })
    }

    if (data.description && data.description.length > 1000) {
      errors.push({ field: 'description', message: 'Deskripsi maksimal 1000 karakter' })
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  },

  validateSupplier(data) {
    const errors = []

    if (!data.name) {
      errors.push({ field: 'name', message: 'Nama supplier harus diisi' })
    } else if (data.name.length > 150) {
      errors.push({ field: 'name', message: 'Nama supplier maksimal 150 karakter' })
    }

    if (data.email && !this.isValidEmail(data.email)) {
      errors.push({ field: 'email', message: 'Format email tidak valid' })
    }

    if (data.phone && data.phone.length > 20) {
      errors.push({ field: 'phone', message: 'Nomor telepon maksimal 20 karakter' })
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  },

  validateProduct(data) {
    const errors = []

    if (!data.code) {
      errors.push({ field: 'code', message: 'Kode barang harus diisi' })
    } else if (data.code.length > 30) {
      errors.push({ field: 'code', message: 'Kode barang maksimal 30 karakter' })
    }

    if (!data.name) {
      errors.push({ field: 'name', message: 'Nama barang harus diisi' })
    } else if (data.name.length > 150) {
      errors.push({ field: 'name', message: 'Nama barang maksimal 150 karakter' })
    }

    if (!data.category_id) {
      errors.push({ field: 'category_id', message: 'Kategori harus dipilih' })
    }

    if (!data.supplier_id) {
      errors.push({ field: 'supplier_id', message: 'Supplier harus dipilih' })
    }

    if (!data.price) {
      errors.push({ field: 'price', message: 'Harga harus diisi' })
    } else if (parseFloat(data.price) <= 0) {
      errors.push({ field: 'price', message: 'Harga harus lebih dari 0' })
    }

    if (data.minimum_stock !== undefined && data.minimum_stock < 0) {
      errors.push({ field: 'minimum_stock', message: 'Minimum stok tidak boleh negatif' })
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  },

  validateTransaction(data) {
    const errors = []

    if (!data.product_id) {
      errors.push({ field: 'product_id', message: 'Produk harus dipilih' })
    }

    if (!data.quantity) {
      errors.push({ field: 'quantity', message: 'Jumlah harus diisi' })
    } else if (parseInt(data.quantity) <= 0) {
      errors.push({ field: 'quantity', message: 'Jumlah harus lebih dari 0' })
    }

    if (data.note && data.note.length > 500) {
      errors.push({ field: 'note', message: 'Catatan maksimal 500 karakter' })
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  },

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },
}

module.exports = validators