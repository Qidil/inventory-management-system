const { verifyToken } = require('../utils/jwt')
const { User } = require('../models')

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak ditemukan',
        code: 'UNAUTHORIZED',
      })
    }

    const token = header.split(' ')[1]
    const decoded = verifyToken(token)

    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'name', 'email', 'role'],
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User tidak ditemukan',
        code: 'UNAUTHORIZED',
      })
    }

    req.user = user
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Sesi berakhir, silakan login ulang',
        code: 'UNAUTHORIZED',
      })
    }
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid',
      code: 'UNAUTHORIZED',
    })
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Belum login',
        code: 'UNAUTHORIZED',
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses ke menu ini',
        code: 'FORBIDDEN',
      })
    }

    next()
  }
}

module.exports = { authenticate, authorize }