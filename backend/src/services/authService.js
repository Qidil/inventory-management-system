const bcrypt = require('bcrypt')
const { User } = require('../models')
const { generateToken } = require('../utils/jwt')

async function login(email, password) {
  const user = await User.findOne({ where: { email } })
  if (!user) {
    throw { status: 401, code: 'UNAUTHORIZED', message: 'Email atau password salah' }
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    throw { status: 401, code: 'UNAUTHORIZED', message: 'Email atau password salah' }
  }

  const token = generateToken({ id: user.id, role: user.role })

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  }
}

module.exports = { login }