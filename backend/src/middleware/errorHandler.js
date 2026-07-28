const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Data tidak valid',
      code: 'VALIDATION_ERROR',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message,
      })),
    })
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: 'Data sudah ada',
      code: 'CONFLICT',
    })
  }

  // Sequelize database error
  if (err.name === 'SequelizeDatabaseError') {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan database',
      code: 'SERVER_ERROR',
    })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid',
      code: 'UNAUTHORIZED',
    })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token sudah expired',
      code: 'UNAUTHORIZED',
    })
  }

  // Custom application errors
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code || 'ERROR',
    })
  }

  // Default server error
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan server',
    code: 'SERVER_ERROR',
  })
}

module.exports = errorHandler