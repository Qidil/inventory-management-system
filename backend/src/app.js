require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const authRoutes = require('./routes/auth')
const { apiLimiter } = require('./middleware/rateLimiter')

const app = express()
const PORT = process.env.PORT || 3000

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use('/api/v1', apiLimiter)

app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'OK', timestamp: new Date().toISOString() })
})

app.use('/api/v1/auth', authRoutes)

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan server',
    code: 'SERVER_ERROR',
  })
})

app.listen(PORT, () => {
  // Server started
})