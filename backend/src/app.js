require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const authRoutes = require('./routes/auth')
const categoryRoutes = require('./routes/categories')
const supplierRoutes = require('./routes/suppliers')
const productRoutes = require('./routes/products')
const { apiLimiter } = require('./middleware/rateLimiter')
const errorHandler = require('./middleware/errorHandler')

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
app.use('/api/v1/categories', categoryRoutes)
app.use('/api/v1/suppliers', supplierRoutes)
app.use('/api/v1/products', productRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
  // Server started
})