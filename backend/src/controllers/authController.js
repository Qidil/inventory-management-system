const authService = require('../services/authService')

async function login(req, res, next) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi',
        code: 'VALIDATION_ERROR',
      })
    }

    const result = await authService.login(email, password)

    res.json({
      success: true,
      data: result,
    })
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({
        success: false,
        message: err.message,
        code: err.code,
      })
    }
    next(err)
  }
}

module.exports = { login }