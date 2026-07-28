const jwt = require('jsonwebtoken')

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET harus diset di environment variables')
}

function getMidnightExpiry() {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(23, 59, 59, 999)
  return Math.floor((midnight.getTime() - now.getTime()) / 1000)
}

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: getMidnightExpiry(),
  })
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET)
}

module.exports = { generateToken, verifyToken }