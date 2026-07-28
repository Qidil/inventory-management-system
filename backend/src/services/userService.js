const { User } = require('../models')
const bcrypt = require('bcrypt')

const userService = {
  async findAll({ page = 1, limit = 20 }) {
    const offset = (page - 1) * limit

    const { count, rows } = await User.findAndCountAll({
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    })

    return {
      users: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    }
  },

  async findById(id) {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    })

    if (!user) {
      throw new Error('User tidak ditemukan')
    }

    return user
  },

  async create(data) {
    const { name, email, password, role } = data

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      throw new Error('Email sudah terdaftar')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'staff',
    })

    // Return without password
    const userData = user.toJSON()
    delete userData.password
    return userData
  },

  async update(id, data) {
    const user = await User.findByPk(id)

    if (!user) {
      throw new Error('User tidak ditemukan')
    }

    const { name, email, password, role } = data

    // Check if email already exists (excluding current user)
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } })
      if (existingUser) {
        throw new Error('Email sudah terdaftar')
      }
    }

    // Hash password if provided
    let updateData = { name, email, role }
    if (password) {
      const salt = await bcrypt.genSalt(10)
      updateData.password = await bcrypt.hash(password, salt)
    }

    await user.update(updateData)

    // Return without password
    const userData = user.toJSON()
    delete userData.password
    return userData
  },

  async delete(id, currentUserId) {
    const user = await User.findByPk(id)

    if (!user) {
      throw new Error('User tidak ditemukan')
    }

    // Cannot delete self
    if (id === currentUserId) {
      throw new Error('Tidak bisa menghapus akun sendiri')
    }

    await user.destroy()

    return true
  },
}

module.exports = userService